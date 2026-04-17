import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------------------------------------------------------------------------
// Placeholder assembly — a simplified mechanical enclosure with 10 named parts.
// When you have a real model, replace this with a GLTFLoader approach:
//   loader.load('model.glb', gltf => { scene.add(gltf.scene); ... })
// Part nodes in the GLTF are identified by mesh.name, and you supply explodeDir
// per-name in the config object passed to initViewer().
// ---------------------------------------------------------------------------

const ASSEMBLY = [
	{
		id: 'base-plate',
		label: 'Base Plate',
		color: 0x3a7fd4,
		pos: [0, -1.0, 0],
		explode: [0, -2.2, 0],
		buildGeo() { return new THREE.BoxGeometry(3.5, 0.16, 2.3); },
	},
	{
		id: 'top-cover',
		label: 'Top Cover',
		color: 0x7040c0,
		pos: [0, 1.0, 0],
		explode: [0, 2.2, 0],
		buildGeo() { return new THREE.BoxGeometry(3.5, 0.16, 2.3); },
	},
	{
		id: 'left-wall',
		label: 'Left Side Wall',
		color: 0xcc541a,
		pos: [-1.67, 0, 0],
		explode: [-2.6, 0, 0],
		buildGeo() { return new THREE.BoxGeometry(0.16, 1.84, 2.3); },
	},
	{
		id: 'right-wall',
		label: 'Right Side Wall',
		color: 0xcc541a,
		pos: [1.67, 0, 0],
		explode: [2.6, 0, 0],
		buildGeo() { return new THREE.BoxGeometry(0.16, 1.84, 2.3); },
	},
	{
		id: 'front-cap',
		label: 'Front End Cap',
		color: 0x3aaa50,
		pos: [0, 0, 1.07],
		explode: [0, 0, 2.4],
		buildGeo() { return new THREE.BoxGeometry(3.18, 1.84, 0.16); },
	},
	{
		id: 'rear-cap',
		label: 'Rear End Cap',
		color: 0x3aaa50,
		pos: [0, 0, -1.07],
		explode: [0, 0, -2.4],
		buildGeo() { return new THREE.BoxGeometry(3.18, 1.84, 0.16); },
	},
	{
		id: 'center-column',
		label: 'Center Column',
		color: 0xd4a820,
		pos: [0, 0, 0],
		explode: [0, 0, 0],
		buildGeo() { return new THREE.CylinderGeometry(0.22, 0.22, 1.68, 32); },
	},
	{
		id: 'fastener-a',
		label: 'Fastener A',
		color: 0x40b8b8,
		pos: [-1.2, 0, -0.78],
		explode: [-2.2, 1.8, -1.6],
		buildGeo() { return new THREE.CylinderGeometry(0.065, 0.065, 0.95, 12); },
	},
	{
		id: 'fastener-b',
		label: 'Fastener B',
		color: 0x40b8b8,
		pos: [1.2, 0, -0.78],
		explode: [2.2, 1.8, -1.6],
		buildGeo() { return new THREE.CylinderGeometry(0.065, 0.065, 0.95, 12); },
	},
	{
		id: 'fastener-c',
		label: 'Fastener C',
		color: 0x40b8b8,
		pos: [-1.2, 0, 0.78],
		explode: [-2.2, 1.8, 1.6],
		buildGeo() { return new THREE.CylinderGeometry(0.065, 0.065, 0.95, 12); },
	},
	{
		id: 'fastener-d',
		label: 'Fastener D',
		color: 0x40b8b8,
		pos: [1.2, 0, 0.78],
		explode: [2.2, 1.8, 1.6],
		buildGeo() { return new THREE.CylinderGeometry(0.065, 0.065, 0.95, 12); },
	},
];

// ---------------------------------------------------------------------------

function initViewer(mountId) {
	const mount = document.getElementById(mountId);
	if (!mount) return;

	// ── Scene ────────────────────────────────────
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x1b1f22);
	scene.fog = new THREE.FogExp2(0x1b1f22, 0.04);

	// ── Camera ───────────────────────────────────
	const camera = new THREE.PerspectiveCamera(
		45,
		mount.clientWidth / mount.clientHeight,
		0.1,
		100
	);
	camera.position.set(5.5, 3.5, 6.5);

	// ── Renderer ─────────────────────────────────
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(mount.clientWidth, mount.clientHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	mount.appendChild(renderer.domElement);

	// ── Lighting ─────────────────────────────────
	scene.add(new THREE.AmbientLight(0xffffff, 0.55));

	const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
	keyLight.position.set(5, 9, 6);
	keyLight.castShadow = true;
	keyLight.shadow.mapSize.set(1024, 1024);
	keyLight.shadow.camera.near = 0.5;
	keyLight.shadow.camera.far = 30;
	keyLight.shadow.camera.left = -8;
	keyLight.shadow.camera.right = 8;
	keyLight.shadow.camera.top = 8;
	keyLight.shadow.camera.bottom = -8;
	scene.add(keyLight);

	// Cool fill from below-front
	const fillLight = new THREE.DirectionalLight(0x4060cc, 0.35);
	fillLight.position.set(-4, -3, -4);
	scene.add(fillLight);

	// ── Floor grid ───────────────────────────────
	const grid = new THREE.GridHelper(14, 28, 0x2a2d30, 0x222527);
	grid.position.y = -1.55;
	scene.add(grid);

	// ── Build meshes ─────────────────────────────
	const meshes = [];

	ASSEMBLY.forEach(part => {
		const geo = part.buildGeo();
		const mat = new THREE.MeshPhongMaterial({
			color: part.color,
			shininess: 55,
			specular: new THREE.Color(0x222222),
		});
		const mesh = new THREE.Mesh(geo, mat);
		mesh.position.set(...part.pos);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		mesh.userData = {
			id: part.id,
			label: part.label,
			baseColor: part.color,
			homePos: [...part.pos],
			explodePos: part.pos.map((v, i) => v + part.explode[i]),
		};
		scene.add(mesh);
		meshes.push(mesh);
	});

	// ── Orbit controls ───────────────────────────
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.07;
	controls.minDistance = 2;
	controls.maxDistance = 22;
	controls.target.set(0, 0, 0);
	controls.update();

	// ── State ─────────────────────────────────────
	let explodeFactor = 0;
	let explodeTarget = 0;
	let selectedId = null;

	// ── DOM refs ─────────────────────────────────
	const slider    = document.getElementById('explode-slider');
	const pctLabel  = document.getElementById('explode-pct');
	const partLabel = document.getElementById('part-label');
	const partsUl   = document.getElementById('parts-ul');
	const btnAssemble   = document.getElementById('btn-assemble');
	const btnExplode    = document.getElementById('btn-explode');
	const btnResetView  = document.getElementById('btn-reset-view');

	// ── Build parts list ─────────────────────────
	ASSEMBLY.forEach(part => {
		const li  = document.createElement('li');
		li.dataset.partId = part.id;

		const dot = document.createElement('span');
		dot.className = 'parts-dot';
		dot.style.background = '#' + part.color.toString(16).padStart(6, '0');

		li.appendChild(dot);
		li.appendChild(document.createTextNode(part.label));
		li.addEventListener('click', () => {
			if (selectedId === part.id) {
				clearSelection();
			} else {
				selectPart(part.id);
			}
		});
		partsUl.appendChild(li);
	});

	// ── Selection ────────────────────────────────
	function selectPart(id) {
		selectedId = id;
		meshes.forEach(m => {
			if (m.userData.id === id) {
				m.material.emissive.setHex(0x383838);
				m.material.transparent = false;
				m.material.opacity = 1;
			} else {
				m.material.emissive.setHex(0x000000);
				m.material.transparent = true;
				m.material.opacity = 0.2;
			}
		});
		const part = ASSEMBLY.find(p => p.id === id);
		if (part) {
			partLabel.textContent = part.label;
			partLabel.classList.remove('hidden');
		}
		partsUl.querySelectorAll('li').forEach(li => {
			li.classList.toggle('active', li.dataset.partId === id);
		});
	}

	function clearSelection() {
		selectedId = null;
		meshes.forEach(m => {
			m.material.emissive.setHex(0x000000);
			m.material.transparent = false;
			m.material.opacity = 1;
		});
		partLabel.classList.add('hidden');
		partsUl.querySelectorAll('li').forEach(li => li.classList.remove('active'));
	}

	// ── Raycaster / click ────────────────────────
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();
	let mouseDownPos = { x: 0, y: 0 };

	renderer.domElement.addEventListener('mousedown', e => {
		mouseDownPos = { x: e.clientX, y: e.clientY };
	});

	renderer.domElement.addEventListener('mouseup', e => {
		// Only treat as a click if mouse didn't move much (not an orbit drag)
		const dx = Math.abs(e.clientX - mouseDownPos.x);
		const dy = Math.abs(e.clientY - mouseDownPos.y);
		if (dx > 5 || dy > 5) return;

		const rect = renderer.domElement.getBoundingClientRect();
		mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const hits = raycaster.intersectObjects(meshes);

		if (hits.length > 0) {
			const id = hits[0].object.userData.id;
			if (id === selectedId) {
				clearSelection();
			} else {
				selectPart(id);
			}
		} else {
			clearSelection();
		}
	});

	// ── UI controls ──────────────────────────────
	slider.addEventListener('input', () => {
		explodeTarget = slider.value / 100;
		pctLabel.textContent = slider.value + '%';
	});

	btnAssemble.addEventListener('click', () => {
		explodeTarget = 0;
		slider.value = 0;
		pctLabel.textContent = '0%';
	});

	btnExplode.addEventListener('click', () => {
		explodeTarget = 1;
		slider.value = 100;
		pctLabel.textContent = '100%';
	});

	btnResetView.addEventListener('click', () => {
		camera.position.set(5.5, 3.5, 6.5);
		controls.target.set(0, 0, 0);
		controls.update();
	});

	// ── Resize ───────────────────────────────────
	window.addEventListener('resize', () => {
		const w = mount.clientWidth;
		const h = mount.clientHeight;
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		renderer.setSize(w, h);
	});

	// ── Render loop ──────────────────────────────
	function animate() {
		requestAnimationFrame(animate);

		// Ease toward slider target
		explodeFactor += (explodeTarget - explodeFactor) * 0.08;

		// Move each part between home and exploded position
		meshes.forEach(mesh => {
			const h = mesh.userData.homePos;
			const e = mesh.userData.explodePos;
			const t = explodeFactor;
			mesh.position.set(
				h[0] + (e[0] - h[0]) * t,
				h[1] + (e[1] - h[1]) * t,
				h[2] + (e[2] - h[2]) * t
			);
		});

		controls.update();
		renderer.render(scene, camera);
	}
	animate();
}

document.addEventListener('DOMContentLoaded', () => {
	initViewer('viewer-canvas-mount');
});
