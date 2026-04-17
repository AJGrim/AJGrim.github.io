(function() {
	'use strict';

	function navigateWithFade(url) {
		var curtain = document.getElementById('transition-curtain');
		curtain.classList.add('closing');
		setTimeout(function() { window.location.href = url; }, 380);
	}

	/* useCapture: true so this fires before framework listeners (e.g. Dimension) */
	document.addEventListener('click', function(e) {
		var link = e.target.closest('a[href]');
		if (!link) return;
		var href = link.getAttribute('href');
		if (!href || href.startsWith('#') || href.startsWith('http') ||
			href.startsWith('mailto') || href.startsWith('tel')) return;
		e.preventDefault();
		e.stopPropagation();
		navigateWithFade(href);
	}, true);

})();
