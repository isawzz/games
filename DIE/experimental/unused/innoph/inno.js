define(["dojo", "dojo/_base/declare", "ebg/core/gamegui", "ebg/counter", "ebg/zone"], function(_1, _2) {
	return _2("bgagame.innovation", ebg.core.gamegui, {
			constructor: function() {
					console.log("innovation constructor");
					this.zone = {};
					this.counter = {};
					this.my_score_verso_window = new dijit.Dialog({
							"title": _("Cards in your score pile (opponents cannot see this)")
					});
					this.card_dimensions = {
							"S recto": {
									"width": 33,
									"height": 47
							},
							"S card": {
									"width": 47,
									"height": 33
							},
							"M card": {
									"width": 182,
									"height": 126
							},
							"L recto": {
									"width": 316,
									"height": 456
							},
							"L card": {
									"width": 456,
									"height": 316
							},
					};
					this.large_screen_width_limit = 1621;
					this.main_area_width_limit = 1151;
					this.my_hand_padding = 5;
					this.overlap_for_unsplayed = 3;
					this.overlap_for_splay = {
							"M card": {
									"compact": 3,
									"expanded": 58
							}
					};
					this.HTML_class = {};
					this.HTML_class.my_hand = "M card";
					this.HTML_class.opponent_hand = "S recto";
					this.HTML_class.deck = "S recto";
					this.HTML_class.board = "M card";
					this.HTML_class.score = "S recto";
					this.HTML_class.my_score_verso = "M card";
					this.HTML_class.revealed = "M card";
					this.HTML_class.achievements = "S recto";
					this.HTML_class.special_achievements = "S card";
					this.nb_cards_in_row = {};
					this.nb_cards_in_row.my_hand = null;
					this.nb_cards_in_row.opponent_hand = null;
					this.nb_cards_in_row.deck = 15;
					this.nb_cards_in_row.score = null;
					this.nb_cards_in_row.my_score_verso = null;
					this.nb_cards_in_row.revealed = 1;
					this.nb_cards_in_row.achievements = null;
					this.delta = {};
					this.delta.my_hand = {
							"x": 189,
							"y": 133
					};
					this.delta.opponent_hand = {
							"x": 35,
							"y": 49
					};
					this.delta.deck = {
							"x": 3,
							"y": 3
					};
					this.delta.score = {
							"x": 35,
							"y": 49
					};
					this.delta.my_score_verso = {
							"x": 189,
							"y": 133
					};
					this.delta.revealed = {
							"x": 189,
							"y": 133
					};
					this.delta.achievements = {
							"x": 35,
							"y": 49
					};
					this.incremental_id = 0;
					this.system_offset = 1000;
					this.selected_card = null;
					this.display_mode = null;
					this.view_full = null;
					this.arrows_for_expanded_mode = "&gt;&gt; &lt;&lt;";
					this.arrows_for_compact_mode = "&lt;&lt; &gt;&gt;";
					this.text_for_expanded_mode = _("Show compact");
					this.text_for_compact_mode = _("Show expanded");
					this.text_for_view_normal = _("Look at all cards in piles");
					this.text_for_view_full = _("Resume normal view");
					this.number_of_splayed_piles = null;
					this.players = null;
					this.saved_cards = {};
					this.saved_HTML_cards = {};
					this.just_setupped = null;
					this.publication_permuted_zone = null;
					this.publication_permutations_done = null;
					this.publication_original_items = null;
					this.color_pile = null;
					this.choose_two_colors = null;
					this.first_chosen_color = null;
					this.normal_achievement_names = null;
					this.deactivated_cards = null;
					this.deactivated_cards_important = null;
					this.erased_pagemaintitle_text = null;
			},
			debug_draw: function() {
					var _3 = document.getElementById("debug_card_list");
					self = this;
					this.ajaxcall("/innovation/innovation/debug_draw.html", {
							lock: true,
							card_id: _3.selectedIndex
					}, this, function(_4) {}, function(_5) {});
			},
			setup: function(_6) {
					_1.destroy("debug_output");
					if (!this.isSpectator && _6.debug_card_list) {
							var _7 = $("main_area");
							_7.innerHTML = "<select id='debug_card_list'></select><button id='debug_draw'>DRAW THIS CARD</button>" + _7.innerHTML;
							for (var id = 0; id < _6.debug_card_list.length; id++) {
									$("debug_card_list").innerHTML += "<option value='card_'" + id + ">" + id + " - " + _6.debug_card_list[id] + "</option>";
							}
							_1.connect($("debug_draw"), "onclick", this, "debug_draw");
					}
					this.players = _6.players;
					this.number_of_achievements_needed_to_win = _6.number_of_achievements_needed_to_win;
					this.normal_achievement_names = _6.normal_achievement_names;
					var _8 = Object.keys(this.players)[0];
					var _9 = _1.window.getBox().w;
					var _a;
					var _b = _9 >= this.large_screen_width_limit;
					if (_b) {
							_a = this.main_area_width_limit + (_9 - this.large_screen_width_limit);
					} else {
							_a = _1.position("left-side").w;
					}
					_1.style("main_area", "width", _a + "px");
					if (!_b) {
							_1.style("decks", "display", "inline-block");
							_1.style("available_achievements_container", "display", "inline-block");
							_1.style("available_special_achievements_container", "display", "inline-block");
					}
					this.nb_cards_in_row.my_hand = parseInt((_1.contentBox("hand_container_" + _8).w + this.delta.my_hand.x - this.card_dimensions["M card"].width - 10) / (this.delta.my_hand.x));
					this.nb_cards_in_row.opponent_hand = parseInt((_1.contentBox("hand_container_" + _8).w + this.delta.opponent_hand.x - this.card_dimensions["S card"].width - 10) / (this.delta.opponent_hand.x));
					var _c = (this.number_of_achievements_needed_to_win - 1) * this.delta.achievements.x + this.card_dimensions["S recto"].width;
					var _d = _1.position("memo_" + _8).w;
					var _e = _1.position("progress_" + _8).w;
					var _f = _e - _c - 10 - _d;
					if (_f >= this.card_dimensions["S card"].width) {
							for (var _10 in this.players) {
									_1.style("achievement_container_" + _10, "width", _c + "px");
									_1.style("score_container_" + _10, "width", _f + "px");
							}
							this.nb_cards_in_row.achievements = 6;
							this.nb_cards_in_row.score = parseInt((_f + this.delta.score.x - this.card_dimensions["S card"].width) / (this.delta.score.x));
					} else {
							var _11 = _e - 10 - _d - this.card_dimensions["S card"].width;
							for (var _10 in this.players) {
									_1.style("achievement_container_" + _10, "width", _11 + "px");
									_1.style("score_container_" + _10, "width", this.card_dimensions["S card"].width + "px");
							}
							this.nb_cards_in_row.achievements = parseInt((_11 + this.delta.achievements.x - this.card_dimensions["S card"].width) / (this.delta.achievements.x));
							this.nb_cards_in_row.score = 1;
					}
					this.nb_cards_in_row.my_score_verso = parseInt((_1.contentBox("hand_container_" + _8).w + this.delta.my_score_verso.x - this.card_dimensions["M card"].width) / (this.delta.my_score_verso.x));
					if (this.nb_cards_in_row.my_score_verso > 6) {
							this.nb_cards_in_row.my_score_verso = 6;
					}
					for (var _10 in this.players) {
							_1.place(this.format_block("jstpl_player_panel", {
									"player_id": _10
							}), $("player_board_" + _10));
							for (var _12 = 1; _12 <= 6; _12++) {
									var _13 = {
											"player_id": _10,
											"icon": _12
									};
									_1.place(this.format_block("jstpl_ressource_icon", _13), $("symbols_" + _10));
									_1.place(this.format_block("jstpl_ressource_count", _13), $("ressource_counts_" + _10));
							}
					}
					this.addCustomTooltipToClass("score_count", _("Score"), "");
					this.addCustomTooltipToClass("hand_count", _("Number of cards in hand"), "");
					this.addCustomTooltipToClass("max_age_on_board", _("Max age on board top cards"), "");
					for (var _12 = 1; _12 <= 6; _12++) {
							this.addCustomTooltipToClass("ressource_" + _12, _("Number of visible ${icons} on the board").replace("${icons}", this.square("P", "icon", _12, "in_tooltip")), "");
					}
					this.counter.score = {};
					for (var _10 in this.players) {
							this.counter.score[_10] = new ebg.counter();
							this.counter.score[_10].create($("score_count_" + _10));
							this.counter.score[_10].setValue(_6.score[_10]);
					}
					this.counter.max_age_on_board = {};
					for (var _10 in this.players) {
							this.counter.max_age_on_board[_10] = new ebg.counter();
							this.counter.max_age_on_board[_10].create($("max_age_on_board_" + _10));
							this.counter.max_age_on_board[_10].setValue(_6.max_age_on_board[_10]);
					}
					this.counter.ressource_count = {};
					for (var _10 in this.players) {
							this.counter.ressource_count[_10] = {};
							for (var _12 = 1; _12 <= 6; _12++) {
									this.counter.ressource_count[_10][_12] = new ebg.counter();
									this.counter.ressource_count[_10][_12].create($("ressource_count_" + _10 + "_" + _12));
									this.counter.ressource_count[_10][_12].setValue(_6.ressource_counts[_10][_12]);
							}
					}
					for (var _10 in this.players) {
							_1.place("<div id='action_indicator_" + _10 + "' class='action_indicator'></div>", $("ressources_" + _10), "after");
					}
					if (_6.active_player !== null) {
							this.givePlayerActionCard(_6.active_player, _6.action_number);
					}
					this.zone.deck = {};
					for (var age = 1; age <= 10; age++) {
							this.zone.deck[age] = this.createZone("deck", 0, age, grouped_by_age = false, counter_method = "COUNT", counter_display_zero = false);
							this.setPlacementRules(this.zone.deck[age], left_to_right = true);
							var _14 = _6.deck_counts[age];
							for (var i = 0; i < _14; i++) {
									this.createAndAddToZone(this.zone.deck[age], i, age, null, _1.body(), null);
							}
							$("deck_count_" + age).innerHTML = _14;
					}
					this.zone.achievements = {};
					this.zone.achievements["0"] = this.createZone("achievements", 0);
					this.setPlacementRulesForAchievements();
					for (var i = 0; i < _6.unclaimed_achievements.length; i++) {
							var _15 = _6.unclaimed_achievements[i];
							if (_15.age === null) {
									continue;
							}
							this.createAndAddToZone(this.zone.achievements["0"], i, _15.age, null, _1.body(), null);
							this.addTooltipForRecto(_15, !this.isSpectator);
					}
					this.zone.special_achievements = {};
					this.zone.special_achievements["0"] = this.createZone("special_achievements", 0);
					this.setPlacementRulesForSpecialAchievements();
					for (var i = 0; i < _6.unclaimed_achievements.length; i++) {
							var _15 = _6.unclaimed_achievements[i];
							if (_15.age !== null) {
									continue;
							}
							this.createAndAddToZone(this.zone.special_achievements["0"], i, null, _15.id, _1.body(), null);
							this.addTooltipForCard(_15);
					}
					this.zone.hand = {};
					for (var _10 in this.players) {
							var _16 = this.createZone("hand", _10, null, grouped_by_age = true, counter_method = "COUNT", counter_display_zero = true);
							this.zone.hand[_10] = _16;
							this.setPlacementRules(_16, left_to_right = true);
							if (_10 == this.player_id) {
									for (var i = 0; i < _6.my_hand.length; i++) {
											var _17 = _6.my_hand[i];
											this.createAndAddToZone(_16, _17.position, _17.age, _17.id, _1.body(), _17);
											if (_6.turn0 && _17.selected == 1) {
													this.selected_card = _17;
											}
											this.addTooltipForCard(_17);
									}
							} else {
									var _18 = _6.hand_counts[_10];
									for (var age = 1; age <= 10; age++) {
											var _14 = _18[age];
											for (var i = 0; i < _14; i++) {
													this.createAndAddToZone(_16, i, age, null, _1.body(), null);
											}
									}
							}
					}
					this.zone.score = {};
					for (var _10 in this.players) {
							this.zone.score[_10] = this.createZone("score", _10, null, grouped_by_age = true);
							this.setPlacementRules(this.zone.score[_10], left_to_right = false);
							var _19 = _6.score_counts[_10];
							for (var age = 1; age <= 10; age++) {
									var _14 = _19[age];
									for (var i = 0; i < _14; i++) {
											this.createAndAddToZone(this.zone.score[_10], i, age, null, _1.body(), null);
									}
							}
					}
					if (!this.isSpectator) {
							this.my_score_verso_window.attr("content", "<div id='my_score_verso'></div><a id='score_close_window' class='bgabutton bgabutton_blue'>Close</a>");
							this.zone.my_score_verso = this.createZone("my_score_verso", this.player_id, grouped_by_age = true);
							this.setPlacementRules(this.zone.my_score_verso, left_to_right = true);
							for (var i = 0; i < _6.my_score.length; i++) {
									var _17 = _6.my_score[i];
									this.createAndAddToZone(this.zone.my_score_verso, _17.position, _17.age, _17.id, _1.body(), _17);
									this.addTooltipForCard(_17);
							}
							_1.connect($("score_text_" + this.player_id), "onclick", this, "clic_display_score_window");
							_1.connect($("score_close_window"), "onclick", this, "clic_close_score_window");
					}
					for (var _10 in this.players) {
							this.zone.achievements[_10] = this.createZone("achievements", _10);
							this.setPlacementRules(this.zone.achievements[_10], left_to_right = true);
							var _1a = _6.claimed_achievements[_10];
							for (var i = 0; i < _1a.length; i++) {
									var _15 = _1a[i];
									if (_15.age !== null) {
											this.createAndAddToZone(this.zone.achievements[_10], i, _15.age, null, _1.body(), null);
											this.addTooltipForRecto(_15, false);
									} else {
											this.createAndAddToZone(this.zone.achievements[_10], i, null, _15.id, _1.body(), null);
											this.addTooltipForCard(_15);
									}
							}
					}
					if (!this.isSpectator) {
							_1.query("#progress_" + this.player_id + " .score_container > p, #progress_" + this.player_id + " .achievement_container > p").addClass("two_lines");
							_1.query("#progress_" + this.player_id + " .score_container > p")[0].innerHTML += "<br /><span class=\"minor_information\">" + _("(click to look at the cards)") + "</span>";
							_1.query("#progress_" + this.player_id + " .achievement_container > p")[0].innerHTML += "<br /><span class=\"minor_information\">" + _("(${n} needed to win)").replace("${n}", _6.number_of_achievements_needed_to_win) + "</span>";
					}
					if (this.isSpectator) {
							this.display_mode = true;
							this.view_full = false;
					} else {
							this.display_mode = _6.display_mode;
							this.view_full = _6.view_full;
					}
					this.zone.board = {};
					this.number_of_splayed_piles = 0;
					for (var _10 in this.players) {
							this.zone.board[_10] = {};
							var _1b = _6.board[_10];
							var _1c = _6.board_splay_directions[_10];
							var _1d = _6.board_splay_directions_in_clear[_10];
							for (var _1e = 0; _1e < 5; _1e++) {
									var _1f = _1c[_1e];
									var _20 = _1d[_1e];
									this.zone.board[_10][_1e] = this.createZone("board", _10, _1e, grouped_by_age = false);
									this.setSplayMode(this.zone.board[_10][_1e], _1f);
									_1.addClass("splay_indicator_" + _10 + "_" + _1e, "splay_" + _1f);
									if (_1f > 0) {
											this.number_of_splayed_piles++;
											this.addCustomTooltip("splay_indicator_" + _10 + "_" + _1e, _1.string.substitute(_("This pile is splayed ${direction}."), {
													"direction": "<b>" + _20 + "</b>"
											}), "");
									}
									var _21 = _1b[_1e];
									for (var i = 0; i < _21.length; i++) {
											var _17 = _21[i];
											this.createAndAddToZone(this.zone.board[_10][_1e], _17.position, _17.age, _17.id, _1.body(), _17);
											this.addTooltipForCard(_17);
									}
							}
					}
					this.addButtonForViewFull();
					this.addButtonForSplayMode();
					if (this.number_of_splayed_piles > 0) {
							this.enableButtonForSplayMode();
					}
					this.zone.revealed = {};
					for (var _10 in this.players) {
							var _16 = this.createZone("revealed", _10, null, grouped_by_age = false);
							this.zone.revealed[_10] = _16;
							_1.style(_16.container_div, "display", "none");
							this.setPlacementRules(_16, left_to_right = true);
							var _22 = _6.revealed[_10];
							for (var i = 0; i < _22.length; i++) {
									var _17 = _22[i];
									this.createAndAddToZone(_16, _17.position, _17.age, _17.id, _1.body(), _17);
									this.addTooltipForCard(_17);
							}
					}
					this.addTooltipForMemo();
					if (_6.JSCardEffectQuery !== null) {
							_1.query(_6.JSCardEffectQuery).addClass("current_effect");
					}
					this.setupNotifications();
					this.just_setupped = true;
					console.log("Ending game setup");
			},
			on: function(_23, _24, _25) {
					var _26 = this;
					_23.forEach(function(_27, _28, arr) {
							if (_27.last_handler === undefined) {
									_27.last_handler = {};
							}
							_27.last_handler[_24] = _25;
							_26.connect(_27, _24, _25);
					});
			},
			off: function(_29, _2a) {
					var _2b = this;
					_29.forEach(function(_2c, _2d, arr) {
							_2b.disconnect(_2c, _2a);
					});
			},
			restart: function(_2e, _2f) {
					var _30 = this;
					_2e.forEach(function(_31, _32, arr) {
							_30.connect(_31, _2f, _31.last_handler[_2f]);
					});
			},
			onEnteringState: function(_33, _34) {
					console.log("Entering state: " + _33);
					console.log(_34);
					if (this.just_setupped) {
							for (var _35 in this.players) {
									this.scoreCtrl[_35].setValue(this.players[_35].player_score);
									var _36 = _("Number of achievements. ${n} needed to win").replace("${n}", this.number_of_achievements_needed_to_win);
									this.addCustomTooltip("player_score_" + _35, _36, "");
									this.addCustomTooltip("icon_point_" + _35, _36, "");
							}
							this.just_setupped = false;
					}
					switch (_33) {
					case "turn0":
							if (_34.args.team_game) {
									this.addToLog(_34.args.messages[this.player_id]);
							}
							if (this.selected_card !== null) {
									_1.addClass(this.getCardHTMLId(this.selected_card.id, this.selected_card.age, this.HTML_class.my_hand), "selected");
							}
							break;
					case "playerTurn":
							this.destroyActionCard();
							this.givePlayerActionCard(this.getActivePlayerId(), _34.args.action_number);
							break;
					case "whoBegins":
							_1.query(".selected").removeClass("selected");
							break;
					case "dogmaEffect":
					case "playerInvolvedTurn":
							_1.query(_34.args.JSCardEffectQuery).addClass("current_effect");
							break;
					case "interPlayerInvolvedTurn":
					case "interDogmaEffect":
							_1.query(".current_effect").removeClass("current_effect");
							break;
					case "gameEnd":
							var _37 = _34.args.result;
							for (var p = 0; p < _37.length; p++) {
									var _38 = _37[p];
									var _35 = _38.player;
									var _39 = _38.score;
									var _3a = _38.score_aux;
									this.removeTooltip("player_score_" + _35);
									this.scoreCtrl[_35].setValue(_39);
									this.removeTooltip("score_count_container_" + _35);
									this.counter.score[_35].setValue(_3a);
							}
							break;
					}
					switch (_33) {
					case "playerInvolvedTurn":
					case "interPlayerInvolvedTurn":
					case "interactionStep":
					case "interInteractionStep":
					case "preSelectionMove":
					case "interSelectionMove":
							var _3b = _34.args.player_id == this.player_id ? _34.args.player_name_as_you : _34.args.player_name;
							$("pagemaintitletext").innerHTML = $("pagemaintitletext").innerHTML.replace("${player}", _3b);
							break;
					}
					if (this.isCurrentPlayerActive()) {
							switch (_33) {
							case "turn0":
									this.destroyMyHandAndBoardTooltips();
									this.createMyHandAndBoardTooltipsWithActions();
									var _3c = this.selectCardsInHand();
									_3c.addClass("clickable");
									this.on(_3c, "onclick", "action_clicForInitialMeld");
									break;
							case "playerTurn":
									this.destroyMyHandAndBoardTooltips();
									this.createMyHandAndBoardTooltipsWithActions();
									if (_34.args.claimable_ages.length > 0) {
											var _3d = this.selectClaimableAchievements(_34.args.claimable_ages);
											_3d.addClass("clickable").addClass("clickable_important");
											this.on(_3d, "onclick", "action_clicForAchieve");
									}
									if (_34.args.age_to_draw <= 10) {
											var _3e = this.selectDrawableCard(_34.args.age_to_draw);
											_3e.addClass("clickable");
											this.on(_3e, "onclick", "action_clicForDraw");
									}
									var _3c = this.selectCardsInHand();
									_3c.addClass("clickable");
									this.on(_3c, "onclick", "action_clicForMeld");
									var _3f = this.selectActiveCardsOnBoard();
									_3f.addClass("clickable");
									this.on(_3f, "onclick", "action_clicForDogma");
									break;
							case "selectionMove":
									this.choose_two_colors = _34.args.special_type_of_choice == 5;
									if (_34.args.special_type_of_choice == 0) {
											var _40 = this.selectCardsFromList(_34.args._private.visible_selectable_cards);
											if (_40 !== null) {
													_40.addClass("clickable");
													this.on(_40, "onclick", "action_clicForChoose");
													if (_34.args._private.must_show_score) {
															this.my_score_verso_window.show();
													}
											}
											var _41 = this.selectRectosFromList(_34.args._private.selectable_rectos);
											if (_41 !== null) {
													_41.addClass("clickable");
													this.on(_41, "onclick", "action_clicForChooseRecto");
											}
									} else {
											if (_34.args.special_type_of_choice == 6) {
													this.off(_1.query("#change_display_mode_button"), "onclick");
													for (var _42 = 0; _42 < 5; _42++) {
															var _43 = this.zone.board[this.player_id][_42];
															this.setSplayMode(_43, _43.splay_direction, full_visible = true);
													}
													this.publication_permutations_done = [];
													var _44 = this.selectAllCardsOnBoard();
													_44.addClass("clickable");
													this.on(_44, "onclick", "publicationClicForMove");
											}
									}
									if (_34.args.color_pile !== null) {
											this.color_pile = _34.args.color_pile;
											var _43 = this.zone.board[this.player_id][this.color_pile];
											this.setSplayMode(_43, _43.splay_direction, full_visible = true);
									}
									if (_34.args.splay_direction !== null) {
											this.destroyMyBoardTooltipsOfColors(_34.args.splayable_colors);
											this.createMyBoardTooltipsForColorsWithSplayingActions(_34.args.splayable_colors, _34.args.splayable_colors_in_clear, _34.args.splay_direction, _34.args.splay_direction_in_clear);
									}
									if ((_34.args.can_pass || _34.args.can_stop) && (_34.args.special_type_of_choice == 0 || _34.args.special_type_of_choice == 6) && _34.args.splay_direction === null) {
											$("pagemaintitletext").innerHTML += " " + _("or");
									}
									break;
							}
					} else {
							switch (_33) {
							case "selectionMove":
									if (_34.args.splay_direction !== null) {
											var _45 = [];
											for (var i = 0; i < _34.args.splayable_colors_in_clear.length; i++) {
													_45.push(_1.string.substitute(_("splay his ${cards} ${direction}"), {
															"cards": _34.args.splayable_colors_in_clear[i],
															"direction": _34.args.splay_direction_in_clear
													}));
											}
											$("pagemaintitletext").innerHTML += " " + _45.join(", ");
									}
									if (_34.args.can_pass || _34.args.can_stop) {
											if (_34.args.can_pass) {
													var _46 = " " + _("or pass");
											} else {
													var _46 = " " + _("or stop");
											}
											$("pagemaintitletext").innerHTML += _46;
									}
									break;
							}
					}
			},
			onLeavingState: function(_47) {
					this.deactivateClickEvents();
					if (this.isCurrentPlayerActive()) {
							switch (_47) {
							case "playerTurn":
									this.destroyMyHandAndBoardTooltips(true);
									this.createMyHandAndBoardTooltipsWithoutActions(true);
							case "selectionMove":
									this.destroyAllMyBoardTooltips();
									this.createAllMyBoardTooltipsWithoutActions();
									this.my_score_verso_window.hide();
							}
					}
			},
			onUpdateActionButtons: function(_48, _49) {
					if (this.isCurrentPlayerActive()) {
							switch (_48) {
							case "playerTurn":
									for (var i = 0; i < _49.claimable_ages.length; i++) {
											var age = _49.claimable_ages[i];
											var _4a = "achieve_" + age;
											this.addActionButton(_4a, _("Achieve ${age}").replace("${age}", this.square("N", "age", age)), "action_clicForAchieve");
											_1.removeClass(_4a, "bgabutton_blue");
											_1.addClass(_4a, "bgabutton_red");
									}
									if (_49.age_to_draw <= 10) {
											this.addActionButton("take_draw_action", _("Draw a ${age}").replace("${age}", this.square("N", "age", _49.age_to_draw)), "action_clicForDraw");
									} else {
											this.addActionButton("take_draw_action", _("Finish the game (attempt to draw above ${age_10})").replace("${age_10}", this.square("N", "age", 10)), "action_clicForDraw");
									}
									_1.place("<span id='extra_text'> , " + _("meld or dogma") + "</span>", "take_draw_action", "after");
									break;
							case "selectionMove":
									var _4b = _49.special_type_of_choice != 0 && _49.special_type_of_choice != 6;
									var _4c = _49.splay_direction !== null;
									if (_4b) {
											for (var i = 0; i < _49.options.length; i++) {
													var _4d = _49.options[i];
													this.addActionButton("choice_" + _4d.value, _(_4d.text), "action_clicForChooseSpecialOption");
											}
											var _4e = "choice_" + _49.options[_49.options.length - 1].value;
									} else {
											if (_4c) {
													for (var i = 0; i < _49.splayable_colors.length; i++) {
															if (i > 0) {
																	_1.place("<span id='extra_text'> ,</span>", "splay_" + _49.splayable_colors[i - 1], "after");
															}
															this.addActionButton("splay_" + _49.splayable_colors[i], _1.string.substitute(_("Splay your ${cards} ${direction}"), {
																	"cards": _49.splayable_colors_in_clear[i],
																	"direction": _49.splay_direction_in_clear
															}), "action_clicForSplay");
													}
													var _4e = "splay_" + _49.splayable_colors[_49.splayable_colors.length - 1];
											}
									}
									if (_49.can_pass || _49.can_stop) {
											if (_4b || _4c) {
													_1.place("<span id='extra_text'> " + _("or") + "</span>", _4e, "after");
											}
											if (_49.can_pass) {
													var _4f = "pass";
													var _50 = _("Pass");
											} else {
													var _4f = "stop";
													var _50 = _("Stop");
											}
											this.addActionButton(_4f, _50, "action_clicForPassOrStop");
									}
									break;
							}
					}
			},
			setDefault: function(_51, _52) {
					return _51 === undefined ? _52 : _51;
			},
			addToLog: function(_53) {
					HTML = _1.string.substitute("<div class=\"log\" style=\"height: auto; display: block; color: rgb(0, 0, 0);\"><div class=\"roundedbox\">${msg}</div></div>", {
							"msg": _53
					});
					_1.place(HTML, $("logs"), "first");
			},
			addButtonForViewFull: function() {
					var _54 = this.view_full ? this.text_for_view_full : this.text_for_view_normal;
					if (this.isSpectator) {
							var _55 = _1.query(".player:nth-of-type(1)")[0];
							var _56 = _1.attr(_55, "id").substr(7);
					} else {
							var _56 = this.player_id;
					}
					var _57 = this.format_string_recursive("<i id='change_view_full_button' class='bgabutton bgabutton_gray'>${button_text}</i>", {
							"button_text": _54,
							"i18n": ["button_text"]
					});
					_1.place(_57, "name_" + _56, "after");
					this.addCustomTooltip("change_view_full_button", "<p>" + _("Use this to look at all the cards in board piles.") + "</p>", "");
					this.on(_1.query("#change_view_full_button"), "onclick", "toggle_view");
			},
			addButtonForSplayMode: function() {
					var _58 = this.display_mode ? this.text_for_expanded_mode : this.text_for_compact_mode;
					var _59 = this.display_mode ? this.arrows_for_expanded_mode : this.arrows_for_compact_mode;
					var _5a = this.format_string_recursive("<i id='change_display_mode_button' class='bgabutton bgabutton_gray'>${arrows} ${button_text}</i>", {
							"arrows": _59,
							"button_text": _58,
							"i18n": ["button_text"]
					});
					_1.place(_5a, "change_view_full_button", "after");
					this.addCustomTooltip("change_display_mode_button", "<p>" + _("<b>Expanded mode:</b> the splayed piles are displayed like in real game, to show which icons are made visible.") + "</p>" + "<p>" + _("<b>Compact mode:</b> the splayed piles are displayed with minimum offset, to save space.") + "</p>", "");
					this.disableButtonForSplayMode();
			},
			disableButtonForSplayMode: function() {
					var _5b = _1.query("#change_display_mode_button");
					this.off(_5b, "onclick");
					_5b.addClass("disabled");
			},
			enableButtonForSplayMode: function() {
					var _5c = _1.query("#change_display_mode_button");
					this.on(_5c, "onclick", "toggle_displayMode");
					_5c.removeClass("disabled");
			},
			uniqueId: function() {
					this.incremental_id++;
					return this.incremental_id;
			},
			uniqueIdForCard: function(age) {
					return this.system_offset * this.uniqueId() + age;
			},
			square: function(_5d, _5e, key, _5f) {
					_5f = this.setDefault(_5f, null);
					return "<span class='square " + _5d + " " + _5e + "_" + key + (_5f !== null ? " " + _5f : "") + "'></span>";
			},
			all_icons: function(_60, _61) {
					return "<span class='all_icons " + _60 + " " + _61 + "'></span>";
			},
			shapeTooltip: function(_62, _63) {
					var _64 = _62 != "";
					var _65 = _63 != "";
					var _66 = "<table class='tooltip'>";
					if (_64) {
							_66 += "<tr><td>" + this.square("basic", "icon", "help", "in_tooltip") + "</td><td class='help in_tooltip'>" + _62 + "</td></tr>";
					}
					if (_65) {
							_66 += "<tr><td>" + this.square("basic", "icon", "action", "in_tooltip") + "</td><td class='action in_tooltip'>" + _63 + "</td></tr>";
					}
					_66 += "</table>";
					return _66;
			},
			addCustomTooltip: function(_67, _68, _69, _6a) {
					_6a = this.setDefault(_6a, undefined);
					this.addTooltipHtml(_67, this.shapeTooltip(_68, _69), _6a);
			},
			addCustomTooltipToClass: function(_6b, _6c, _6d, _6e) {
					_6e = this.setDefault(_6e, undefined);
					this.addTooltipHtmlToClass(_6b, this.shapeTooltip(_6c, _6d), _6e);
			},
			addTooltipForCard: function(_6f) {
					var _70 = this.getZone(_6f["location"], _6f.owner, _6f.age, _6f.color);
					var _71 = this.getCardHTMLId(_6f.id, _6f.age, _70.HTML_class);
					var _72 = this.createCard(_6f.id, _6f.age, "L card", _6f);
					this.saved_cards[_6f.id] = _6f;
					this.saved_HTML_cards[_6f.id] = _72;
					this.addCustomTooltip(_71, _72, "");
			},
			addTooltipForRecto: function(_73, _74) {
					var _75 = this.getZone(_73["location"], _73.owner, _73.age);
					var id = this.getCardIdFromPosition(_75, _73.position, _73.age);
					var _76 = this.getCardHTMLId(id, _73.age, _75.HTML_class);
					var _77 = this.createCard(id, _73.age, "L recto", null);
					condition_for_claiming = _1.string.substitute(_("You can take an action to claim this age if you have at least ${n} points in your score pile and at least one top card of value equal or higher than ${age} on your board."), {
							"age": this.square("N", "age", _73.age),
							"n": 5 * _73.age
					});
					this.addCustomTooltip(_76, _77, _74 ? "<div class='under L_recto'>" + condition_for_claiming + "</div>" : "");
			},
			addTooltipForMemo: function() {
					var _78 = "&bull;";
					var _79 = "&#9679;";
					var _7a = this.createAdjustedContent(_78 + _("Score").toUpperCase() + _78, "score_txt", "", 18);
					var _7b = this.createAdjustedContent(_78 + _("Achievements").toUpperCase() + _78, "achievements_txt", "", 18);
					var _7c = _("${Actions} You must take two actions on your turn, in any order. You may perform the same action twice.");
					_7c = _1.string.substitute(_7c, {
							"Actions": "<span class='actions_header'>" + _("Actions :").toUpperCase() + "</span>"
					});
					var _7d = this.createAdjustedContent(_7c, "actions_txt memo_block", "", 12);
					var _7e = this.createAdjustedContent(_("Meld").toUpperCase(), "meld_title memo_block", "", 30);
					var _7f = _("Play a card from your hand to your board, on stack on matching color. Continue any splay if present.");
					var _80 = this.createAdjustedContent(_7f, "meld_parag memo_block", "", 12);
					var _81 = this.createAdjustedContent(_("Draw").toUpperCase(), "draw_title memo_block", "", 30);
					var _82 = _("Take a card of value equal to your highest top card from the supply piles. If empty, draw from the next available higher pile.");
					var _83 = this.createAdjustedContent(_82, "draw_parag memo_block", "", 12);
					var _84 = this.createAdjustedContent(_("Achieve").toUpperCase(), "achieve_title memo_block", "", 30);
					var _85 = _("To claim, must have score of at least 5x the age number in points, and a top card of equal or higher value. Points are kept, not spent.");
					var _86 = this.createAdjustedContent(_85, "achieve_parag memo_block", "", 12);
					var _87 = this.createAdjustedContent(_("Dogma").toUpperCase(), "dogma_title memo_block", "", 30);
					var _88 = _("Pick a top card on your board. Execute each effect on it, in order.") + "<ul><li>" + _79 + " " + _("I Demand effects are executed by each player with fewer of the featured icon than you, going clockwise. Read effects aloud to them.") + "</li>" + "<li>" + _79 + " " + _("Non-demand effects are executed by opponents before you, if they have at leadt as many or more of the featured icon, going clockwise.") + "</li>" + "<li>" + _79 + " " + _("If any opponent shared a non-demand effect, take a single free Draw action at the conclusion of your Dogma action.") + "</li></ul>";
					var _89 = this.createAdjustedContent(_88, "dogma_parag memo_block", "", 12);
					var _8a = this.createAdjustedContent(_("Tuck").toUpperCase(), "tuck_title memo_block", "", 30);
					var _8b = _("A tucked card goes to the bottom of the pile of its color. Tucking a card into an empty pile starts a new one.");
					var _8c = this.createAdjustedContent(_8b, "tuck_parag memo_block", "", 12);
					var _8d = this.createAdjustedContent(_("Return").toUpperCase(), "return_title memo_block", "", 30);
					var _8e = _("To return a card, place it at the bottom of its matching supply pile. If you return many cards, you choose the order.");
					var _8f = this.createAdjustedContent(_8e, "return_parag memo_block", "", 12);
					var _90 = this.createAdjustedContent(_("DRAW and X"), "draw_and_x_title memo_block", "", 30);
					var _91 = _("If instructed to Draw and Meld, Score, or tuck, you must use the specific card drawn for the indicated action.");
					var _92 = this.createAdjustedContent(_91, "draw_and_x_parag memo_block", "", 12);
					var _93 = this.createAdjustedContent(_("Splay").toUpperCase(), "splay_title memo_block", "", 30);
					var _94 = _("To splay, fan out the color as shown below. A color is only ever splayed in one direction. New cards tucked or melded continue the splay.");
					var _95 = this.createAdjustedContent(_94, "splay_parag memo_block", "", 12);
					var _96 = "<div class='erase_block memo_block'></div>";
					var _97 = this.createAdjustedContent(_("Splayed left"), "splayed_left_example memo_block", "", 12);
					var _98 = this.createAdjustedContent(_("Splayed right"), "splayed_right_example memo_block", "", 12);
					var _99 = this.createAdjustedContent(_("Splayed up"), "splayed_up_example memo_block", "", 12);
					var _9a = this.createAdjustedContent(_("Empty piles").toUpperCase(), "empty_piles_title memo_block", "", 30);
					var _9b = _("When drawing from an empty pile for <b>any reason</b>, draw from the next higher pile.");
					var _9c = this.createAdjustedContent(_9b, "empty_piles_parag memo_block", "", 12);
					var _9d = _("Age 1-3");
					var _9e = _("Age 4-10");
					var _9f = _("Age 7-10");
					var _a0 = _("Age 1-10");
					var _a1 = this.createAdjustedContent(_9d, "icon_4_ages memo_block", "", 12);
					var _a2 = this.createAdjustedContent(_9e, "icon_5_ages memo_block", "", 12);
					var _a3 = this.createAdjustedContent(_9f, "icon_6_ages memo_block", "", 12);
					var _a4 = this.createAdjustedContent(_a0, "icon_1_ages memo_block", "", 12);
					var _a5 = this.createAdjustedContent(_a0, "icon_2_ages memo_block", "", 12);
					var _a6 = this.createAdjustedContent(_a0, "icon_3_ages memo_block", "", 12);
					var _a7 = this.createAdjustedContent(_("Colors:"), "colors_title memo_block", "", 12);
					var _a8 = this.createAdjustedContent(_("Blue"), "blue_icon memo_block", "", 12);
					var _a9 = this.createAdjustedContent(_("Yellow"), "yellow_icon memo_block", "", 12);
					var _aa = this.createAdjustedContent(_("Red"), "red_icon memo_block", "", 12);
					var _ab = this.createAdjustedContent(_("Green"), "green_icon memo_block", "", 12);
					var _ac = this.createAdjustedContent(_("Purple"), "purple_icon memo_block", "", 12);
					recto_content = "";
					recto_content += _7a;
					recto_content += _7b;
					recto_content += _7d;
					recto_content += _7e + _80;
					recto_content += _81 + _83;
					recto_content += _84 + _86;
					recto_content += _87 + _89;
					verso_content = "";
					verso_content += _7a;
					verso_content += _7b;
					verso_content += _8a + _8c;
					verso_content += _8d + _8f;
					verso_content += _90 + _92;
					verso_content += _93 + _95 + _96;
					verso_content += _97 + _98 + _99;
					verso_content += _9a + _9c;
					verso_content += _a1 + _a2 + _a3;
					verso_content += _a4 + _a5 + _a6;
					verso_content += _a7 + _a8 + _a9;
					verso_content += _aa + _ab + _ac;
					var _ad = "<div class='memo_recto M'>" + recto_content + "</div>";
					var _ae = "<div class='memo_verso M'>" + verso_content + "</div>";
					this.addTooltipHtmlToClass("memo_recto", _ad + _ae);
			},
			createAdjustedContent: function(_af, _b0, _b1, _b2, _b3, _b4) {
					_b3 = this.setDefault(_b3, 0);
					_b4 = this.setDefault(_b4, 0);
					var _b5 = "temp_parent";
					var _b6 = "temp";
					var _b7 = "<div id='" + _b5 + "' class='" + _b0 + " " + _b1 + "'><span id='" + _b6 + "' >" + _af + "</span></div>";
					_1.place(_b7, _1.body());
					var _b8 = _b2;
					var _b9;
					var _b5 = $(_b5);
					var _b6 = $(_b6);
					_1.addClass(_b6, "font_size_" + _b8);
					while (_b8 > 1 && (_1.position(_b6).w + _b3 > _1.position(_b5).w || _1.position(_b6).h + _b4 > _1.position(_b5).h)) {
							_b9 = _b8;
							_b8 -= 1;
							_1.removeClass(_b6, "font_size_" + _b9);
							_1.addClass(_b6, "font_size_" + _b8);
					}
					_1.destroy(_b5);
					return "<div class='" + _b0 + " " + _b1 + "'><span class='font_size_" + _b8 + "'>" + _af + "</span></div>";
			},
			createDogmaEffectText: function(_ba, _bb, _bc, _bd) {
					_ba = this.parseForRichedText(_ba, _bc);
					_ba = this.getSymbolIconInDogma(_bb) + " <strong>:</strong> " + _ba;
					return "<div class='effect " + _bc + " " + _bd + "'>" + this.square(_bc, "icon", _bb, "in_tooltip") + "<span class='effect_text " + _bc + "'>" + _ba + "<span></div>";
			},
			parseForRichedText: function(_be, _bf) {
					_be = _be.replace(new RegExp("\\$\\{I demand\\}","g"), "<strong class='i_demand'>" + _("I demand") + "</strong>");
					_be = _be.replace(new RegExp("\\$\\{immediately\\}","g"), "<strong class='immediately'>" + _("immediately") + "</strong>");
					_be = _be.replace(new RegExp("\\$\\{icons_1_to_6\\}","g"), this.all_icons(_bf, "in_tooltip"));
					for (var age = 1; age <= 10; age++) {
							_be = _be.replace(new RegExp("\\$\\{age_" + age + "\\}","g"), this.square(_bf, "age", age, "in_tooltip"));
					}
					for (var _c0 = 1; _c0 <= 6; _c0++) {
							_be = _be.replace(new RegExp("\\$\\{icon_" + _c0 + "\\}","g"), this.square(_bf, "icon", _c0, "in_tooltip"));
					}
					return _be;
			},
			getAgeIconInDogma: function(age) {
					return "<span class='icon_in_dogma icon_in_dogma_age_" + age + "' ></span>";
			},
			getSymbolIconInDogma: function(_c1) {
					return "<span class='icon_in_dogma icon_in_dogma_symbol_" + _c1 + "' ></span>";
			},
			destroyMyHandAndBoardTooltips: function(_c2) {
					_c2 = this.setDefault(_c2, false);
					for (var i = 0; i < 2; i++) {
							var _c3 = i == 0 ? this.selectCardsInHand() : (_c2 ? this.selectAllCardsOnBoard() : this.selectActiveCardsOnBoard());
							var _c4 = this;
							_c3.forEach(function(_c5) {
									var _c6 = _1.attr(_c5, "id");
									_c4.removeTooltip(_c6);
							});
					}
			},
			destroyAllMyBoardTooltips: function() {
					var _c7 = this.selectAllCardsOnBoard();
					var _c8 = this;
					_c7.forEach(function(_c9) {
							var _ca = _1.attr(_c9, "id");
							_c8.removeTooltip(_ca);
					});
			},
			destroyMyBoardTooltipsOfColors: function(_cb) {
					var _cc = this.selectCardsOnMyBoardOfColors(_cb);
					var _cd = this;
					_cc.forEach(function(_ce) {
							var _cf = _1.attr(_ce, "id");
							_cd.removeTooltip(_cf);
					});
			},
			createMyHandAndBoardTooltipsWithActions: function() {
					for (var i = 0; i < 2; i++) {
							var _d0 = i == 0 ? this.selectCardsInHand() : this.selectActiveCardsOnBoard();
							var _d1 = this;
							_d0.forEach(function(_d2) {
									var _d3 = _1.attr(_d2, "id");
									var id = _d1.getCardIdFromHTMLId(_d3);
									var _d4 = _d1.saved_HTML_cards[id];
									var _d5 = _d1.saved_cards[id];
									if (i == 0) {
											var _d6 = _d1.createActionTextForCardInHand(_d5);
									} else {
											var _d6 = _d1.createActionTextForActiveCard(_d5);
									}
									_d1.addCustomTooltip(_d3, _d4, _d6);
							});
					}
			},
			createMyHandAndBoardTooltipsWithoutActions: function(_d7) {
					_d7 = this.setDefault(_d7, false);
					var _d8 = [this.selectCardsInHand, this.selectActiveCardsOnBoard];
					for (var i = 0; i < 2; i++) {
							var _d9 = i == 0 ? this.selectCardsInHand() : (_d7 ? this.selectAllCardsOnBoard() : this.selectActiveCardsOnBoard());
							var _da = this;
							_d9.forEach(function(_db) {
									var _dc = _1.attr(_db, "id");
									var id = _da.getCardIdFromHTMLId(_dc);
									var _dd = _da.saved_HTML_cards[id];
									_da.addCustomTooltip(_dc, _dd, "");
							});
					}
			},
			createMyBoardTooltipsForColorsWithSplayingActions: function(_de, _df, _e0, _e1) {
					var _e2 = this.selectCardsOnMyBoardOfColors(_de);
					var _e3 = this;
					_e2.forEach(function(_e4) {
							var _e5 = _1.attr(_e4, "id");
							var id = _e3.getCardIdFromHTMLId(_e5);
							var _e6 = _e3.saved_HTML_cards[id];
							var _e7 = _e3.saved_cards[id];
							for (var i = 0; i < _de.length; i++) {
									if (_de[i] = _e7.color) {
											var _e8 = _df[i];
											break;
									}
							}
							HTML_action = _e3.createActionTextForCardInSplayablePile(_e7, _e8, _e0, _e1);
							_e3.addCustomTooltip(_e5, _e6, HTML_action);
					});
			},
			createAllMyBoardTooltipsWithoutActions: function() {
					var _e9 = this.selectAllCardsOnBoard();
					var _ea = this;
					_e9.forEach(function(_eb) {
							var _ec = _1.attr(_eb, "id");
							var id = _ea.getCardIdFromHTMLId(_ec);
							var _ed = _ea.saved_HTML_cards[id];
							_ea.addCustomTooltip(_ec, _ed, "");
					});
			},
			createActionTextForCardInHand: function(_ee) {
					HTML_action = "<p class='possible_action'>" + _("Click to meld this card.") + "<p>";
					var _ef = this.zone.board[this.player_id][_ee.color].items;
					var _f0 = _ef.length > 0;
					if (_f0) {
							var _f1 = _ef[_ef.length - 1];
							var _f2 = this.getCardIdFromHTMLId(_f1.id);
							var _f1 = this.saved_cards[_f2];
							HTML_action += _1.string.substitute("<p>" + _("If you do, it will cover ${age} ${card_name} and your new ressource counts will be:") + "<p>", {
									"age": this.square("N", "age", _f1.age, "in_log"),
									"card_name": "<span class='card_name'>" + _(_f1.name) + "</span>"
							});
					} else {
							HTML_action += "<p>" + _("If you do, your new ressource counts will be:") + "</p>";
					}
					var _f3 = {};
					var _f4 = {};
					for (var _f5 = 1; _f5 <= 6; _f5++) {
							current_count = this.counter.ressource_count[this.player_id][_f5].getValue();
							_f3[_f5] = current_count;
							_f4[_f5] = current_count;
					}
					_f4[_ee.spot_1]++;
					_f4[_ee.spot_2]++;
					_f4[_ee.spot_3]++;
					_f4[_ee.spot_4]++;
					if (_f0) {
							var _f6 = "splay_indicator_" + this.player_id + "_" + _f1.color;
							for (var _f7 = 0; _f7 <= 3; _f7++) {
									if (_1.hasClass(_f6, "splay_" + _f7)) {
											var _f8 = _f7;
											break;
									}
							}
							switch (parseInt(_f8)) {
							case 0:
									_f4[_f1.spot_1]--;
									_f4[_f1.spot_2]--;
									_f4[_f1.spot_3]--;
									_f4[_f1.spot_4]--;
									break;
							case 1:
									_f4[_f1.spot_1]--;
									_f4[_f1.spot_2]--;
									_f4[_f1.spot_3]--;
									break;
							case 2:
									_f4[_f1.spot_3]--;
									_f4[_f1.spot_4]--;
									break;
							case 3:
									_f4[_f1.spot_1]--;
									break;
							}
					}
					HTML_action += this.createSimulatedRessourceTable(_f3, _f4);
					return HTML_action;
			},
			createActionTextForActiveCard: function(_f9) {
					var _fa = this.counter.ressource_count[this.player_id][_f9.dogma_icon].getValue();
					var _fb = [];
					var _fc = [];
					for (var p = 2; p <= Object.keys(this.players).length; p++) {
							var _fd = _1.query(".player:nth-of-type(" + p + ")")[0];
							var _fe = _1.attr(_fd, "id").substr(7);
							if (this.counter.ressource_count[_fe][_f9.dogma_icon].getValue() < _fa) {
									_fb.push(_fe);
							} else {
									_fc.push(_fe);
							}
					}
					exists_i_demand_effect = _f9.i_demand_effect_1 !== null;
					exists_non_demand_effect = _f9.non_demand_effect_1 != null;
					exist_several_non_demand_effects = _f9.non_demand_effect_2 != null;
					several_effects = (exists_i_demand_effect && exists_non_demand_effect) || exist_several_non_demand_effects;
					if (exists_i_demand_effect && !exists_non_demand_effect && _fb.length == 0) {
							HTML_action = "<p class='warning'>" + _1.string.substitute(_("Activating this card will have no effect, since it has only an \"I demand\" effect and nobody has less ${icon} than you."), {
									"icon": this.square("N", "icon", _f9.dogma_icon, "in_log")
							}) + "</p>";
					} else {
							HTML_action = "<p class='possible_action'>" + (several_effects ? _("Click to execute the dogma effects of this card.") : _("Click to execute the dogma effect of this card.")) + "</p>";
							HTML_action += "<p>" + _("If you do:") + "</p>";
							HTML_action += "<ul class='recap_dogma'>";
							if (exists_i_demand_effect) {
									if (_fb.length == 0) {
											HTML_action += "<li>" + _("Nobody will execute the I demand effect.") + "</li>";
									} else {
											var _ff = [];
											for (var p = 0; p < _fb.length; p++) {
													var _fe = _fb[p];
													var _100 = $("name_" + _fe).outerHTML.replace("<p", "<span class='name_in_tooltip'").replace("</p", "</span");
													_ff.push(_100);
											}
											if (_ff.length == 1) {
													HTML_action += "<li>" + _1.string.substitute(_("${player} will execute the I demand effect."), {
															"player": _ff[0]
													}) + "</li>";
											} else {
													HTML_action += "<li>" + _1.string.substitute(_("${players} will execute the I demand effect."), {
															"players": _ff.join(", ")
													}) + "</li>";
											}
									}
							}
							if (exists_non_demand_effect) {
									if (_fc.length == 0) {
											if (!exist_several_non_demand_effects) {
													HTML_action += "<li>" + _("You will execute the non-demand effect alone.") + "</li>";
											} else {
													HTML_action += "<li>" + _("You will execute the non-demand effects alone.") + "</li>";
											}
									} else {
											var _ff = [];
											for (var p = 0; p < _fc.length; p++) {
													var _fe = _fc[p];
													var _100 = $("name_" + _fe).outerHTML.replace("<p", "<span class='name_in_tooltip'").replace("</p", "</span");
													_ff.push(_100);
											}
											if (_ff.length == 1) {
													if (!exist_several_non_demand_effects) {
															HTML_action += "<li>" + _1.string.substitute(_("${player} will share the non-demand effect before you execute it."), {
																	"player": _ff[0]
															}) + "</li>";
													} else {
															HTML_action += "<li>" + _1.string.substitute(_("${player} will share each non-demand effect before you execute it."), {
																	"player": _ff[0]
															}) + "</li>";
													}
											} else {
													if (!exist_several_non_demand_effects) {
															HTML_action += "<li>" + _1.string.substitute(_("${players} will share the non-demand effect before you execute it."), {
																	"players": _ff.join(", ")
															}) + "</li>";
													} else {
															HTML_action += "<li>" + _1.string.substitute(_("${players} will share each non-demand effect before you execute it."), {
																	"players": _ff.join(", ")
															}) + "</li>";
													}
											}
									}
							}
							HTML_action += "</ul>";
					}
					return HTML_action;
			},
			createActionTextForCardInSplayablePile: function(card, _101, _102, _103) {
					HTML_action = "<p class='possible_action'>" + _1.string.substitute(_("Click to splay your ${color} pile ${direction}."), {
							"color": _101,
							"direction": _103
					}) + "<p>";
					HTML_action += "<p>" + _("If you do, your new ressource counts will be:") + "</p>";
					var pile = this.zone.board[this.player_id][card.color].items;
					var _104 = "splay_indicator_" + this.player_id + "_" + card.color;
					for (var _105 = 0; _105 <= 3; _105++) {
							if (_1.hasClass(_104, "splay_" + _105)) {
									var _106 = _105;
									break;
							}
					}
					var _107 = {};
					var _108 = {};
					for (var icon = 1; icon <= 6; icon++) {
							current_count = this.counter.ressource_count[this.player_id][icon].getValue();
							_107[icon] = current_count;
							_108[icon] = current_count;
					}
					for (var i = 0; i < pile.length - 1; i++) {
							var _109 = pile[i];
							var _10a = this.getCardIdFromHTMLId(_109.id);
							var _109 = this.saved_cards[_10a];
							switch (parseInt(_106)) {
							case 0:
									break;
							case 1:
									_108[_109.spot_4]--;
									break;
							case 2:
									_108[_109.spot_1]--;
									_108[_109.spot_2]--;
									break;
							case 3:
									_108[_109.spot_2]--;
									_108[_109.spot_3]--;
									_108[_109.spot_4]--;
									break;
							}
							switch (parseInt(_102)) {
							case 0:
									break;
							case 1:
									_108[_109.spot_4]++;
									break;
							case 2:
									_108[_109.spot_1]++;
									_108[_109.spot_2]++;
									break;
							case 3:
									_108[_109.spot_2]++;
									_108[_109.spot_3]++;
									_108[_109.spot_4]++;
									break;
							}
					}
					HTML_action += this.createSimulatedRessourceTable(_107, _108);
					return HTML_action;
			},
			createSimulatedRessourceTable: function(_10b, _10c) {
					var _10d = _1.create("table", {
							"class": "ressource_table"
					});
					var _10e = _1.create("tr", null, _10d);
					var _10f = _1.create("tr", null, _10d);
					for (var icon = 1; icon <= 6; icon++) {
							var _110 = _10b[icon];
							var _111 = _10c[icon];
							var _112 = _111 == _110 ? "equal" : (_111 > _110 ? "more" : "less");
							_1.place("<td><div class=\"ressource with_white_border ressource_" + icon + " square P icon_" + icon + "\"></div></td>", _10e);
							_1.place("<td><div class=\"ressource with_white_border" + icon + " " + _112 + "\">&nbsp;&#8239;" + _111 + "</div></td>", _10f);
					}
					return _10d.outerHTML;
			},
			selectAllCards: function() {
					return _1.query(".card, .recto");
			},
			selectCardsInHand: function() {
					return _1.query("#hand_" + this.player_id + " > .card");
			},
			selectAllCardsOnBoard: function() {
					return _1.query("#board_" + this.player_id + " .card");
			},
			selectCardsOnMyBoardOfColors: function(_113) {
					var _114 = [];
					for (var i = 0; i < _113.length; i++) {
							var _115 = _113[i];
							_114.push("#board_" + this.player_id + "_" + _115 + " .card");
					}
					return _1.query(_114.join(","));
			},
			selectActiveCardsOnBoard: function() {
					var _116 = this.zone.board[this.player_id];
					var _117 = [];
					for (var _118 = 0; _118 < 5; _118++) {
							var pile = _116[_118].items;
							if (pile.length == 0) {
									continue;
							}
							var _119 = pile[pile.length - 1];
							_117.push("#" + _119.id);
					}
					return _117.length > 0 ? _1.query(_117.join(",")) : new _1.NodeList();
			},
			selectClaimableAchievements: function(_11a) {
					identifiers = [];
					for (var i = 0; i < _11a.length; i++) {
							var age = _11a[i];
							identifiers.push("#achievements > .age_" + age);
					}
					return _1.query(identifiers.join(","));
			},
			selectDrawableCard: function(_11b) {
					var _11c = this.zone.deck[_11b].items;
					var _11d = _11c[_11c.length - 1];
					return _1.query("#" + _11d.id);
			},
			selectCardsFromList: function(_11e) {
					if (_11e.length == 0) {
							return null;
					}
					var _11f = [];
					for (var i = 0; i < _11e.length; i++) {
							var card = _11e[i];
							_11f.push("#" + this.getCardHTMLId(card.id, card.age, "M card"));
					}
					return _1.query(_11f.join(","));
			},
			selectRectosFromList: function(_120) {
					if (_120.length == 0) {
							return null;
					}
					var _121 = [];
					for (var i = 0; i < _120.length; i++) {
							var card = _120[i];
							var zone = this.getZone(card["location"], card.owner, card.age);
							var id = this.getCardIdFromPosition(zone, card.position, card.age);
							_121.push("#" + this.getCardHTMLId(id, card.age, zone.HTML_class));
					}
					return _1.query(_121.join(","));
			},
			deactivateClickEvents: function() {
					this.deactivated_cards = _1.query(".clickable");
					this.deactivated_cards.removeClass("clickable");
					this.deactivated_cards_important = _1.query(".clickable_important");
					this.deactivated_cards_important.removeClass("clickable_important");
					this.off(this.deactivated_cards, "onclick");
					this.erased_pagemaintitle_text = $("pagemaintitletext").innerHTML;
					_1.query("#generalactions > .action-button, #extra_text").addClass("hidden");
					$("pagemaintitletext").innerHTML = _("Move recorded. Waiting for update...");
			},
			resurrectClickEvents: function() {
					this.deactivated_cards.addClass("clickable");
					this.deactivated_cards_important.addClass("clickable_important");
					this.restart(this.deactivated_cards, "onclick");
					_1.query("#generalactions > .action-button, #extra_text").removeClass("hidden");
					$("pagemaintitletext").innerHTML = this.erased_pagemaintitle_text;
			},
			getCardSizeInZone: function(_122) {
					return _122.split(" ")[0];
			},
			getCardTypeInZone: function(_123) {
					return _123.split(" ")[1];
			},
			getZone: function(_124, _125, age, _126) {
					age = this.setDefault(age, null);
					_126 = this.setDefault(_126, null);
					var root = this.zone[_124];
					switch (_124) {
					case "deck":
							return root[age];
					case "hand":
					case "score":
					case "revealed":
					case "achievements":
							if (_125 == 0 && age === null) {
									return this.zone.special_achievements[0];
							} else {
									return root[_125];
							}
					case "board":
							return root[_125][_126];
					}
			},
			getCardAgeFromId: function(id) {
					id = parseInt(id);
					if (id < 0) {
							return null;
					}
					if (id < 105) {
							if (id < 15) {
									return 1;
							}
							return parseInt((id + 5) / 10);
					}
					if (id < this.system_offset) {
							return null;
					}
					return id % 20;
			},
			getCardIdFromPosition: function(zone, _127, age) {
					if (!zone.grouped_by_age) {
							return this.getCardIdFromHTMLId(zone.items[_127].id);
					}
					var p = 0;
					for (var i = 0; i < zone.items.length; i++) {
							var item = zone.items[i];
							if (this.getCardAgeFromHTMLId(item.id) != age) {
									continue;
							}
							if (p == _127) {
									return this.getCardIdFromHTMLId(item.id);
							}
							p++;
					}
			},
			getCardPositionFromId: function(zone, id, age) {
					if (!zone.grouped_by_age) {
							for (var p = 0; p < zone.items.length; p++) {
									var item = zone.items[p];
									if (this.getCardIdFromHTMLId(item.id) == id) {
											return p;
									}
							}
					}
					var p = 0;
					for (var i = 0; i < zone.items.length; i++) {
							var item = zone.items[i];
							if (this.getCardAgeFromHTMLId(item.id) != age) {
									continue;
							}
							if (this.getCardIdFromHTMLId(item.id) == id) {
									return p;
							}
							p++;
					}
			},
			getCardHTMLIdFromEvent: function(_128) {
					return _1.getAttr(_128.currentTarget, "id");
			},
			getCardHTMLId: function(id, age, _129) {
					return ["item_" + id, "age_" + age, _129.replace(" ", "__")].join("__");
			},
			getCardHTMLClass: function(id, age, _12a) {
					return ["item_" + id, "age_" + age, _12a].join(" ");
			},
			getCardIdFromHTMLId: function(_12b) {
					return parseInt(_12b.split("__")[0].substr(5));
			},
			getCardAgeFromHTMLId: function(_12c) {
					return parseInt(_12c.split("__")[1].substr(4));
			},
			createCard: function(id, age, _12d, card) {
					var _12e = this.getCardHTMLId(id, age, _12d);
					var _12f = this.getCardHTMLClass(id, age, _12d);
					var size = this.getCardSizeInZone(_12d);
					if (card === null) {
							var _130 = size == "L" ? this.writeOverRecto(age) : "";
					} else {
							if (card.age === null) {
									var _130 = this.writeOverSpecialAchievement(card, size, id == 106);
							} else {
									var _130 = this.writeOverCard(card, size);
							}
					}
					return "<div id='" + _12e + "' class='" + _12f + "'>" + _130 + "</div>";
			},
			writeOverCard: function(card, size) {
					var _131 = _(card.name).toUpperCase();
					var _132 = this.createAdjustedContent(_131, "card_title", size, size == "M" ? 11 : 30, 3);
					var _133 = card.i_demand_effect_1 !== null ? this.createDogmaEffectText(_(card.i_demand_effect_1), card.dogma_icon, size, "i_demand_effect_1") : "";
					var _134 = card.non_demand_effect_1 !== null ? this.createDogmaEffectText(_(card.non_demand_effect_1), card.dogma_icon, size, "non_demand_effect_1") : "";
					var _135 = card.non_demand_effect_2 !== null ? this.createDogmaEffectText(_(card.non_demand_effect_2), card.dogma_icon, size, "non_demand_effect_2") : "";
					var _136 = card.non_demand_effect_3 !== null ? this.createDogmaEffectText(_(card.non_demand_effect_3), card.dogma_icon, size, "non_demand_effect_3") : "";
					var _137 = this.createAdjustedContent(_133 + _134 + _135 + _136, "card_effects color_" + card.color, size, size == "M" ? 8 : 17);
					return _132 + _137;
			},
			writeOverRecto: function(age) {
					return this.createAdjustedContent(this.normal_achievement_names[age].toUpperCase(), "normal_achievement_title", "", 25);
			},
			writeOverSpecialAchievement: function(card, size, _138) {
					var _139 = _("Note: Transfered cards from other players do not count toward this achievement, nor does exchanging cards from your hand and score pile.");
					var _13a = _(card.achievement_name).toUpperCase();
					var _13b = this.createAdjustedContent(_13a, "achievement_title", "", 30);
					var _13c = this.parseForRichedText(_(card.condition_for_claiming), size) + (_138 ? "<div id='note_for_monument'>" + _139 + "</div>" : "");
					var _13d = this.createAdjustedContent(_13c, "condition_for_claiming", "", 25);
					var _13e = _(card.alternative_condition_for_claiming);
					var _13f = this.createAdjustedContent(_13e, "alternative_condition_for_claiming", "", 20);
					return _13b + _13d + _13f;
			},
			createZone: function(_140, _141, _142, _143, _144, _145) {
					_142 = this.setDefault(_142, null);
					_143 = this.setDefault(_143, null);
					_144 = this.setDefault(_144, null);
					_145 = this.setDefault(_145, null);
					var _146;
					var _147;
					if (_140 == "hand") {
							if (_141 == this.player_id) {
									_147 = "my_hand";
							} else {
									_147 = "opponent_hand";
							}
					} else {
							_147 = _140;
					}
					var _146 = this.HTML_class[_147];
					var _148 = this.card_dimensions[_146];
					var _149;
					if (_147 == "board") {
							_149 = _148.width;
					} else {
							if (_147 == "score") {
									_149 = _1.position("score_container_" + _141).w;
							} else {
									if (_147 != "achievements" && _147 != "special_achievements") {
											var _14a = this.delta[_147].x;
											var n = this.nb_cards_in_row[_147];
											_149 = _148.width + (n - 1) * _14a;
									}
							}
					}
					if (_140 == "my_score_verso") {
							var _14b = _140;
					} else {
							var _14b = _140 + (_141 != 0 ? "_" + _141 : "") + (_142 !== null ? "_" + _142 : "");
					}
					_1.style(_14b, "width", _149 + "px");
					_1.style(_14b, "height", _148.height + "px");
					var zone = new ebg.zone();
					zone.create(this, _14b, _148.width, _148.height);
					zone.setPattern("grid");
					zone["location"] = _147;
					zone.owner = _141;
					zone.HTML_class = _146;
					zone.grouped_by_age = _143;
					if (_144 != null) {
							var _14c = $(_140 + "_count" + (_141 != 0 ? "_" + _141 : "") + (_142 !== null ? "_" + _142 : ""));
							zone.counter = new ebg.counter();
							zone.counter.create(_14c);
							zone.counter.setValue(0);
							if (!_145) {
									_1.style(zone.counter.span, "visibility", "hidden");
							}
							zone.counter.method = _144;
							zone.counter.display_zero = _145;
					} else {
							zone.counter = null;
					}
					return zone;
			},
			createAndAddToZone: function(zone, _14d, age, id, _14e, card) {
					var _14f;
					if (id === null) {
							_14f = false;
							id = this.uniqueIdForCard(age);
					} else {
							if (zone.owner != 0 && zone["location"] == "achievements") {
									_14f = false;
							} else {
									_14f = true;
							}
					}
					var _150 = this.getCardHTMLId(id, age, zone.HTML_class);
					var _151 = this.getCardHTMLClass(id, age, zone.HTML_class);
					var node = this.createCard(id, age, zone.HTML_class, _14f ? card : null);
					_1.place(node, _14e);
					this.addToZone(zone, id, _14d, age);
			},
			moveBetweenZones: function(_152, _153, _154, _155, card) {
					if (_154 == _155 && card.age !== null) {
							this.addToZone(_153, _155, card.position_to, card.age);
							this.removeFromZone(_152, _154, false, card.age);
					} else {
							this.createAndAddToZone(_153, card.position_to, card.age, _155, this.getCardHTMLId(_154, card.age, _152.HTML_class), card);
							this.removeFromZone(_152, _154, true, card.age);
					}
			},
			addToZone: function(zone, id, _156, age) {
					var _157 = this.getCardHTMLId(id, age, zone.HTML_class);
					_1.style(_157, "position", "absolute");
					if (zone["location"] == "revealed" && zone.items.length == 0) {
							_1.style(zone.container_div, "display", "block");
					}
					var _158 = zone["location"] != "board" && zone["location"] != "achievements";
					var _159 = false;
					var p = 0;
					for (var i = 0; i < zone.items.length; i++) {
							var item = zone.items[i];
							if (_158 && this.getCardAgeFromHTMLId(item.id) < age) {
									continue;
							}
							if (!_159 && _158 && this.getCardAgeFromHTMLId(item.id) > age || p == _156) {
									var _15a = i;
									_159 = true;
							}
							if (_159) {
									item.weight++;
									_1.style(item.id, "z-index", item.weight);
							}
							p++;
					}
					if (!_159) {
							var _15a = zone.items.length;
					}
					_1.style(_157, "z-index", _15a);
					zone.placeInZone(_157, _15a);
					if (zone["location"] == "board" && (zone.splay_direction == 1 || zone.splay_direction == 2)) {
							this.updateZoneWidth(zone);
					}
					zone.updateDisplay();
					if (zone.counter !== null) {
							var _15b;
							switch (zone.counter.method) {
							case ("COUNT"):
									_15b = 1;
									break;
							case ("SUM"):
									_15b = parseInt(age);
									break;
							}
							zone.counter.incValue(_15b);
							if (!zone.counter.display_zero) {
									_1.style(zone.counter.span, "visibility", zone.counter.getValue() == 0 ? "hidden" : "visible");
							}
					}
			},
			removeFromZone: function(zone, id, _15c, age) {
					var _15d = this.getCardHTMLId(id, age, zone.HTML_class);
					var _15e = false;
					for (var i = 0; i < zone.items.length; i++) {
							var item = zone.items[i];
							if (_15e) {
									item.weight--;
									_1.style(item.id, "z-index", item.weight);
									continue;
							}
							if (item.id == _15d) {
									_15e = true;
							}
					}
					zone.removeFromZone(_15d, _15c);
					if (zone["location"] == "board" && (zone.splay_direction == 1 || zone.splay_direction == 2)) {
							this.updateZoneWidth(zone);
					} else {
							if (zone["location"] == "revealed" && zone.items.length == 0) {
									zone = this.createZone("revealed", zone.owner, null, grouped_by_age = false);
									_1.style(zone.container_div, "display", "none");
							}
					}
					zone.updateDisplay();
					if (zone.counter !== null) {
							var _15f;
							switch (zone.counter.method) {
							case ("COUNT"):
									_15f = -1;
									break;
							case ("SUM"):
									_15f = parseInt(-age);
									break;
							}
							zone.counter.incValue(_15f);
							if (!zone.counter.display_zero) {
									_1.style(zone.counter.span, "visibility", zone.counter.getValue() == 0 ? "hidden" : "visible");
							}
					}
			},
			shrinkZoneForNoneOrUpSplay: function(zone) {
					width = this.card_dimensions[zone.HTML_class].width;
					width += "px";
					_1.setStyle(zone.container_div, "width", width);
			},
			updateZoneWidth: function(zone) {
					width = this.card_dimensions[zone.HTML_class].width + (zone.items.length - 1) * this.overlap_for_splay[zone.HTML_class][this.display_mode ? "expanded" : "compact"];
					width += "px";
					_1.setStyle(zone.container_div, "width", width);
			},
			setPlacementRules: function(zone, _160) {
					var self = this;
					zone.itemIdToCoordsGrid = function(i, _161) {
							var w = self.card_dimensions[this.HTML_class].width;
							var h = self.card_dimensions[this.HTML_class].height;
							var _162 = self.delta[this["location"]];
							var n = self.nb_cards_in_row[this["location"]];
							if (_160) {
									var _163 = 0;
									var _164 = _162.x;
							} else {
									var _163 = _161 - w;
									var _164 = -_162.x;
							}
							var _165 = _162.y;
							var n_x = i % n;
							var n_y = parseInt(i / n);
							return {
									"x": _163 + _164 * n_x,
									"y": _165 * n_y,
									"w": w,
									"h": h
							};
					}
					;
			},
			setPlacementRulesForAchievements: function() {
					var self = this;
					var zone = this.zone.achievements["0"];
					zone.itemIdToCoordsGrid = function(i, _166) {
							var w = self.card_dimensions[this.HTML_class].width;
							var h = self.card_dimensions[this.HTML_class].height;
							var x = parseInt(i / 3) * (w + 10);
							var y = (i % 3) * (h + 5);
							return {
									"x": x,
									"y": y,
									"w": w,
									"h": h
							};
					}
					;
			},
			setPlacementRulesForSpecialAchievements: function() {
					var self = this;
					var zone = this.zone.special_achievements["0"];
					zone.itemIdToCoordsGrid = function(i, _167) {
							var w = self.card_dimensions[this.HTML_class].width;
							var h = self.card_dimensions[this.HTML_class].height;
							var x = i * (w / 2 + 5);
							var y = (i % 2) * (h + 5);
							return {
									"x": x,
									"y": y,
									"w": w,
									"h": h
							};
					}
					;
			},
			setSplayMode: function(zone, _168, _169) {
					_169 = this.setDefault(_16a, null);
					var _16a = _169 || this.view_full;
					zone.splay_direction = _168;
					if (_168 == 0 || _168 == 3 || _16a) {
							this.shrinkZoneForNoneOrUpSplay(zone);
					} else {
							this.updateZoneWidth(zone);
					}
					var self = this;
					zone.itemIdToCoordsGrid = function(i, _16b) {
							var w = self.card_dimensions[this.HTML_class].width;
							var h = self.card_dimensions[this.HTML_class].height;
							var _16c = self.overlap_for_splay[this.HTML_class][self.display_mode ? "expanded" : "compact"];
							if (_16a) {
									var _16d = 0;
									var _16e = 0;
									var _16f = h + 5;
							} else {
									switch (parseInt(_168)) {
									case 0:
											var _16d = 0;
											var _16e = 0;
											var _16f = self.overlap_for_unsplayed;
											break;
									case 1:
											var _16d = _16b - w;
											var _16e = -_16c;
											var _16f = 0;
											break;
									case 2:
											var _16d = 0;
											var _16e = _16c;
											var _16f = 0;
											break;
									case 3:
											var _16d = 0;
											var _16e = 0;
											var _16f = _16c;
											break;
									default:
											break;
									}
							}
							return {
									"x": _16d + _16e * i,
									"y": _16f * (_16a || _168 == 3 ? this.items.length - 1 - i : i),
									"w": w,
									"h": h
							};
					}
					;
					zone.updateDisplay();
			},
			givePlayerActionCard: function(_170, _171) {
					_1.addClass("action_indicator_" + _170, "action_" + _171);
					var _172 = _171 == 1 ? _("First action") : _("Second action");
					var _173 = this.createAdjustedContent(_172, "action_text", "", 15, 2);
					$("action_indicator_" + _170).innerHTML = _173;
			},
			destroyActionCard: function() {
					var _174 = _1.query(".action_indicator");
					_174.forEach(function(node) {
							node.innerHTML = "";
					});
					for (var i = 1; i <= 2; i++) {
							_174.removeClass("action_" + i);
					}
			},
			action_clicForInitialMeld: function(_175) {
					if (!this.checkAction("initialMeld")) {
							return;
					}
					this.deactivateClickEvents();
					this.destroyMyHandAndBoardTooltips(true);
					this.createMyHandAndBoardTooltipsWithoutActions(true);
					var _176 = this.getCardHTMLIdFromEvent(_175);
					var _177 = this.getCardIdFromHTMLId(_176);
					_1.addClass(_176, "selected");
					var self = this;
					this.ajaxcall("/innovation/innovation/initialMeld.html", {
							lock: true,
							card_id: _177
					}, this, function(_178) {}, function(_179) {
							if (_179) {
									self.resurrectClickEvents();
							}
					});
			},
			action_clicForAchieve: function(_17a) {
					if (!this.checkAction("achieve")) {
							return;
					}
					this.deactivateClickEvents();
					var _17b = this.getCardHTMLIdFromEvent(_17a);
					if (_17b.substr(0, 4) == "item") {
							var age = this.getCardAgeFromHTMLId(_17b);
					} else {
							var age = _17b.substr(_17b.length - 1, 1);
					}
					var self = this;
					this.ajaxcall("/innovation/innovation/achieve.html", {
							lock: true,
							age: age
					}, this, function(_17c) {}, function(_17d) {
							if (_17d) {
									self.resurrectClickEvents();
							}
					});
			},
			action_clicForDraw: function(_17e) {
					if (!this.checkAction("draw")) {
							return;
					}
					this.deactivateClickEvents();
					var self = this;
					this.ajaxcall("/innovation/innovation/draw.html", {
							lock: true,
					}, this, function(_17f) {}, function(_180) {
							if (_180) {
									self.resurrectClickEvents();
							}
					});
			},
			action_clicForMeld: function(_181) {
					if (!this.checkAction("meld")) {
							return;
					}
					this.deactivateClickEvents();
					var _182 = this.getCardHTMLIdFromEvent(_181);
					var _183 = this.getCardIdFromHTMLId(_182);
					var self = this;
					this.ajaxcall("/innovation/innovation/meld.html", {
							lock: true,
							card_id: _183
					}, this, function(_184) {}, function(_185) {
							if (_185) {
									self.resurrectClickEvents();
							}
					});
			},
			action_clicForDogma: function(_186) {
					if (!this.checkAction("dogma")) {
							return;
					}
					var _187 = this.getCardHTMLIdFromEvent(_186);
					var _188 = this.getCardIdFromHTMLId(_187);
					var self = this;
					var _189 = function() {
							self.deactivateClickEvents();
							var _18a = self;
							self.ajaxcall("/innovation/innovation/dogma.html", {
									lock: true,
									player_id: self.player_id,
									card_id: _188
							}, self, function(_18b) {}, function(_18c) {
									if (_18c) {
											_18a.resurrectClickEvents();
									}
							});
					};
					var _18d = _1.query("#" + _187 + " .i_demand_effect_1").length == 1 && _1.query("#" + _187 + " .non_demand_effect_1").length == 0;
					if (_18d) {
							var _18e = _1.attr(_1.query("#" + _187 + " .i_demand_effect_1 .icon_in_dogma")[0], "class").substr(-1);
							var _18f = this.counter.ressource_count[this.player_id][_18e].getValue();
							var _190 = true;
							for (var _191 in this.players) {
									if (this.counter.ressource_count[_191][_18e].getValue() < _18f) {
											_190 = false;
									}
							}
							if (_190) {
									this.confirmationDialog(_("Activating this card will have no effect. Are you sure you want to do this?"), _1.hitch(this, _189));
							} else {
									_189();
							}
					} else {
							_189();
					}
			},
			action_clicForChoose: function(_192) {
					if (!this.checkAction("choose")) {
							return;
					}
					if (this.color_pile !== null) {
							var zone = this.zone.board[this.player_id][this.color_pile];
							this.setSplayMode(zone, zone.splay_direction, force_full_visible = false);
					}
					this.deactivateClickEvents();
					var _193 = this.getCardHTMLIdFromEvent(_192);
					var _194 = this.getCardIdFromHTMLId(_193);
					var self = this;
					this.ajaxcall("/innovation/innovation/choose.html", {
							lock: true,
							card_id: _194
					}, this, function(_195) {}, function(_196) {
							if (_196) {
									self.resurrectClickEvents();
							}
					});
			},
			action_clicForChooseRecto: function(_197) {
					if (!this.checkAction("choose")) {
							return;
					}
					this.deactivateClickEvents();
					var _198 = this.getCardHTMLIdFromEvent(_197);
					var _199 = this.getCardIdFromHTMLId(_198);
					var age = this.getCardAgeFromHTMLId(_198);
					var _19a = _197.currentTarget.parentNode;
					var _19b = _1.getAttr(_19a, "id").split("_");
					var _19c = _19b[0];
					var _19d = _19b[1];
					var zone = this.getZone(_19c, _19d, age);
					var _19e = this.getCardPositionFromId(zone, _199, age);
					var self = this;
					this.ajaxcall("/innovation/innovation/chooseRecto.html", {
							lock: true,
							owner: _19d,
							location: _19c,
							age: age,
							position: _19e
					}, this, function(_19f) {}, function(_1a0) {
							if (_1a0) {
									self.resurrectClickEvents();
							}
					});
			},
			action_clicForChooseSpecialOption: function(_1a1) {
					if (!this.checkAction("choose")) {
							return;
					}
					var _1a2 = this.getCardHTMLIdFromEvent(_1a1);
					var _1a3 = _1a2.substr(7);
					if (this.choose_two_colors) {
							if (this.first_chosen_color === null) {
									this.first_chosen_color = _1a3;
									_1.destroy(_1a1.target);
									var _1a4 = _1.query("#pagemaintitletext > span[style]");
									var You = _1a4[_1a4.length - 1].outerHTML;
									$("pagemaintitletext").innerHTML = _1.string.substitute(_("${You} still must choose one color"), {
											"You": You
									});
									return;
							}
							_1a3 = Math.pow(2, this.first_chosen_color) + Math.pow(2, _1a3);
							this.first_chosen_color = null;
					}
					this.deactivateClickEvents();
					var self = this;
					this.ajaxcall("/innovation/innovation/chooseSpecialOption.html", {
							lock: true,
							choice: _1a3
					}, this, function(_1a5) {}, function(_1a6) {
							if (_1a6) {
									self.resurrectClickEvents();
							}
					});
			},
			action_clicForPassOrStop: function() {
					if (!this.checkAction("choose")) {
							return;
					}
					if (this.publication_permutations_done !== null) {
							this.publicationClicForUndoingSwaps();
							for (var _1a7 = 0; _1a7 < 5; _1a7++) {
									var zone = this.zone.board[this.player_id][_1a7];
									this.setSplayMode(zone, zone.splay_direction, force_full_visible = false);
							}
							this.on(_1.query("#change_display_mode_button"), "onclick", "toggle_displayMode");
							this.publication_permuted_zone = null;
							this.publication_permutations_done = null;
							this.publication_original_items = null;
					} else {
							if (this.color_pile !== null) {
									var zone = this.zone.board[this.player_id][this.color_pile];
									this.setSplayMode(zone, zone.splay_direction, force_full_visible = false);
							}
					}
					this.deactivateClickEvents();
					var self = this;
					this.ajaxcall("/innovation/innovation/choose.html", {
							lock: true,
							card_id: -1
					}, this, function(_1a8) {}, function(_1a9) {
							if (_1a9) {
									self.resurrectClickEvents();
							}
					});
			},
			action_clicForSplay: function(_1aa) {
					if (!this.checkAction("choose")) {
							return;
					}
					this.deactivateClickEvents();
					var _1ab = this.getCardHTMLIdFromEvent(_1aa);
					var _1ac = _1ab.substr(6);
					var self = this;
					this.ajaxcall("/innovation/innovation/choose.html", {
							lock: true,
							card_id: this.getCardIdFromHTMLId(this.zone.board[this.player_id][_1ac].items[0].id)
					}, this, function(_1ad) {}, function(_1ae) {
							if (_1ae) {
									self.resurrectClickEvents();
							}
					});
			},
			action_publicationClicForRearrange: function(_1af) {
					if (!this.checkAction("choose")) {
							return;
					}
					var _1b0 = this.publication_permuted_zone.container_div.slice(-1);
					var _1b1 = [];
					for (var i = 0; i < this.publication_permutations_done.length; i++) {
							var _1b2 = this.publication_permutations_done[i];
							_1b1.push(_1b2.position + "," + _1b2.delta);
					}
					_1b1 = _1b1.join(";");
					this.publicationResetInterface();
					for (var _1b3 = 0; _1b3 < 5; _1b3++) {
							var zone = this.zone.board[this.player_id][_1b3];
							this.setSplayMode(zone, zone.splay_direction, force_full_visible = false);
					}
					this.on(_1.query("#change_display_mode_button"), "onclick", "toggle_displayMode");
					this.publication_permuted_zone = null;
					this.publication_permutations_done = null;
					this.publication_original_items = null;
					this.deactivateClickEvents();
					var self = this;
					this.ajaxcall("/innovation/innovation/publicationRearrange.html", {
							lock: true,
							color: _1b0,
							permutations_done: _1b1
					}, this, function(_1b4) {}, function(_1b5) {
							if (_1b5) {
									self.resurrectClickEvents();
							}
					});
			},
			publicationClicForMove: function(_1b6) {
					var _1b7 = this.getCardHTMLIdFromEvent(_1b6);
					var _1b8 = $("publication_arrow_up");
					var _1b9 = $("publication_arrow_down");
					if (!_1b8) {
							_1b8 = _1.create("button", {
									"id": "publication_arrow_up"
							});
							_1b8.innerHTML = "<span>&#8593;</span>";
							_1.connect(_1b8, "onclick", this, "publicationClicForSwap");
							_1b9 = _1.create("button", {
									"id": "publication_arrow_down"
							});
							_1b9.innerHTML = "<span>&#8595;</span>";
							_1.connect(_1b9, "onclick", this, "publicationClicForSwap");
					}
					_1.place(_1b8, _1b7);
					_1.place(_1b9, _1b7);
			},
			publicationClicForSwap: function(_1ba) {
					var _1bb = _1ba.currentTarget;
					var _1bc = _1bb == $("publication_arrow_up") ? 1 : -1;
					var _1bd = _1.getAttr(_1bb.parentNode, "id");
					var _1be = this.getCardIdFromHTMLId(_1bd);
					var _1bf = this.saved_cards[_1be].color;
					var zone = this.zone.board[this.player_id][_1bf];
					var _1c0 = zone.items;
					for (var p = 0; p < _1c0.length; p++) {
							var it = zone.items[p];
							if (it.id == _1bd) {
									var item = it;
									var _1c1 = p;
									break;
							}
					}
					if (_1c1 == 0 && _1bc == -1 || _1c1 == _1c0.length - 1 && _1bc == 1) {
							return;
					}
					if (this.publication_permutations_done.length == 0) {
							var _1c2 = _1.create("a", {
									"id": "publication_cancel",
									"class": "bgabutton bgabutton_red"
							});
							_1c2.innerHTML = _("Cancel");
							_1.place(_1c2, $("splay_indicator_" + this.player_id + "_" + _1bf), "after");
							_1.connect(_1c2, "onclick", this, "publicationClicForUndoingSwaps");
							var done = _1.create("a", {
									"id": "publication_done",
									"class": "bgabutton bgabutton_blue"
							});
							done.innerHTML = _("Done");
							_1.place(done, _1c2, "after");
							_1.connect(done, "onclick", this, "action_publicationClicForRearrange");
							var _1c3 = [0, 1, 2, 3, 4];
							_1c3.splice(_1bf, 1);
							var _1c4 = this.selectCardsOnMyBoardOfColors(_1c3);
							_1c4.removeClass("clickable");
							this.off(_1c4, "onclick");
							this.publication_permuted_zone = zone;
							this.publication_original_items = _1c0.slice();
					}
					this.publication_permutations_done.push({
							"position": _1c1,
							"delta": _1bc
					});
					this.publicationSwap(this.player_id, zone, _1c1, _1bc);
					no_change = true;
					for (var p = 0; p < _1c0.length; p++) {
							if (_1c0[p] != this.publication_original_items[p]) {
									no_change = false;
							}
					}
					if (no_change) {
							this.publicationResetInterface(keep_arrows = true);
					}
			},
			publicationClicForUndoingSwaps: function() {
					for (var i = this.publication_permutations_done.length - 1; i >= 0; i--) {
							var _1c5 = this.publication_permutations_done[i];
							this.publicationSwap(this.player_id, this.publication_permuted_zone, _1c5.position, _1c5.delta);
					}
					this.publicationResetInterface();
			},
			publicationResetInterface: function(_1c6) {
					_1c6 = this.setDefault(_1c6, false);
					if (!_1c6) {
							_1.destroy("publication_arrow_up");
							_1.destroy("publication_arrow_down");
					}
					_1.destroy("publication_cancel");
					_1.destroy("publication_done");
					var _1c7 = this.selectAllCardsOnBoard();
					_1c7.addClass("clickable");
					this.on(_1c7, "onclick", "publicationClicForMove");
					this.publication_permuted_zone = null;
					this.publication_permutations_done = [];
			},
			publicationSwap: function(_1c8, zone, _1c9, _1ca) {
					_1c9 = parseInt(_1c9);
					_1ca = parseInt(_1ca);
					var item = zone.items[_1c9];
					var _1cb = zone.items[_1c9 + _1ca];
					item.weight += _1ca;
					_1cb.weight -= _1ca;
					_1.style(item.id, "z-index", item.weight);
					_1.style(_1cb.id, "z-index", _1cb.weight);
					zone.items[_1c9 + _1ca] = item;
					zone.items[_1c9] = _1cb;
					if (_1c9 == zone.items.length - 1 || _1c9 + _1ca == zone.items.length - 1) {
							up = _1ca == 1;
							old_top_item = up ? _1cb : item;
							new_top_item = up ? item : _1cb;
							old_top_card = this.saved_cards[this.getCardIdFromHTMLId(old_top_item.id)];
							new_top_card = this.saved_cards[this.getCardIdFromHTMLId(new_top_item.id)];
							ressource_counts = {};
							for (var icon = 1; icon <= 6; icon++) {
									ressource_counts[icon] = this.counter.ressource_count[_1c8][icon].getValue();
							}
							switch (parseInt(zone.splay_direction)) {
							case 0:
									ressource_counts[old_top_card.spot_1]--;
									ressource_counts[old_top_card.spot_2]--;
									ressource_counts[old_top_card.spot_3]--;
									ressource_counts[old_top_card.spot_4]--;
									ressource_counts[new_top_card.spot_1]++;
									ressource_counts[new_top_card.spot_2]++;
									ressource_counts[new_top_card.spot_3]++;
									ressource_counts[new_top_card.spot_4]++;
									break;
							case 1:
									ressource_counts[old_top_card.spot_1]--;
									ressource_counts[old_top_card.spot_2]--;
									ressource_counts[old_top_card.spot_3]--;
									ressource_counts[new_top_card.spot_1]++;
									ressource_counts[new_top_card.spot_2]++;
									ressource_counts[new_top_card.spot_3]++;
									break;
							case 2:
									ressource_counts[old_top_card.spot_3]--;
									ressource_counts[old_top_card.spot_4]--;
									ressource_counts[new_top_card.spot_3]++;
									ressource_counts[new_top_card.spot_4]++;
									break;
							case 3:
									ressource_counts[old_top_card.spot_1]--;
									ressource_counts[new_top_card.spot_1]++;
									break;
							}
							for (var icon = 1; icon <= 6; icon++) {
									this.counter.ressource_count[_1c8][icon].setValue(ressource_counts[icon]);
							}
					}
					zone.updateDisplay();
			},
			clic_display_score_window: function() {
					this.my_score_verso_window.show();
			},
			clic_close_score_window: function() {
					this.my_score_verso_window.hide();
			},
			toggle_displayMode: function() {
					this.display_mode = !this.display_mode;
					var _1cc = this.display_mode ? this.text_for_expanded_mode : this.text_for_compact_mode;
					var _1cd = this.display_mode ? this.arrows_for_expanded_mode : this.arrows_for_compact_mode;
					var _1ce = this.format_string_recursive("${arrows} ${button_text}", {
							"arrows": _1cd,
							"button_text": _1cc,
							"i18n": ["button_text"]
					});
					$("change_display_mode_button").innerHTML = _1ce;
					for (var _1cf in this.players) {
							for (var _1d0 = 0; _1d0 < 5; _1d0++) {
									var zone = this.zone.board[_1cf][_1d0];
									this.setSplayMode(zone, zone.splay_direction);
							}
					}
					if (!this.isSpectator) {
							this.ajaxcall("/innovation/innovation/updateDisplayMode.html", {
									lock: true,
									display_mode: this.display_mode
							}, this, function(_1d1) {}, function(_1d2) {});
					}
			},
			toggle_view: function() {
					this.view_full = !this.view_full;
					var _1d3 = this.view_full ? this.text_for_view_full : this.text_for_view_normal;
					var _1d4 = this.format_string_recursive("${button_text}", {
							"button_text": _1d3,
							"i18n": ["button_text"]
					});
					$("change_view_full_button").innerHTML = _1d4;
					for (var _1d5 in this.players) {
							for (var _1d6 = 0; _1d6 < 5; _1d6++) {
									var zone = this.zone.board[_1d5][_1d6];
									this.setSplayMode(zone, zone.splay_direction);
							}
					}
					if (!this.isSpectator) {
							this.ajaxcall("/innovation/innovation/updateViewFull.html", {
									lock: true,
									view_full: this.view_full
							}, this, function(_1d7) {}, function(_1d8) {});
					}
			},
			setupNotifications: function() {
					console.log("notifications subscriptions setup");
					var _1d9 = 1000;
					_1.subscribe("transferedCard", this, "notif_transferedCard");
					this.notifqueue.setSynchronous("transferedCard", _1d9);
					_1.subscribe("splayedPile", this, "notif_splayedPile");
					this.notifqueue.setSynchronous("splayedPile", _1d9);
					_1.subscribe("rearrangedPile", this, "notif_rearrangedPile");
					_1.subscribe("removedHandsBoardsAndScores", this, "notif_removedHandsBoardsAndScores");
					_1.subscribe("log", this, "notif_log");
					if (this.isSpectator) {
							_1.subscribe("transferedCard_spectator", this, "notif_transferedCard_spectator");
							this.notifqueue.setSynchronous("transferedCard_spectator", _1d9);
							_1.subscribe("splayedPile_spectator", this, "notif_splayedPile_spectator");
							this.notifqueue.setSynchronous("splayedPile_spectator", _1d9);
							_1.subscribe("rearrangedPile_spectator", this, "notif_rearrangedPile_spectator");
							_1.subscribe("removedHandsBoardsAndScores_spectator", this, "notif_removedHandsBoardsAndScores_spectator");
							_1.subscribe("log_spectator", this, "notif_log_spectator");
					}
			},
			notif_transferedCard: function(_1da) {
					var card = _1da.args;
					if (card.location_from == "score" && card.owner_from == this.player_id) {
							this.removeFromZone(this.zone.my_score_verso, card.id, true, card.age);
					}
					var _1db = card.age === null ? this.zone.special_achievements[0] : this.getZone(card.location_from, card.owner_from, card.age, card.color);
					var _1dc = this.getZone(card.location_to, card.owner_to, card.age, card.color);
					var _1dd = this.getCardTypeInZone(_1db.HTML_class) == "card" || card.age === null;
					var _1de = this.getCardTypeInZone(_1dc.HTML_class) == "card" || card.age === null;
					var _1df;
					var _1e0;
					if (_1dd) {
							_1df = card.id;
							if (_1de) {
									_1e0 = _1df;
							} else {
									_1e0 = null;
							}
					} else {
							var _1df = this.getCardIdFromPosition(_1db, card.position_from, card.age);
							if (_1de) {
									_1e0 = card.id;
							} else {
									_1e0 = _1df;
							}
					}
					if (card.location_to == "achievements") {
							var _1e1 = this.players[card.owner_to].player_team;
							for (var _1e2 in this.players) {
									if (this.players[_1e2].player_team == _1e1) {
											this.scoreCtrl[_1e2].incValue(1);
									}
							}
					}
					if (card.new_score !== undefined) {
							this.counter.score[card.player_id].setValue(card.new_score);
					}
					if (card.new_ressource_counts !== undefined) {
							for (var icon = 1; icon <= 6; icon++) {
									this.counter.ressource_count[card.player_id][icon].setValue(card.new_ressource_counts[icon]);
							}
					}
					if (card.new_max_age_on_board !== undefined) {
							this.counter.max_age_on_board[card.player_id].setValue(card.new_max_age_on_board);
					}
					if (card.new_score_from !== undefined) {
							this.counter.score[card.owner_from].setValue(card.new_score_from);
					}
					if (card.new_score_to !== undefined) {
							this.counter.score[card.owner_to].setValue(card.new_score_to);
					}
					if (card.new_ressource_counts_from !== undefined) {
							for (var icon = 1; icon <= 6; icon++) {
									this.counter.ressource_count[card.owner_from][icon].setValue(card.new_ressource_counts_from[icon]);
							}
					}
					if (card.new_ressource_counts_to !== undefined) {
							for (var icon = 1; icon <= 6; icon++) {
									this.counter.ressource_count[card.owner_to][icon].setValue(card.new_ressource_counts_to[icon]);
							}
					}
					if (card.new_max_age_on_board_from !== undefined) {
							this.counter.max_age_on_board[card.owner_from].setValue(card.new_max_age_on_board_from);
					}
					if (card.new_max_age_on_board_to !== undefined) {
							this.counter.max_age_on_board[card.owner_to].setValue(card.new_max_age_on_board_to);
					}
					this.moveBetweenZones(_1db, _1dc, _1df, _1e0, card);
					if (card.location_to == "score" && card.owner_to == this.player_id) {
							this.createAndAddToZone(this.zone.my_score_verso, card.position_to, card.age, card.id, _1.body(), card);
							_1de = true;
					}
					if (_1de) {
							card.owner = card.owner_to;
							card["location"] = card.location_to;
							card.position = card.position_to;
							card.splay_direction = card.splay_direction_to;
							this.addTooltipForCard(card);
					} else {
							if (card.location_to == "achievements" && card.age !== null) {
									var _1e3 = this.getCardHTMLId(card.id, card.age, _1db.HTML_class);
									this.removeTooltip(_1e3);
									card.owner = card.owner_to;
									card["location"] = card.location_to;
									card.position = card.position_to;
									this.addTooltipForRecto(card, false);
							}
					}
			},
			notif_splayedPile: function(_1e4) {
					var _1e5 = _1e4.args.player_id;
					var _1e6 = _1e4.args.color;
					var _1e7 = _1e4.args.splay_direction;
					var _1e8 = _1e4.args.splay_direction_in_clear;
					var _1e9 = _1e4.args.forced_unsplay;
					this.setSplayMode(this.zone.board[_1e5][_1e6], _1e7);
					var _1ea = "splay_indicator_" + _1e5 + "_" + _1e6;
					for (var _1eb = 0; _1eb < 4; _1eb++) {
							if (_1eb == _1e7) {
									_1.addClass(_1ea, "splay_" + _1eb);
							} else {
									_1.removeClass(_1ea, "splay_" + _1eb);
							}
					}
					this.removeTooltip("splay_" + _1e5 + "_" + _1e6);
					if (_1e7 > 0) {
							this.addCustomTooltip("splay_indicator_" + _1e5 + "_" + _1e6, _1.string.substitute(_("This pile is splayed ${direction}."), {
									"direction": "<b>" + _1e8 + "</b>"
							}), "");
					}
					if (_1e7 > 0 || _1e9) {
							for (var icon = 1; icon <= 6; icon++) {
									this.counter.ressource_count[_1e5][icon].setValue(_1e4.args.new_ressource_counts[icon]);
							}
					}
					if (_1e7 == 0) {
							this.number_of_splayed_piles--;
							if (this.number_of_splayed_piles == 0) {
									this.disableButtonForSplayMode();
							}
					} else {
							this.number_of_splayed_piles++;
							if (this.number_of_splayed_piles == 1) {
									this.enableButtonForSplayMode();
							}
					}
			},
			notif_rearrangedPile: function(_1ec) {
					var _1ed = _1ec.args.player_id;
					var _1ee = _1ec.args.rearrangement;
					var _1ef = _1ee.color;
					var _1f0 = _1ee.permutations_done;
					var _1f1 = this.zone.board[_1ed][_1ef];
					for (var i = 0; i < _1f0.length; i++) {
							var _1f2 = _1f0[i];
							this.publicationSwap(_1ed, _1f1, _1f2.position, _1f2.delta);
					}
			},
			notif_removedHandsBoardsAndScores: function(_1f3) {
					this.zone.my_score_verso.removeAll();
					for (var _1f4 in this.players) {
							this.zone.revealed[_1f4].removeAll();
							this.zone.hand[_1f4].removeAll();
							this.zone.score[_1f4].removeAll();
							for (var _1f5 = 0; _1f5 < 5; _1f5++) {
									this.zone.board[_1f4][_1f5].removeAll();
							}
					}
					for (var _1f4 in this.players) {
							this.counter.score[_1f4].setValue(0);
							this.zone.hand[_1f4].counter.setValue(0);
							this.counter.max_age_on_board[_1f4].setValue(0);
					}
					for (var _1f4 in this.players) {
							for (var icon = 1; icon <= 6; icon++) {
									this.counter.ressource_count[_1f4][icon].setValue(0);
							}
					}
					for (var _1f4 in this.players) {
							for (var _1f5 = 0; _1f5 < 5; _1f5++) {
									this.setSplayMode(this.zone.board[_1f4][_1f5], 0);
									var _1f6 = "splay_indicator_" + _1f4 + "_" + _1f5;
									_1.addClass(_1f6, "splay_0");
									for (var _1f7 = 1; _1f7 < 4; _1f7++) {
											_1.removeClass(_1f6, "splay_" + _1f7);
									}
							}
					}
					this.disableButtonForSplayMode();
					this.number_of_splayed_piles = 0;
			},
			notif_log: function(_1f8) {
					return;
			},
			notif_transferedCard_spectator: function(_1f9) {
					this.log_for_spectator(_1f9);
					this.notif_transferedCard(_1f9);
			},
			notif_splayedPile_spectator: function(_1fa) {
					this.log_for_spectator(_1fa);
					this.notif_splayedPile(_1fa);
			},
			notif_rearrangedPile_spectator: function(_1fb) {
					this.log_for_spectator(_1fb);
					this.notif_rearrangedPile(_1fb);
			},
			notif_removedHandsBoardsAndScores_spectator: function(_1fc) {
					this.log_for_spectator(_1fc);
					this.notif_removedHandsBoardsAndScores(_1fc);
			},
			notif_log_spectator: function(_1fd) {
					this.log_for_spectator(_1fd);
					this.notif_log(_1fd);
			},
			log_for_spectator: function(_1fe) {
					_1fe.args = this.notifqueue.playerNameFilterGame(_1fe.args);
					_1fe.args.log = this.format_string_recursive(_1fe.args.log, _1fe.args);
					var log = "<div class='log' style='height: auto; display: block; color: rgb(0, 0, 0);'><div class='roundedbox'>" + _1fe.args.log + "</div></div>";
					_1.place(log, $("logs"), "first");
			},
			format_string_recursive: function(log, args) {
					try {
							if (log && args && !args.processed) {
									args.processed = true;
									if (!this.isSpectator) {
											args.You = this.getColoredText(_("You"));
											args.you = this.getColoredText(_("you"));
											args.Your = this.getColoredText(_("Your"));
											args.your = this.getColoredText(_("your"));
											args.player_name_as_you = this.getColoredText(_("You"));
									}
									if (typeof args.card_name == "string") {
											args.card_name = this.getCardChain(args);
									}
									if (this.player_id == args.opponent_id) {
											args.message_for_others = args.message_for_opponent;
									}
							}
					} catch (e) {
							console.error(log, args, "Exception thrown", e.stack);
					}
					return this.inherited(arguments);
			},
			getColoredText: function(_1ff, _200) {
					_200 = this.setDefault(_200, this.player_id);
					var _201 = this.gamedatas.players[_200].color;
					return "<span style='font-weight:bold;color:#" + _201 + "'>" + _1ff + "</span>";
			},
			getCardChain: function(args) {
					var _202 = [];
					for (var i = 0; i <= 9; i++) {
							if (typeof args["card_" + i] != "string") {
									break;
							}
							_202.push(this.getColoredText(_(args["card_" + i]), args["ref_player_" + i]));
					}
					var _203 = "&rarr;";
					return _202.join(_203);
			}
	});
});
