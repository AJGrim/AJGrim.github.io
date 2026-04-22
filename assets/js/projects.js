(function() {
	'use strict';

	/* ── Project data ────────────────────────────── */
	var PROJECTS = [
		{
			category:    'fluids aerospace',
			title:       'Flow Characterization Study',
			catLabel:    'Fluids \u00b7 Aerospace',
			accent:      'rgba(80,160,255,0.6)',
			icon:        '&#10148;',
			summary:     'Pressure-loss characterization of a complex duct geometry using experimental measurements and analytical modeling.',
			frontTags:   ['Fluid Mechanics', 'MATLAB', 'Experimental'],
			backTitle:   'Flow Characterization Study',
			backProblem: 'Characterize internal flow behavior and quantify pressure losses within a complex duct geometry.',
			bullets:     [
				'Validated pressure-loss correlation developed',
				'CFD boundary condition uncertainty reduced 30%',
				'Tested across multiple Reynolds number regimes'
			],
			backTags:  ['Fluid Mechanics', 'MATLAB', 'Experimental'],
			img:       '',
			problem:   'Characterize internal flow behavior and pressure losses within a complex duct geometry relevant to aerospace inlet design.',
			approach:  'Conducted a combination of experimental pressure-tap measurements and analytical modeling to quantify loss coefficients at key cross-sections under varying Reynolds number conditions.',
			tools:     'Differential pressure transducers, pitot-static probes, MATLAB for data reduction and regression analysis',
			outcome:   'Developed a validated pressure-loss correlation for the test geometry, reducing uncertainty in downstream CFD boundary conditions by 30%.',
			tags:      ['Fluid Mechanics', 'Pressure Loss', 'MATLAB', 'Experimental Testing', 'Reynolds Number'],
		model:     ''
		},
		{
			category:    'thermal',
			title:       'Thermal Management System',
			catLabel:    'Thermal \u00b7 Experimental',
			accent:      'rgba(255,120,60,0.7)',
			icon:        '&#9650;',
			summary:     'Passive heat sink design and experimental validation for an electronics thermal management application under real operating constraints.',
			frontTags:   ['Heat Transfer', 'SolidWorks', 'Thermal Design'],
			backTitle:   'Thermal Management System',
			backProblem: 'Design a passive thermal solution maintaining component temps below 85\u00b0C under real operating loads.',
			bullets:     [
				'40% improvement in heat dissipation over baseline',
				'Junction temp held below 85\u00b0C across all test cases',
				'Two candidate geometries fabricated and compared'
			],
			backTags:  ['Heat Transfer', 'SolidWorks', 'Fin Theory'],
			img:       '',
			problem:   'Design and experimentally evaluate a passive thermal management solution for a heat-generating electronic component under real operating constraints.',
			approach:  'Iterated through multiple heat sink geometries using analytical fin theory before fabricating and testing two candidate designs. Instrumented with thermocouples at critical nodes and logged transient temperature response.',
			tools:     'Thermocouple arrays, data acquisition system, SolidWorks for geometry, analytical fin equations in MATLAB',
			outcome:   'Final design maintained component junction temperature below the 85\u00b0C threshold across all test conditions. Improved heat dissipation rate by 40% over the baseline geometry.',
			tags:      ['Heat Transfer', 'Thermocouple', 'SolidWorks', 'Fin Theory', 'Thermal Design'],
		model:     ''
		},
		{
			category:    'aerospace simulation',
			title:       'Aerodynamic Analysis \u2014 Wing Profile',
			catLabel:    'Aerospace \u00b7 Simulation',
			accent:      'rgba(140,200,120,0.6)',
			icon:        '&#10006;',
			summary:     'CFD and analytical evaluation of airfoil performance at low Reynolds numbers, including lift-drag characterization and pressure distribution mapping.',
			frontTags:   ['CFD', 'Aerodynamics', 'MATLAB'],
			backTitle:   'Aerodynamic Analysis',
			backProblem: 'Quantify lift, drag, and pressure distribution for a candidate airfoil at low Reynolds numbers.',
			bullets:     [
				'Optimal AoA range identified for peak L/D',
				'CFD results validated against published data',
				'Directly informed competition aircraft selection'
			],
			backTags:  ['CFD', 'Aerodynamics', 'Python'],
			img:       '',
			problem:   'Evaluate the aerodynamic performance of a candidate airfoil section for a low-Reynolds-number application, quantifying lift, drag, and pressure distribution.',
			approach:  'Combined analytical thin-airfoil theory with CFD simulation to build confidence in results. Validated against published experimental data before running parametric angle-of-attack sweeps.',
			tools:     'MATLAB for analytical modeling, CFD solver for simulation, Python for post-processing and visualization',
			outcome:   'Identified optimal angle-of-attack operating range yielding peak L/D ratio. Results directly informed airfoil selection for the competition aircraft design.',
			tags:      ['CFD', 'Aerodynamics', 'MATLAB', 'Python', 'Lift-to-Drag', 'Low Reynolds Number'],
		model:     '' // e.g. 'models/airfoil-wing.glb' once exported
		},
		{
			category:    'simulation fluids',
			title:       'Computational Heat Transfer \u2014 FDM',
			catLabel:    'Simulation \u00b7 Thermal',
			accent:      'rgba(200,150,255,0.6)',
			icon:        '&#11035;',
			summary:     'Custom explicit finite-difference solver for 2D transient heat conduction with mixed BCs, mesh convergence study, and Biot number parametrics.',
			frontTags:   ['FDM', 'MATLAB', 'Numerical Methods'],
			backTitle:   'Computational Heat Transfer',
			backProblem: 'Simulate transient 2D conduction with mixed BCs and validate against analytical benchmarks.',
			bullets:     [
				'Mesh convergence confirmed at 50\u00d750 nodes',
				'Critical Biot number threshold identified',
				'Solver repurposed as validation tool for lab experiments'
			],
			backTags:  ['FDM', 'MATLAB', 'Thermal'],
			img:       '',
			problem:   'Simulate 2D transient heat conduction in a solid domain with mixed boundary conditions to validate analytical solutions and explore mesh sensitivity.',
			approach:  'Implemented an explicit finite-difference method in MATLAB. Verified against a known analytical solution on a coarse grid before refining mesh resolution. Parametrically studied the effect of Biot number on temperature distribution.',
			tools:     'MATLAB (custom FDM solver), analytical benchmark solutions for verification',
			outcome:   'Demonstrated mesh convergence at 50\u00d750 nodes. Identified critical Bi threshold above which convective resistance dominates. Solver reused as a validation tool for subsequent thermal experiments.',
			tags:      ['FDM', 'Heat Conduction', 'MATLAB', 'Numerical Methods', 'Mesh Convergence', 'Boundary Conditions'],
		model:     ''
		},
		{
			category:    'aerospace fluids',
			title:       'MS Thesis \u2014 [Your Thesis Title]',
			catLabel:    'Aerospace \u00b7 Research',
			accent:      'rgba(255,210,80,0.6)',
			icon:        '&#8943;',
			summary:     'Master\u2019s thesis research at the University of Delaware. Replace this with your actual thesis title and a one-sentence summary of the work.',
			frontTags:   ['MS Thesis', 'University of Delaware', 'Research'],
			backTitle:   'MS Thesis Research',
			backProblem: '[Replace with your actual thesis problem statement.]',
			bullets:     [
				'[Replace with specific, quantitative findings]',
				'[What did you contribute that wasn\u2019t known before?]',
				'[Any publications, presentations, or industry impact?]'
			],
			backTags:  ['MS Thesis', 'Research', 'Aerospace'],
			img:       '',
			problem:   '[Replace with your actual thesis problem statement \u2014 what gap in knowledge or engineering challenge were you addressing?]',
			approach:  '[Describe your methodology \u2014 experimental, computational, analytical, or a combination. What made your approach defensible?]',
			tools:     '[List the specific tools, software, and equipment central to your work]',
			outcome:   '[State your key findings and contributions \u2014 be as specific and quantitative as possible]',
			tags:      ['MS Thesis', 'University of Delaware', 'Aerospace', 'Research'],
		model:     ''
		},
		{
			category:    'fluids simulation',
			title:       'System Pressure Loss Analysis',
			catLabel:    'Fluids \u00b7 Analysis',
			accent:      'rgba(80,200,200,0.6)',
			icon:        '&#10143;',
			summary:     'Analytical and experimental characterization of pressure losses through a multi-fitting piping system, with design recommendations for loss reduction.',
			frontTags:   ['Pipe Flow', 'MATLAB', 'System Design'],
			backTitle:   'System Pressure Loss Analysis',
			backProblem: 'Predict and validate total pressure loss to support piping system design decisions.',
			bullets:     [
				'Model agreed with measured data to within 8%',
				'Dominant loss contributors identified',
				'Geometry change reduced pressure drop 22%'
			],
			backTags:  ['Pipe Flow', 'MATLAB', 'Experimental'],
			img:       '',
			problem:   'Predict and validate total pressure loss through a piping system with multiple fittings, bends, and area changes to support system design decisions.',
			approach:  'Applied minor and major loss correlations analytically, then cross-checked against experimental measurements at representative flow conditions. Identified dominant loss contributors and sensitivity to flow rate.',
			tools:     'MATLAB for system modeling, pressure gauges and flow meters for experimental validation',
			outcome:   'Analytical model agreed with measured data to within 8%. Identified two elbows as the primary loss contributors, informing a geometry change that reduced total system pressure drop by 22%.',
			tags:      ['Pipe Flow', 'Pressure Loss', 'System Design', 'MATLAB', 'Experimental Validation'],
		model:     ''
		}
	];

	/* ── Card renderer ───────────────────────────── */
	function buildCard(p) {
		function tagSpans(arr) {
			return arr.map(function(t) { return '<span class="tag">' + t + '</span>'; }).join('');
		}
		var bullets = p.bullets.map(function(b) { return '<li>' + b + '</li>'; }).join('');
		return (
			'<div class="flip-card" role="listitem" tabindex="0"' +
			' data-category="'  + p.category          + '"' +
			' data-title="'     + p.title             + '"' +
			' data-cat-label="' + p.catLabel          + '"' +
			' data-img="'       + p.img               + '"' +
			' data-problem="'   + p.problem           + '"' +
			' data-approach="'  + p.approach          + '"' +
			' data-tools="'     + p.tools             + '"' +
			' data-outcome="'   + p.outcome           + '"' +
			' data-tags="'      + p.tags.join(',')    + '"' +
			' data-model="'     + (p.model || '')     + '">' +
			'<div class="flip-card-inner">' +
				'<div class="card-front">' +
					'<div class="card-image placeholder" style="--accent: ' + p.accent + '">' +
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
					'<div class="back-header"><h3 class="back-title">' + p.backTitle + '</h3></div>' +
					'<div class="back-divider"></div>' +
					'<div class="back-section">' +
						'<p class="back-section-label">Problem</p>' +
						'<p>' + p.backProblem + '</p>' +
					'</div>' +
					'<div class="back-section">' +
						'<p class="back-section-label">Key Results</p>' +
						'<ul>' + bullets + '</ul>' +
					'</div>' +
					'<div class="back-footer">' +
						'<div class="back-tags">' + tagSpans(p.backTags) + '</div>' +
						'<button class="details-btn" aria-label="View full details for ' + p.backTitle + '">Full Details &rarr;</button>' +
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
		var model = card.getAttribute('data-model')     || '';

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

		var modelWrap = document.getElementById('overlayModelWrap');
		var modelBtn  = document.getElementById('overlayModelBtn');
		if (model) {
			modelBtn.href = 'viewer-demo.html?model=' + encodeURIComponent(model) +
			                '&title=' + encodeURIComponent(title);
			modelWrap.classList.remove('hidden');
		} else {
			modelWrap.classList.add('hidden');
		}

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
