import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';

// ---------------------------------------------------------------------------
// Assembly Viewer
//
// Usage via URL:
//   viewer-demo.html?model=models/airfoil.glb&title=Airfoil+Analysis
//
//   ?model  — path to a .glb / .gltf file (relative to site root)
//   ?title  — project title shown in the top bar
//   ?demo=1 — loads placeholder geometry for testing without a real model
//
// GLTF export tip: name your components in CAD before exporting.
// Each top-level child of the GLTF scene becomes one "part" in the viewer.
// Explode directions are auto-computed from each part's centroid.
// ---------------------------------------------------------------------------

// ── Placeholder assembly (loaded only when ?demo=1) ─────────────────────────
const DEMO_PARTS = [
	{ id: 'base-plate',    label: 'Base Plate',       color: 0x3a7fd4, pos: [0,-1.0,0],     explode: [0,-2.2,0],     buildGeo: () => new THREE.BoxGeometry(3.5,0.16,2.3) },
	{ id: 'top-cover',     label: 'Top Cover',         color: 0x7040c0, pos: [0,1.0,0],      explode: [0,2.2,0],      buildGeo: () => new THREE.BoxGeometry(3.5,0.16,2.3) },
	{ id: 'left-wall',     label: 'Left Side Wall',    color: 0xcc541a, pos: [-1.67,0,0],    explode: [-2.6,0,0],     buildGeo: () => new THREE.BoxGeometry(0.16,1.84,2.3) },
	{ id: 'right-wall',    label: 'Right Side Wall',   color: 0xcc541a, pos: [1.67,0,0],     explode: [2.6,0,0],      buildGeo: () => new THREE.BoxGeometry(0.16,1.84,2.3) },
	{ id: 'front-cap',     label: 'Front End Cap',     color: 0x3aaa50, pos: [0,0,1.07],     explode: [0,0,2.4],      buildGeo: () => new THREE.BoxGeometry(3.18,1.84,0.16) },
	{ id: 'rear-cap',      label: 'Rear End Cap',      color: 0x3aaa50, pos: [0,0,-1.07],    explode: [0,0,-2.4],     buildGeo: () => new THREE.BoxGeometry(3.18,1.84,0.16) },
	{ id: 'center-column', label: 'Center Column',     color: 0xd4a820, pos: [0,0,0],        explode: [0,0,0],        buildGeo: () => new THREE.CylinderGeometry(0.22,0.22,1.68,32) },
	{ id: 'fastener-a',    label: 'Fastener A',        color: 0x40b8b8, pos: [-1.2,0,-0.78], explode: [-2.2,1.8,-1.6],buildGeo: () => new THREE.CylinderGeometry(0.065,0.065,0.95,12) },
	{ id: 'fastener-b',    label: 'Fastener B',        color: 0x40b8b8, pos: [1.2,0,-0.78],  explode: [2.2,1.8,-1.6], buildGeo: () => new THREE.CylinderGeometry(0.065,0.065,0.95,12) },
	{ id: 'fastener-c',    label: 'Fastener C',        color: 0x40b8b8, pos: [-1.2,0,0.78],  explode: [-2.2,1.8,1.6], buildGeo: () => new THREE.CylinderGeometry(0.065,0.065,0.95,12) },
	{ id: 'fastener-d',    label: 'Fastener D',        color: 0x40b8b8, pos: [1.2,0,0.78],   explode: [2.2,1.8,1.6],  buildGeo: () => new THREE.CylinderGeometry(0.065,0.065,0.95,12) },
];

// ── Module state ─────────────────────────────────────────────────────────────
let scene, camera, renderer, controls;
let explodeFactor = 0;
let explodeTarget = 0;
let selectedId    = null;
let partDefs      = []; // { id, label, group, meshes, homePos, explodeVec }
const raycaster   = new THREE.Raycaster();
const mouse       = new THREE.Vector2();

// ── State UI ─────────────────────────────────────────────────────────────────
function showState(state) {
	// state: 'empty' | 'loading' | 'error' | 'ready'
	document.getElementById('viewer-empty').classList.toggle('hidden',   state !== 'empty');
	document.getElementById('viewer-loading').classList.toggle('hidden', state !== 'loading');
	document.getElementById('viewer-error').classList.toggle('hidden',   state !== 'error');
	document.getElementById('viewer-controls').classList.toggle('hidden',state !== 'ready');
	document.getElementById('parts-panel').classList.toggle('hidden',    state !== 'ready');
}

function setLoadingProgress(pct) {
	document.getElementById('viewer-loading-text').textContent =
		pct < 100 ? ('Loading model\u2026 ' + pct + '%') : 'Processing\u2026';
}

function showError(message) {
	document.getElementById('viewer-error-text').textContent = message;
	showState('error');
}

// ── Scene setup ──────────────────────────────────────────────────────────────
function buildScene(mountId) {
	const mount = document.getElementById(mountId);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x1b1f22);
	scene.fog = new THREE.FogExp2(0x1b1f22, 0.04);

	camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
	camera.position.set(5.5, 3.5, 6.5);

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(mount.clientWidth, mount.clientHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	mount.appendChild(renderer.domElement);

	scene.add(new THREE.AmbientLight(0xffffff, 0.55));

	const key = new THREE.DirectionalLight(0xffffff, 1.1);
	key.position.set(5, 9, 6);
	key.castShadow = true;
	key.shadow.mapSize.set(1024, 1024);
	Object.assign(key.shadow.camera, { near: 0.5, far: 30, left: -8, right: 8, top: 8, bottom: -8 });
	scene.add(key);

	const fill = new THREE.DirectionalLight(0x4060cc, 0.35);
	fill.position.set(-4, -3, -4);
	scene.add(fill);

	const grid = new THREE.GridHelper(14, 28, 0x2a2d30, 0x222527);
	grid.position.y = -1.55;
	scene.add(grid);

	controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.07;
	controls.minDistance = 2;
	controls.maxDistance = 22;
	controls.update();

	window.addEventListener('resize', () => {
		const w = mount.clientWidth, h = mount.clientHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	});
}

// ── Load a GLTF model ────────────────────────────────────────────────────────
function loadGLTF(url) {
	return new Promise((resolve, reject) => {
		new GLTFLoader().load(url, resolve, xhr => {
			if (xhr.total) setLoadingProgress((xhr.loaded / xhr.total * 100) | 0);
		}, reject);
	});
}

// ── Decompose a GLTF scene into parts ───────────────────────────────────────
function decomposeToParts(gltfScene) {
	// Center the model
	const modelBox = new THREE.Box3().setFromObject(gltfScene);
	const center = modelBox.getCenter(new THREE.Vector3());
	gltfScene.position.sub(center);

	// If the scene has a single wrapper group, unwrap it
	let root = gltfScene;
	if (root.children.length === 1 && root.children[0].children.length > 0) {
		root = root.children[0];
	}

	const explodeMag = modelBox.getSize(new THREE.Vector3()).length() * 0.45;

	const parts = [];
	root.children.forEach((child, i) => {
		// Clone materials so we can modify them independently
		const meshes = [];
		child.traverse(node => {
			if (!node.isMesh) return;
			node.material = Array.isArray(node.material)
				? node.material.map(m => m.clone())
				: node.material.clone();
			node.castShadow = true;
			node.receiveShadow = true;
			meshes.push(node);
		});
		if (meshes.length === 0) return;

		// Auto-explode direction: from model center → part centroid
		const partBox = new THREE.Box3().setFromObject(child);
		const partCenter = partBox.getCenter(new THREE.Vector3());

		let explodeVec;
		if (partCenter.length() < explodeMag * 0.05) {
			explodeVec = new THREE.Vector3(0, explodeMag * 0.35, 0);
		} else {
			explodeVec = partCenter.clone().normalize().multiplyScalar(explodeMag);
		}

		parts.push({
			id:         child.name || ('part-' + i),
			label:      child.name || ('Part ' + (i + 1)),
			group:      child,
			meshes,
			homePos:    child.position.clone(),
			explodeVec,
		});
	});

	scene.add(gltfScene);
	return parts;
}

// ── Build parts from placeholder geometry (demo mode) ───────────────────────
function buildDemoParts() {
	return DEMO_PARTS.map(def => {
		const mat  = new THREE.MeshPhongMaterial({ color: def.color, shininess: 55, specular: new THREE.Color(0x222222) });
		const mesh = new THREE.Mesh(def.buildGeo(), mat);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		const group = new THREE.Group();
		group.add(mesh);
		group.position.set(...def.pos);
		scene.add(group);

		const explodeVec = new THREE.Vector3(...def.explode);

		return {
			id:         def.id,
			label:      def.label,
			group,
			meshes:     [mesh],
			homePos:    group.position.clone(),
			explodeVec,
		};
	});
}

// ── Activate loaded parts: register state, build UI ─────────────────────────
function activateParts(parts) {
	partDefs = parts;
	buildPartsUI();
	showState('ready');
}

// ── Parts list UI ─────────────────────────────────────────────────────────────
function buildPartsUI() {
	const ul = document.getElementById('parts-ul');
	ul.innerHTML = '';
	partDefs.forEach(part => {
		const li  = document.createElement('li');
		li.dataset.partId = part.id;

		// Infer a colour from the first mesh material, if available
		const firstMesh = part.meshes[0];
		let dotColor = '#888888';
		if (firstMesh && firstMesh.material) {
			const mat = Array.isArray(firstMesh.material) ? firstMesh.material[0] : firstMesh.material;
			if (mat.color) dotColor = '#' + mat.color.getHexString();
		}

		const dot = document.createElement('span');
		dot.className = 'parts-dot';
		dot.style.background = dotColor;

		li.appendChild(dot);
		li.appendChild(document.createTextNode(part.label));
		li.addEventListener('click', () => selectedId === part.id ? clearSelection() : selectPart(part.id));
		ul.appendChild(li);
	});
}

// ── Selection ─────────────────────────────────────────────────────────────────
function selectPart(id) {
	selectedId = id;
	partDefs.forEach(part => {
		const isSelected = part.id === id;
		part.meshes.forEach(m => {
			const mats = Array.isArray(m.material) ? m.material : [m.material];
			mats.forEach(mat => {
				mat.transparent = !isSelected;
				mat.opacity     = isSelected ? 1.0 : 0.15;
				if (mat.emissive) mat.emissive.setHex(isSelected ? 0x2a2a2a : 0x000000);
			});
		});
	});

	const part = partDefs.find(p => p.id === id);
	const label = document.getElementById('part-label');
	if (part) { label.textContent = part.label; label.classList.remove('hidden'); }

	document.querySelectorAll('#parts-ul li').forEach(li => {
		li.classList.toggle('active', li.dataset.partId === id);
	});
}

function clearSelection() {
	selectedId = null;
	partDefs.forEach(part => {
		part.meshes.forEach(m => {
			const mats = Array.isArray(m.material) ? m.material : [m.material];
			mats.forEach(mat => {
				mat.transparent = false;
				mat.opacity     = 1.0;
				if (mat.emissive) mat.emissive.setHex(0x000000);
			});
		});
	});
	document.getElementById('part-label').classList.add('hidden');
	document.querySelectorAll('#parts-ul li').forEach(li => li.classList.remove('active'));
}

// ── Raycaster click (ignore orbit drags) ─────────────────────────────────────
let mouseDownXY = null;
function attachClickHandler() {
	renderer.domElement.addEventListener('mousedown', e => {
		mouseDownXY = { x: e.clientX, y: e.clientY };
	});
	renderer.domElement.addEventListener('mouseup', e => {
		if (!mouseDownXY) return;
		const dx = Math.abs(e.clientX - mouseDownXY.x);
		const dy = Math.abs(e.clientY - mouseDownXY.y);
		mouseDownXY = null;
		if (dx > 5 || dy > 5) return;

		const rect = renderer.domElement.getBoundingClientRect();
		mouse.x = ((e.clientX - rect.left) / rect.width)  *  2 - 1;
		mouse.y = ((e.clientY - rect.top)  / rect.height) * -2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const allMeshes = partDefs.flatMap(p => p.meshes);
		const hits = raycaster.intersectObjects(allMeshes, false);

		if (hits.length === 0) { clearSelection(); return; }

		// Walk up to find the part that owns this mesh
		const hitMesh = hits[0].object;
		const ownerPart = partDefs.find(p => p.meshes.includes(hitMesh));
		if (!ownerPart) return;
		ownerPart.id === selectedId ? clearSelection() : selectPart(ownerPart.id);
	});
}

// ── Render / explode loop ─────────────────────────────────────────────────────
function startRenderLoop() {
	function animate() {
		requestAnimationFrame(animate);
		explodeFactor += (explodeTarget - explodeFactor) * 0.08;

		partDefs.forEach(part => {
			const h = part.homePos;
			const v = part.explodeVec;
			const t = explodeFactor;
			part.group.position.set(
				h.x + v.x * t,
				h.y + v.y * t,
				h.z + v.z * t
			);
		});

		controls.update();
		renderer.render(scene, camera);
	}
	animate();
}

// ── Wire up controls UI ───────────────────────────────────────────────────────
function wireControls() {
	const slider   = document.getElementById('explode-slider');
	const pctLabel = document.getElementById('explode-pct');

	slider.addEventListener('input', () => {
		explodeTarget = slider.value / 100;
		pctLabel.textContent = slider.value + '%';
	});

	document.getElementById('btn-assemble').addEventListener('click', () => {
		explodeTarget = 0; slider.value = 0; pctLabel.textContent = '0%';
	});
	document.getElementById('btn-explode').addEventListener('click', () => {
		explodeTarget = 1; slider.value = 100; pctLabel.textContent = '100%';
	});
	document.getElementById('btn-reset-view').addEventListener('click', () => {
		camera.position.set(5.5, 3.5, 6.5);
		controls.target.set(0, 0, 0);
		controls.update();
	});
}

// ── Entry point ───────────────────────────────────────────────────────────────
async function initViewer(mountId) {
	buildScene(mountId);
	wireControls();
	attachClickHandler();
	startRenderLoop();

	const params = new URLSearchParams(window.location.search);
	const modelUrl = params.get('model');
	const title    = params.get('title');
	const isDemo   = params.get('demo') === '1';

	// Update topbar text
	if (title) {
		document.getElementById('viewer-title-text').textContent = title;
		document.getElementById('viewer-title-sub').textContent  = '3D Model';
		document.title = title + ' \u2014 Assembly Viewer | Adam Grim';
	}

	if (isDemo) {
		document.getElementById('viewer-title-text').textContent = 'Demo Assembly';
		document.getElementById('viewer-title-sub').textContent  = 'Placeholder geometry';
		activateParts(buildDemoParts());
		return;
	}

	if (!modelUrl) {
		showState('empty');
		return;
	}

	showState('loading');
	try {
		const gltf  = await loadGLTF(modelUrl);
		const parts = decomposeToParts(gltf.scene);
		if (parts.length === 0) throw new Error('No mesh parts found in this model.');
		activateParts(parts);
	} catch (err) {
		const msg = (err && err.message) ? err.message : String(err);
		showError('Could not load \u201c' + modelUrl + '\u201d. ' + msg);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	initViewer('viewer-canvas-mount');
});
