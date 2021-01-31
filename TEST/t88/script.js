var el = document.getElementById('anim');
function play() {
	el.style.animationPlayState = 'running';
}
function pause() {
	el.style.animationPlayState = 'paused';
}
function reset() {
	el.style.animation = 'none';
	el.offsetHeight; /* trigger reflow to apply the change immediately */
	el.style.animation = null;
}
function stop() {
	reset();
	pause();
}

// function ResizeThumbs(cls, sz) {
// 	var ds = document.getElementsByTagName('DIV'), a, img, z0 = 0;
// 	for (; z0 < ds.length; z0++) {
// 		img = ds[z0].getElementsByTagName('IMG')[0];
// 		if (img && (' ' + ds[z0].className + ' ').match(' ' + cls + ' ')) {
// 			a = [img, ds[z0], new Image(), sz];
// 			a[2].src = img.src;
// 			ResizeLoad(a)
// 		}
// 	}

// }

// function ResizeLoad(a) {
// 	if (a[2].width < 40) {
// 		a[4] = setTimeout(function () { ResizeLoad(a); }, 200);
// 	}
// 	else {
// 		var w = a[2].width, h = a[2].height, ra = w >= h ? ['height', 'width', a[3] / h, h, w, 'left', 'top'] : ['width', 'height', a[3] / w, w, h, 'top', 'left'];
// 		a[0].style[ra[0]] = ra[3] * ra[2] + 'px';
// 		a[0].style[ra[1]] = (ra[3] * ra[2]) * ra[4] / ra[3] + 'px';
// 		a[0].style.position = 'absolute';
// 		a[1].style.overflow = 'hidden';
// 		a[0].style[ra[5]] = (a[3] - a[0][ra[1]]) / 2 + 'px';
// 		a[0].style[ra[6]] = '0px';
// 	}
// }

// ResizeThumbs('thumb', 100);