class gText {
	constructor(g) {
		this.elem = g;
		this.texts = []; //akku for text elems, each elem {w:textWidth,el:elem,i:indexOfChild}

	}
	//#region text
	computeTextColors(fill, alpha = 1, textBg = null) {
		fill = fill ? fill : this.fg ? this.fg : textBg ? colorIdealText(textBg) : this.bg ? colorIdealText(this.bg) : null;
		if (!fill) {
			fill = 'white';
			textBg = 'gray';
		}
		fill = anyColorToStandardString(fill, alpha);
		return { fill: fill, bg: textBg ? textBg : this.bg };
	}
	setTextFill(r, fill, alpha = 1, textBg = null) {
		let textColors = this.computeTextColors(fill, alpha, textBg);
		//console.log('text color fill='+fill,'bg='+this.bg,'fg='+this.fg,'textBg='+textBg)
		r.setAttribute('fill', textColors.fill);
		r.setAttribute('stroke', 'none');
		r.setAttribute('stroke-width', 0);
		return textColors.bg;
	}
	setTextBorder(color, thickness = 0) {
		//to set stroke for line or text different from fill!
		let c = anyColorToStandardString(color);
		let children = arrChildren(this.elem);
		unitTestMS('setTextBorder', children);
		for (const ch of children) {
			//console.log(ch.getAttribute('stroke-width'));
			let t = getTypeOf(ch);
			if (t == 'text' || t == 'line') {
				ch.setAttribute('stroke-width', thickness);
				ch.setAttribute('stroke', c);
			}
		}
	}
	calcTextWidth(txt, fz, family, weight) {
		let sFont = weight + ' ' + fz + 'px ' + family; //"bold 12pt arial"
		sFont = sFont.trim();
		let wText = getTextWidth(txt, sFont);
		return wText;
	}

	addFrame(color) {
		if (this.cat == 'd') {
			//console.log(this.body)
			this.body.style.boxSizing = 'border-box';
			//console.log('adding a frame')
			this.body.style.border = '5px solid ' + color;
		}
	}
	addFlexTitleBody() {
		let content = this.elem.innerHTML;
		clearElement(this.elem);
		let d = this.elem;
		d.style.display = 'flex';
		d.style.flexDirection = 'column';
		let dTitle = document.createElement('div');
		this.title = dTitle;
		this.title.style.padding = '6px';
		this.title.style.textAlign = 'center';
		let dBody = document.createElement('div');
		dBody.style.flexGrow = 1;
		dBody.style = "flex-grow:1;overflow:auto;padding:0px 6px"
		this.body = dBody;
		this.body.innerHTML = content;
		this.elem.appendChild(this.title);
		this.elem.appendChild(this.body);
	}

	setTitle({
		txt,
		className = null,
		isOverlay = false,
		isMultiText = false,
		replaceFirst = true,
		fill = null,
		textBg = null,
		alpha = 1,
		x = 0,
		y = 0,
		fz = 20,
		family = 'Arial, Helvetica, sans-serif',
		weight = ''
	} = {}) {


		if (this.cat == 'd') {
			if (nundef(this.body) || nundef(this.title)) {
				this.addFlexTitleBody();
			}
			clearElement(this.title);
			if (isdef(textBg)) this.title.style.backgroundColor = textBg;
			if (isdef(fill)) this.title.style.color = fill;
			this.title.innerHTML = txt;
			return this;
		}
		let isFirstChild = this.elem.childNodes.length == 0;

		let r = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		if (isFirstChild) {
			this.ground = r;
		}
		r.setAttribute('font-family', family);
		r.setAttribute('font-weight', weight);

		// CSS classes
		if (isOverlay) {
			r.classList.add('overlay');
			this.overlay = r;
		}
		r.classList.add('msText');
		if (className) {
			r.classList.add(className);
		}

		textBg = this.setTextFill(r, fill, alpha, textBg);
		if (isFirstChild) {
			//console.log('ist das hier?!?!?!?!?!?!?')
			this.bgs.ground = textBg;
			this.fgs.ground = fill;
		}
		//console.log('text: textBg='+textBg)
		let wText = this.calcTextWidth(txt, fz, family, weight);

		if (this.isLine && !isMultiText) {
			x += this.x;
			y += this.y;
			//console.log(x, y);
			if (this.textBackground) {
				this.elem.removeChild(this.textBackground);
			}

			this.textBackground = this.getRect({ w: wText + 10, h: fz * 1.5, fill: textBg });
			this.textBackground.setAttribute('rx', 6);
			this.textBackground.setAttribute('ry', 6);
		}
		r.setAttribute('font-size', '' + fz + 'px');
		r.setAttribute('x', x);
		r.setAttribute('y', y + fz / 2.8);
		r.setAttribute('text-anchor', 'middle');
		r.textContent = txt;
		r.setAttribute('pointer-events', 'none'); // geht!!!!!!

		if (replaceFirst && this.texts.length > 0) {
			let ch = this.texts[0].el; //findChildOfType('text', this.elem);

			//console.log('this.textx[0]',ch,this.texts,this)
			this.elem.insertBefore(r, ch);
			if (this.isLine) {
				this.elem.insertBefore(this.textBackground, r);
			}
			this.removeTexts();
		} else {
			if (this.isLine && !isMultiText) {
				this.elem.appendChild(this.textBackground);
			}
			this.elem.appendChild(r);
		}

		let res = { el: r, w: wText };
		this.texts.push(res);
		return res;
	}

	text({
		txt,
		className = null,
		isOverlay = false,
		isMultiText = false,
		replaceFirst = true,
		fill = null,
		textBg = null,
		alpha = 1,
		x = 0,
		y = 0,
		fz = 20,
		family = 'Arial, Helvetica, sans-serif',
		weight = '',
		font
	} = {}) {

		if (isdef(txt) && !isString(txt)) txt = txt.toString();

		//this is to erase all texts from element
		if (isEmpty(txt)) {
			//console.log('erasing...')

			this.removeTexts(); return this;
		}


		// mk.text({txt: val, force: force, shrinkFont: shrinkFont, wrap: wrap, fz: fz, bg: 'white', fill: 'black'});
		//TODO: shrinkFont,wrap,ellipsis options implementieren
		//if replaceFirst true ... if this elem already contains a text, that text child is replaced by new text
		let isFirstChild = this.elem.childNodes.length == 0;

		//let r = getText({txt:txt,className:className,isOverlay:isOverlay,fill:fill,textBg:textBg,alpha:alpha,x:x,y:y,fz:fz,family:family,weight:weight});

		let r = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		if (isFirstChild) { this.ground = r; }

		if (isdef(font)) { r.style.font = font; } //('font', font);}
		else {
			r.setAttribute('font-family', family);
			r.setAttribute('font-weight', weight);
			r.setAttribute('font-size', '' + fz + 'px');
		}


		// CSS classes
		if (isOverlay) { r.classList.add('overlay'); this.overlay = r; }
		r.classList.add('msText');
		if (className) { r.classList.add(className); }
		//console.log('classes attached to new text element',r.getAttribute('class'),r.classList);

		textBg = this.setTextFill(r, fill, alpha, textBg);
		// if (isFirstChild) {
		// 	this.bgs.ground = textBg;
		// 	this.fgs.ground = fill;
		// }
		//console.log('text: textBg='+textBg)
		let wText = isdef(font) ? getTextWidth(txt, font) : this.calcTextWidth(txt, fz, family, weight);

		if (this.isLine && !isMultiText) {
			x += this.x;
			y += this.y;
			//console.log(x, y);
			if (this.textBackground) {
				this.elem.removeChild(this.textBackground);
			}

			this.textBackground = this.getRect({ w: wText + 10, h: fz * 1.5, fill: textBg });
			this.textBackground.setAttribute('rx', 6);
			this.textBackground.setAttribute('ry', 6);
		}
		r.setAttribute('x', x);
		if (isdef(font)) fz = firstNumber(font); //assuming font in px
		//console.log('fz',fz)
		r.setAttribute('y', y + fz / 2.8);
		r.setAttribute('text-anchor', 'middle');
		r.textContent = txt;
		r.setAttribute('pointer-events', 'none'); // geht!!!!!!

		//console.log('texts',this.texts.length,'replaceFirst',replaceFirst,'txt',txt)
		if (replaceFirst && this.texts.length > 0) {
			let ch = this.texts[0].el; //findChildOfType('text', this.elem);

			//console.log('this.texts[0].el',ch, '\nr', r,'\ntexts:',this.texts,this)
			this.elem.insertBefore(r, ch);
			if (this.isLine) {
				this.elem.insertBefore(this.textBackground, r);
			}
			this.removeTexts();
		} else {
			if (this.isLine && !isMultiText) {
				this.elem.appendChild(this.textBackground);
			}
			//console.log('mache appendChild mit ',txt)
			this.elem.appendChild(r);
		}

		let res = { el: r, w: wText };
		this.texts.push(res);
		//console.log('MSOB.text done: res',res)
		//console.log(r)
		return res;
	}
	reduceFontSize(el, n) {
		//console.log('reduceFontSize');
		let fz = el.getAttribute('font-size');
		fz = firstNumber(fz);
		if (fz > n) fz -= n;
		//this.elem.removeChild(el);
		el.setAttribute('font-size', '' + fz + 'px');
	}
	clearText() { this.removeTexts(); }
	removeTexts() {
		for (const t of this.texts) {
			this.elem.removeChild(t.el);
		}
		this.texts = [];
	}
	multitext({
		replacePrevious = true,
		className = '',
		maxWidth = 1000,
		txt = ['one', 'two', 'three'],
		fz = 20,
		fill = null,
		textBg = null,
		padding = 1,
		alpha = 1,
		x = 0,
		y = 0,
		family = 'Arial, Helvetica, sans-serif',
		weight = 'lighter'
	}) {
		let nChar = 0;
		for (const s of txt) { nChar = Math.max(nChar, s.length); }
		let maxFH = Math.round(this.h / txt.length);
		let maxFW = Math.round((this.w / nChar) * 2);

		let fzFit = Math.min(maxFH, maxFW) - 2 * padding;
		if (fzFit < fz) fz = fzFit;
		if (fzFit > 5 * fz) fz *= 5;//fzFit;
		// let stdFonts=[6,14,28,54,100];
		// let fz1=stdFonts[0];
		// for(let i=0;i<stdFonts.length;i++){if (stdFonts[i]>fzFit) break; else fz1=stdFonts[i];}
		// //console.log('fzOrig',fz,'fzFit',fz1);
		// fz=fz1;

		if (replacePrevious) this.removeTexts();

		let h = txt.length * (fz + padding);

		let textColors = this.computeTextColors(fill, alpha, textBg);
		if (this.isLine) {
			x += this.x;
			y += this.y;

			let tbg = this.textBackground ? this.textBackground : this.getRect();

			tbg.setAttribute('height', h);
			tbg.setAttribute('fill', textColors.bg);
			if (!this.textBackground) {
				this.textBackground = tbg;
				this.elem.appendChild(this.textBackground);
			}
			this.textBackground.setAttribute('rx', 6);
			this.textBackground.setAttribute('ry', 6);
		}

		let yStart = y - h / 2 + fz / 2;
		let maxW = 0;
		let akku = [];
		for (const t of txt) {
			let tel = this.text({
				isMultiText: true,
				replaceFirst: false,
				className: className,
				maxWidth: maxWidth,
				txt: t,
				fz: fz,
				fill: fill,
				padding: padding,
				alpha: alpha,
				x: x,
				y: yStart,
				family: family,
				weight: weight
			});
			maxW = Math.max(maxW, tel.w);
			akku.push(tel);
			yStart += fz + padding;
		}
		let isFirstChild = this.elem.childNodes.length == 0;
		if (isFirstChild || this.isLine) {
			this.ground = this.textBackground;
			this.w = maxW + 2 * padding;
			this.h = h;
		}
		if (this.isLine) {
			this.textBackground.setAttribute('width', this.w);
			this.textBackground.setAttribute('x', x - this.w / 2);
			this.textBackground.setAttribute('y', y - this.h / 2);
		}
		if (isFirstChild) { this.bgs.ground = textColors.bg; this.fg.ground = fill; }

		return this;

	}


}

function agText(g, txt, color, font) {
	let res = new gText(g);
	//console.log(res)
	//console.log('res',res,g,txt,color,font)
	res.text({ txt: txt, fill: color, font: font });
	return res;
}
function createLabel_dep(n1, ui, R) {
	//adds n1.label (type: gText)
	let g = ui;
	if (n1.content) {
		let pa = n1.params;
		let transPa = { txt: n1.content };
		let fill = pa.fg;
		if (isdef(fill)) { transPa.fill = fill; }
		else if (isdef(pa.bg)) { transPa.fill = colorIdealText(pa.bg); }
		else {
			//console.log('should set default for fg to white')
			transPa.fill = 'white';
		}

		let font = pa.font; if (isdef(font)) transPa.font = font;
		let gt = n1.label = new gText(g);
		gt.text(transPa);
	}
}

