var onDragStart = function (event) {
	console.log('drag start')
  event.preventDefault();
  var clone = event.target.cloneNode(true);
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
  if (!event.target.drag) {return;}
  event.target.style.left = ((event.pageX||(event.clientX+document.body.scrollLeft)) - event.target.drag.x) + "px";
  event.target.style.top = ((event.pageY||(event.clientY+document.body.scrollTop)) - event.target.drag.y) + "px";
};

var onDragEnd = function (event) {
  if (!event.target.drag) {return;}
  // Define persist true to let the source persist and drop the target, otherwise persist the target.
  var persist = true;
  if (persist || event.out) {
    event.target.parentNode.removeChild(event.target);
  } else {
    event.target.parentNode.removeChild(event.target.drag.source);
  }
  event.target.classList.remove("dragging");
  event.target.drag = null;
};

var onDragOver = function (event) {  event.preventDefault();};