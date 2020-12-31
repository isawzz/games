var DDD=null;
var onDragStart = function (event) {
  event.preventDefault();
	var clone = event.target.cloneNode(true);
	DDD=clone;
  clone.classList.add("dragging");
  event.target.parentNode.appendChild(clone);
  var style = getComputedStyle(clone);
  clone.drag = {
    x: (event.pageX||(event.clientX+document.body.scrollLeft)) - clone.offsetLeft + parseInt(style.marginLeft),
    y: (event.pageY||(event.clientY+document.body.scrollTop)) - clone.offsetTop + parseInt(style.marginTop),
    source: event.target
  };
};

var onDragMove = function (event) {
	if (!DDD) return;
	console.log(DDD);
  // if (!event.target.drag) {return;}
  DDD.style.left = ((event.pageX||(event.clientX+document.body.scrollLeft)) - event.target.drag.x) + "px";
  DDD.style.top = ((event.pageY||(event.clientY+document.body.scrollTop)) -event.target.drag.y) + "px";
};

var onDragEnd = function (event) {
	if (!DDD) return;
  // if (!event.target.drag) {return;}
  // Define persist true to let the source persist and drop the target, otherwise persist the target.
  var persist = true;
  if (persist || event.out) {
    //event.target.parentNode.removeChild(event.target);
  } else {
    //event.target.parentNode.removeChild(event.target.drag.source);
  }
  DDD.classList.remove("dragging");
	DDD.drag = null;
	DDD=null;
};

var onDragOver = function (event) {
  event.preventDefault();
};