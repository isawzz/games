# fe questions

Fe fragen 24.4.2020:

- [ ]  position: .loc

    fe: 

    1. keyword ok mit position oder ist es gsm _pos (pos gehoert ja zu rsg flavor of gsm)?
    2. plan to impl as 'loose' nodes nicht im tree weil kann ja auf leaf plaziert werden

        rationale: wenn loc von server obj bestimmt ist anzunehmen dass changed anyway

    3. DD? 2 choices for free floating ('loc') objects:

        A - can put floating els in fixed pos on screen, for that have to find out pos of an element
        relative to window: getBounds

        => vorteil:

        - more intuitive,

        - possibly easier to animate across table

        - easier to arrange when overflowing boundaries

        - can use div on g! can use zIndex (this might be a big plus!)

        B - can give each leaf or other element a 'bag' of objects on top of it that can be emptied //for a g, the bag is another g element with id= _id+_bag

        //for a div, it's a div element

        => vorteil:

        - ich kann leichter innerhalb von bag order imposen (zB snail!) nachteil: muss bag verwalten

        - somehow seems practical to have such a bag

        - parent has local rep of bag content

- [x]  kann ich assumen dass alle nodes in spec die zb panels haben auch type panel haben?

    ja

- [ ]  sollte|koennte man sowas wie default maps machen oder macht das nicht wirklich sinn? (eg. card_map das suit zu fg converts)
- [x]  presentation von fields,edges,corners only when explicit

    muss trotzdem halt invisible ui haben (highlight)

- [x]  NOT IMPLEMENTED fully: list of types as type!!!! =⇒irgend was geht da NICHT!!!!! ⇒debug!!!
    - [ ]  wie koennen lists of types entstehen?
    - [x]  macht es sinn etwas ist zugleich mehrere standard types? nein, glaub nicht
    - [x]  glaub macht nur sinn bei spec types!
    - [ ]  simple impl: wenn mutiple spec types habe, merge alle hinein! ⇒see next point: use meta
- [ ]  wie soll man multiple nodes fuer implicit type (eg., elm: .hand, und hand besteht aus card, daraufhin suche geeigneten spec type fuer diese oids.

    was wenn mehrere nodes finde? right now: last one will just override others if that's the case!

    koennt aber auch intelligentere merge methoden finden ⇒ combine into panel etc.

    vielleicht kann man meta.multi dafuer verwenden, um node fuer implicit rep zu bestimmen?

    meta.multi: combine heisst soll in ein uebergeordnetes panel gesteckt werden

    meta.multi: merge: soll einfach reingemerged werden (eg fuer params brauchbar)

    meta.multi: replace heisst dieser node allein wird fuer implicit rep verwendet 

- [ ]  weiters koennt man auch verfeinern: wie sollen pools combined werden: union, intersect... (noch kein konkretes beispiel)
- [x]  NOT IMPLEMENTED _id, _ref as lists of multiple!

_____________________________________________________________________________________________

Fe fragen 18.4.2020 : OK

⇒ 2 phases: phases 1 build nodes&tree w/ refs, phase2: map to uis 

⇒ distinguish between nodes and tree:

each panel, info, list, etc. is a node that has info from spec/defs, and data

tree is structure holding:

1. ref to node info
2. ref to parent
3. list: ref to children

es gibt also eigentlich 2 trees: einer implizit definiert durch spec T1, und 1 explizit, ergebnis von parsing T2

some correspondence herrscht zwischen T1 panels oder elm oder board fields, corners, edges und children in T2

correspondence zwischen nodes in T1 und T2 gestaltet sich interessant: muss paar beispiele zeichnen um das mit den refs zu verstehen!!!

- cond, _source, _ref have to be at top level of spec node: cond ja, _ref nein!
- zu catan spec: type: board implizit:  heisst das impliziter node sowie main_board??? JA
- meta kann auch default haben, meta default fuer type board koennte sein: init phase
- catan: soll das so bleiben fields: type:info? oder sollte da der ui type den ich tatsaechlich fuer board elements verwende spezifiziert werden?

    gibt mehrere moeglichkeiten: 3 ist correct!!!

    1. board koennte field type auch ueberschreiben /mixin machen

        board koennte dazu ev ein field_type... haben (dass user setzen kann?)

    2. field type koennte board typ beeinflussen (dann wird board ein div statt svg?!?!?)

        nein das ist bloedsinn glaub ich (andererseits, wenn ui dev explizit will dass es dieser type ist soll er es sein)

    3. es koennte mehrere arten von info type geben, depending on container
- [denk JA] kann man spec types,ids und refs gleich von anfang an (nach cond eval) mergen?
- [vielleicht erst uebernaechste version!] cond auswertung sollte eigentlich moeglichst spaet gemacht werden damit fruehere stages reusen kann ⇒ daraus folgt, muss conds auch rec auswerten

von vorher noch: ref heisst einfach nur: shared node appearing in multiple places

- assume _ref only at top level of a node: not true in general!
- a node with _ref cannot be used as (forward-merge) type
- therefore: a node w/ _ref cannot exist in composed root (stage gen20)
- if *ref unique can replace corresponding ids by type:speckey*of_node_containing_ref
- if ref NOT unique can replace corresponding ids by merged ref nodes
    1. merge these ref nodes and add another spec node for merged nodes
    2. replace _ids by name of new spec node
    3. ⇒ again, have previous case
- ref node can contain ids, contained ids are referenced acyclically,

    which means can proceed recursively replacing ids by type:reffedNode

- alternatively to merging nodes w/ same ref can replace corresp. ids by list of types (impl type as list has to be done anyway)
- can impl type:[...] (list) by merging nodes for corresponding items and adding result as new spec node so that in code dont need to deal w/ type lists
- [ ]  first only single ref (aristo spec)

_____________________________________________________

fe fragen von GSM:

- [ ]  timed turns (wie p&p aber turns are timed): game state is only shown when it is this player's turn and during that time, is timed!
- [ ]  welche arten von objects sollen interactiv sein?
    - [x]  proposed answer ⇒ absolutely ALL created uis are interactive! and linked to nearest enclosing oid (=serverObject ID)
    - [ ]  nur leaf objects (ie., in aristocracy waer das nur die cards oder decks, aber nicht hands (das heisst man kann nur einzelne cards electen aber nicht eine ganze hand)
    - [ ]  alle objects in table (also bei compound objects sowie market wird auch der container von den market cards interactiv gemacht)
    - [ ]  wenn vorige option, ist es eigentlich unlogisch wenn man zB market selecten kann aber nicht player.hand, also muesste man das dann erweitern auf: alle objects, including containers of objects koennen selectable sein.

        ie., alle uis die according to spec visualized werden, sind selectable

    - [ ]  wiederum problem: was ist zB mit player.resources.wood? soll das jetzt auch ein selectable object sein???
- [ ]  soll man bei einer action die mehrere ids enthaelt auf jeder einzelnen hovern koennen oder (so wie es jetzt grad ist) auf allen auf einmal (also action ui gilt als 1 unit)
    - [x]  proposed: actions keep as is (1 line=1 unit, highlight all connected uis)
- [ ]  true or false: hovering on object triggers ID of...
    - [ ]  hover on market (aristo) > triggers ID of market (?true)
    - [ ]  hover on player hand > triggers ID of player?????
    - [ ]  hover on indiv card > triggers ID of that card only (true)
    - [ ]  hover on action >triggers all contained IDS (see vorige question) (true)
    - [ ]  hover on wood resource >triggers ID of player ?!? macht irgendwie wenig sinn???!!!???? unsolved...
- [ ]  ueberlegung ob in log auch ein path vorkommen koennte so wie Player1.hand bei dem dann nur die hand vom player getriggered werden soll (bisher nur reine IDs vorgekommen)???

identity

- table (=spielfeld): each ui object linked to nearest enclosing oid
- actions: each ui linked to all contained uis
- log: only IDs are linked to own oid
- default objects: same
- refs (IDs in lists, infobox or default obj rep): linked to own oid/oids if list