(function() {
	'use strict';

	var PROJECTS = window.PROJECTS;

	/* ── Card renderer ───────────────────────────── */
	function buildCard(p) {
		function tagSpans(arr) {
			return arr.map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('');
		}

		var backImageHtml = p.img
			? '<img src="' + p.img + '" alt="" class="back-photo" />'
			: '<div class="back-image-placeholder" style="--accent:' + p.accent + '">' +
			  '<span class="placeholder-icon">' + p.icon + '</span></div>';

		var modelHref = '';
		if (p.model === 'demo') {
			modelHref = 'viewer-demo.html?demo=1&title=' + encodeURIComponent(p.title);
		} else if (p.model) {
			modelHref = 'viewer-demo.html?model=' + encodeURIComponent(p.model) +
			            '&title=' + encodeURIComponent(p.title);
		}
		var modelBtn = modelHref
			? '<a class="back-model-btn" href="' + modelHref + '">View 3D Model</a>'
			: '';

		return (
			'<div class="flip-card" role="listitem" tabindex="0"' +
			' data-slug="'     + p.slug      + '"' +
			' data-category="' + p.category  + '">' +
			'<div class="flip-card-inner">' +
				'<div class="card-front">' +
					'<div class="card-image placeholder" style="--accent:' + p.accent + '">' +
						'<span class="placeholder-icon">' + p.icon + '</span>' +
					'</div>' +
					'<div class="card-body">' +
						'<p class="card-category">'  + p.catLabel + '</p>' +
						'<h3 class="card-title">'    + p.title    + '</h3>' +
						'<p class="card-summary">'   + p.summary  + '</p>' +
						'<div class="tag-row">'      + tagSpans(p.frontTags) + '</div>' +
					'</div>' +
					'<span class="flip-hint" aria-hidden="true">Click to flip</span>' +
					'<div class="card-fold-corner" aria-hidden="true"></div>' +
				'</div>' +
				'<div class="card-back" aria-label="' + p.backTitle + ' details">' +
					backImageHtml +
					'<div class="back-body">' +
						'<p class="back-category">' + p.catLabel + '</p>' +
						'<h3 class="back-title">'   + p.backTitle + '</h3>' +
						'<p class="back-summary">'  + p.summary  + '</p>' +
					'</div>' +
					'<div class="back-footer">' +
						modelBtn +
						'<a class="details-btn" href="project-detail.html?slug=' + p.slug + '">' +
							'Full Details &rarr;' +
						'</a>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'</div>'
		);
	}

	function renderCards() {
		document.getElementById('cardGrid').innerHTML = PROJECTS.map(buildCard).join('');
	}

	/* ── Entrance: lift curtain on load ─────────── */
	window.addEventListener('load', function() {
		requestAnimationFrame(function() {
			requestAnimationFrame(function() {
				document.getElementById('transition-curtain').classList.add('open');
			});
		});
	});

	/* ── Render cards, then wire up interactions ─── */
	renderCards();

	var filterBtns = document.querySelectorAll('.filter-btn');
	var allCards   = Array.from(document.querySelectorAll('.flip-card'));
	var countEl    = document.getElementById('filterCount');

	/* ── Filter with stagger animation ──────────── */
	function updateCount(visible) {
		countEl.classList.add('updating');
		setTimeout(function() {
			countEl.textContent = visible + ' project' + (visible !== 1 ? 's' : '');
			countEl.classList.remove('updating');
		}, 160);
	}

	function applyFilter(filter) {
		var toHide = [];
		var toShow = [];

		allCards.forEach(function(card) {
			var cats = card.getAttribute('data-category') || '';
			var match = filter === 'all' || cats.indexOf(filter) > -1;
			if (match) {
				toShow.push(card);
			} else {
				toHide.push(card);
				card.classList.remove('flipped');
			}
		});

		toHide.forEach(function(card) {
			card.classList.add('filter-exit');
		});

		setTimeout(function() {
			toHide.forEach(function(card) {
				card.classList.add('hidden');
				card.classList.remove('filter-exit');
			});

			toShow.forEach(function(card, i) {
				card.classList.remove('hidden');
				card.classList.remove('filter-enter');
				void card.offsetWidth;
				card.style.animationDelay = (i * 55) + 'ms';
				card.classList.add('filter-enter');
			});

			updateCount(toShow.length);

			setTimeout(function() {
				toShow.forEach(function(card) {
					card.classList.remove('filter-enter');
					card.style.animationDelay = '';
				});
			}, toShow.length * 55 + 400);

		}, toHide.length > 0 ? 220 : 0);
	}

	filterBtns.forEach(function(btn) {
		btn.addEventListener('click', function() {
			filterBtns.forEach(function(b) { b.classList.remove('active'); });
			btn.classList.add('active');
			applyFilter(btn.getAttribute('data-filter'));
		});
	});

	updateCount(allCards.length);

	/* ── Card flip ───────────────────────────────── */
	allCards.forEach(function(card) {
		card.addEventListener('click', function(e) {
			if (e.target.closest && e.target.closest('a')) return;
			var alreadyFlipped = card.classList.contains('flipped');
			allCards.forEach(function(c) { c.classList.remove('flipped'); });
			if (!alreadyFlipped) {
				card.classList.add('flipped');
			}
		});

		card.addEventListener('keydown', function(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				if (!card.classList.contains('flipped')) {
					allCards.forEach(function(c) { c.classList.remove('flipped'); });
					card.classList.add('flipped');
				} else {
					var slug = card.getAttribute('data-slug');
					if (slug) window.location.href = 'project-detail.html?slug=' + slug;
				}
			}
		});
	});

	/* ── Touch / swipe to flip (mobile) ─────────── */
	allCards.forEach(function(card) {
		var touchStartX = null;
		var touchStartY = null;

		card.addEventListener('touchstart', function(e) {
			touchStartX = e.touches[0].clientX;
			touchStartY = e.touches[0].clientY;
		}, { passive: true });

		card.addEventListener('touchend', function(e) {
			if (touchStartX === null) return;
			var dx = e.changedTouches[0].clientX - touchStartX;
			var dy = e.changedTouches[0].clientY - touchStartY;
			if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
				e.preventDefault();
				if (dx < 0) {
					if (!card.classList.contains('flipped')) {
						allCards.forEach(function(c) { c.classList.remove('flipped'); });
						card.classList.add('flipped');
					}
				} else {
					card.classList.remove('flipped');
				}
			}
			touchStartX = null;
			touchStartY = null;
		}, { passive: false });
	});

	/* ── Keyboard: Escape unflips all cards ──────── */
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			allCards.forEach(function(c) { c.classList.remove('flipped'); });
		}
	});

})();
