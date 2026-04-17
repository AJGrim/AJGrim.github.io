(function() {
	'use strict';

	/* ── Entrance: lift curtain on load ─────────── */
	window.addEventListener('load', function() {
		requestAnimationFrame(function() {
			requestAnimationFrame(function() {
				document.getElementById('transition-curtain').classList.add('open');
			});
		});
	});

	/* ── Page exit transition ────────────────────── */
	function navigateWithFade(url) {
		var curtain = document.getElementById('transition-curtain');
		curtain.classList.add('closing');
		setTimeout(function() { window.location.href = url; }, 380);
	}

	document.addEventListener('click', function(e) {
		var link = e.target.closest('a[href]');
		if (!link) return;
		var href = link.getAttribute('href');
		if (!href || href.startsWith('#') || href.startsWith('http') ||
			href.startsWith('mailto') || href.startsWith('tel')) return;
		e.preventDefault();
		navigateWithFade(href);
	});

	/* ── Filter with stagger animation ──────────── */
	var filterBtns = document.querySelectorAll('.filter-btn');
	var allCards   = Array.from(document.querySelectorAll('.flip-card'));
	var countEl    = document.getElementById('filterCount');

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
			if (e.target.classList.contains('details-btn')) return;
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
					openOverlay(card);
				}
			}
		});

		var detailsBtn = card.querySelector('.details-btn');
		if (detailsBtn) {
			detailsBtn.addEventListener('click', function(e) {
				e.stopPropagation();
				openOverlay(card);
			});
		}
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

	/* ── Overlay ─────────────────────────────────── */
	var visibleCards = [];
	var overlayIndex = 0;
	var lastFocused  = null;

	function getVisibleCards() {
		return allCards.filter(function(c) { return !c.classList.contains('hidden'); });
	}

	function populateOverlay(card) {
		var img   = card.getAttribute('data-img')       || '';
		var cat   = card.getAttribute('data-cat-label') || '';
		var title = card.getAttribute('data-title')     || '';
		var prob  = card.getAttribute('data-problem')   || '';
		var appr  = card.getAttribute('data-approach')  || '';
		var tools = card.getAttribute('data-tools')     || '';
		var outc  = card.getAttribute('data-outcome')   || '';
		var tags  = (card.getAttribute('data-tags')     || '').split(',');

		var overlayImg = document.getElementById('overlayImg');
		if (img) {
			overlayImg.src = img;
			overlayImg.alt = title;
			overlayImg.classList.remove('hidden');
		} else {
			overlayImg.classList.add('hidden');
		}

		document.getElementById('overlayCat').textContent      = cat;
		document.getElementById('overlayTitle').textContent    = title;
		document.getElementById('overlayProblem').textContent  = prob;
		document.getElementById('overlayApproach').textContent = appr;
		document.getElementById('overlayTools').textContent    = tools;
		document.getElementById('overlayOutcome').textContent  = outc;

		var tagContainer = document.getElementById('overlayTags');
		tagContainer.innerHTML = '';
		tags.forEach(function(t) {
			if (!t.trim()) return;
			var span = document.createElement('span');
			span.className = 'tag';
			span.textContent = t.trim();
			tagContainer.appendChild(span);
		});

		document.getElementById('overlayPrev').disabled = overlayIndex <= 0;
		document.getElementById('overlayNext').disabled = overlayIndex >= visibleCards.length - 1;

		document.getElementById('overlayCounter').textContent =
			(overlayIndex + 1) + ' / ' + visibleCards.length;

		document.getElementById('overlayPanel').scrollTop = 0;
	}

	function openOverlay(card) {
		visibleCards = getVisibleCards();
		overlayIndex = visibleCards.indexOf(card);
		if (overlayIndex < 0) overlayIndex = 0;

		lastFocused = document.activeElement;
		populateOverlay(card);

		var overlay = document.getElementById('overlay');
		overlay.classList.add('active');
		document.body.style.overflow = 'hidden';

		document.getElementById('overlayCloseBtn').focus();
	}

	function closeOverlay() {
		document.getElementById('overlay').classList.remove('active');
		document.body.style.overflow = '';
		if (lastFocused) lastFocused.focus();
	}

	function navigateOverlay(dir) {
		var next = overlayIndex + dir;
		if (next < 0 || next >= visibleCards.length) return;
		overlayIndex = next;
		populateOverlay(visibleCards[overlayIndex]);
	}

	document.getElementById('overlayCloseBtn').addEventListener('click', closeOverlay);
	document.getElementById('overlayPrev').addEventListener('click', function() { navigateOverlay(-1); });
	document.getElementById('overlayNext').addEventListener('click', function() { navigateOverlay(1); });

	document.getElementById('overlay').addEventListener('click', function(e) {
		if (e.target === this) closeOverlay();
	});

	/* ── Keyboard handling ───────────────────────── */
	document.addEventListener('keydown', function(e) {
		var overlay = document.getElementById('overlay');
		var isOpen  = overlay.classList.contains('active');

		if (isOpen) {
			if (e.key === 'Escape')     { closeOverlay(); }
			if (e.key === 'ArrowLeft')  { navigateOverlay(-1); }
			if (e.key === 'ArrowRight') { navigateOverlay(1); }

			if (e.key === 'Tab') {
				var focusable = overlay.querySelectorAll(
					'button:not(:disabled), [tabindex]:not([tabindex="-1"])'
				);
				var first = focusable[0];
				var last  = focusable[focusable.length - 1];
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		} else {
			if (e.key === 'Escape') {
				allCards.forEach(function(c) { c.classList.remove('flipped'); });
			}
		}
	});

})();
