(function() {
	'use strict';

	var PROJECTS = window.PROJECTS;

	function getParam(name) {
		return new URLSearchParams(window.location.search).get(name);
	}

	window.addEventListener('load', function() {
		requestAnimationFrame(function() {
			requestAnimationFrame(function() {
				document.getElementById('transition-curtain').classList.add('open');
			});
		});
	});

	var slug = getParam('slug');
	var idx  = 0;
	for (var i = 0; i < PROJECTS.length; i++) {
		if (PROJECTS[i].slug === slug) { idx = i; break; }
	}
	var p = PROJECTS[idx];

	document.title = p.title + ' | Adam Grim';

	/* ── Hero ────────────────────────────────────── */
	var heroImage = document.getElementById('detail-hero-image');
	if (p.img) {
		heroImage.style.backgroundImage = 'url(' + p.img + ')';
		heroImage.classList.add('has-photo');
	} else {
		heroImage.style.setProperty('--accent', p.accent);
		heroImage.innerHTML = '<span class="hero-icon">' + p.icon + '</span>';
		heroImage.classList.add('placeholder');
	}

	document.getElementById('detail-category').textContent = p.catLabel;
	document.getElementById('detail-title').textContent    = p.title;

	/* ── Content sections ────────────────────────── */
	document.getElementById('detail-problem').textContent  = p.problem;
	document.getElementById('detail-approach').textContent = p.approach;
	document.getElementById('detail-tools').textContent    = p.tools;
	document.getElementById('detail-outcome').textContent  = p.outcome;

	/* ── Tags ────────────────────────────────────── */
	var tagsEl = document.getElementById('detail-tags');
	p.tags.forEach(function(t) {
		var span = document.createElement('span');
		span.className   = 'tag';
		span.textContent = t.trim();
		tagsEl.appendChild(span);
	});

	/* ── View Model button ───────────────────────── */
	if (p.model) {
		var modelHref = p.model === 'demo'
			? 'viewer-demo.html?demo=1&title=' + encodeURIComponent(p.title)
			: 'viewer-demo.html?model=' + encodeURIComponent(p.model) +
			  '&title=' + encodeURIComponent(p.title);
		document.getElementById('detail-model-btn').href = modelHref;
		document.getElementById('detail-model-wrap').classList.remove('hidden');
	}

	/* ── Prev / Next ─────────────────────────────── */
	var prevBtn = document.getElementById('detail-prev');
	var nextBtn = document.getElementById('detail-next');
	if (idx > 0) {
		prevBtn.href = 'project-detail.html?slug=' + PROJECTS[idx - 1].slug;
		prevBtn.classList.remove('hidden');
	}
	if (idx < PROJECTS.length - 1) {
		nextBtn.href = 'project-detail.html?slug=' + PROJECTS[idx + 1].slug;
		nextBtn.classList.remove('hidden');
	}

})();
