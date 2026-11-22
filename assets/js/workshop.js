import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('workshop-canvas');
const status = document.getElementById('workshop-status');
const links = [...document.querySelectorAll('[data-station]')];
const panels = [...document.querySelectorAll('.content-panel')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const home = document.body.dataset.home;
const initialPath = location.pathname;
const pageType = document.body.dataset.page;
const welcome = document.getElementById('welcome');
const aliases = { skills: 'library', experiences: 'workbench', projects: 'workbench', education: 'research', 'recent-posts': 'library' };
const suspendedFrames = new Map();
let focusStation = () => {};
let lastTrigger = null;

function suspendPostMedia() {
    const post = document.getElementById('post-panel');
    if (!post || post.hidden) return;
    for (const video of post.querySelectorAll('video')) video.pause();
    for (const frame of post.querySelectorAll('iframe')) {
        const placeholder = document.createComment('Embedded content');
        suspendedFrames.set(placeholder, frame);
        frame.replaceWith(placeholder);
    }
}

function selectStation(name, updateHistory = true, moveFocus = true) {
    const panel = document.getElementById(`${name}-panel`);
    if (!panel) return;
    if (name !== 'post') suspendPostMedia();
    else {
        for (const [placeholder, frame] of suspendedFrames) placeholder.replaceWith(frame);
        suspendedFrames.clear();
    }
    for (const item of links) {
        if (item.dataset.station === name) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
    }
    for (const item of panels) item.hidden = item !== panel;
    welcome.hidden = true;
    panel.scrollTop = 0;
    if (updateHistory) history.pushState(null, '', `${home}#${name}-panel`);
    if (name !== 'post') focusStation(name);
    if (moveFocus) panel.focus({ preventScroll: true });
}

for (const link of links) {
    link.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        lastTrigger = link;
        selectStation(link.dataset.station);
    });
}
function closePanel(updateHistory = true) {
    suspendPostMedia();
    for (const panel of panels) panel.hidden = true;
    for (const link of links) link.removeAttribute('aria-current');
    welcome.hidden = false;
    if (updateHistory) history.pushState(null, '', home);
    focusStation(null);
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
}
for (const button of document.querySelectorAll('.panel-close')) button.addEventListener('click', () => closePanel());
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panels.some(panel => !panel.hidden)) closePanel();
});
function route() {
    const hash = location.hash.slice(1).replace(/-panel$/, '');
    const name = aliases[hash] || hash;
    if (document.getElementById(`${name}-panel`) && name !== 'post') selectStation(name, false, false);
    else if (location.pathname === initialPath && pageType === 'post') {
        if (document.getElementById('post-panel').hidden) selectStation('post', false, false);
    }
    else if (location.pathname === initialPath && pageType === 'library') selectStation('library', false, false);
    else if (location.pathname === home && !hash) closePanel(false);
    else if (location.pathname !== home && location.pathname !== initialPath) location.reload();
}
window.addEventListener('popstate', () => {
    route();
});
document.body.classList.add('app-ready');
for (const panel of panels) panel.hidden = true;
route();
status.textContent = 'Loading the workshop…';

try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-7, 7, 5, -5, 0.1, 100);
    const overview = new THREE.Vector3(9, 8, 12);
    camera.position.copy(overview);
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 1.1, 0);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minAzimuthAngle = -Math.PI / 2.8;
    controls.maxAzimuthAngle = Math.PI / 2.8;
    controls.update();

    scene.add(new THREE.HemisphereLight(0xe4f3d9, 0x4b513b, 2.1));
    const sun = new THREE.DirectionalLight(0xffe6bb, 3.2);
    sun.position.set(-4, 10, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    sun.shadow.normalBias = 0.03;
    scene.add(sun);

    const materials = {};
    function material(color, extra = {}) {
        const key = `${color}-${JSON.stringify(extra)}`;
        if (!materials[key]) materials[key] = new THREE.MeshStandardMaterial({ color, roughness: 0.8, ...extra });
        return materials[key];
    }
    function box(parent, size, position, color, extra) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, extra));
        mesh.position.set(...position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
    }
    function cylinder(parent, radiusTop, radiusBottom, height, position, color, segments = 12) {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material(color));
        mesh.position.set(...position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
    }
    function screen(parent, width, height, position, title, subtitle, background, accent) {
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = 512;
        textureCanvas.height = 320;
        const ctx = textureCanvas.getContext('2d');
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, 512, 320);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 4;
        ctx.strokeRect(22, 22, 468, 276);
        ctx.fillStyle = accent;
        ctx.font = 'bold 43px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(title, 256, 150);
        ctx.font = '20px monospace';
        ctx.fillText(subtitle, 256, 200);
        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture }));
        mesh.position.set(...position);
        parent.add(mesh);
    }

    // The room is made from simple geometry so the prototype has no external model assets.
    box(scene, [10.5, 0.35, 6.8], [0, -0.22, 0], 0x8b7257);
    box(scene, [10.5, 0.12, 6.8], [0, 0, 0], 0xb19a74);
    for (let x = -4.8; x <= 4.8; x += 0.8) {
        box(scene, [0.018, 0.008, 6.7], [x, 0.066, 0], 0x8e795c);
    }
    box(scene, [10.5, 4.7, 0.22], [0, 2.35, -3.3], 0x657961);
    box(scene, [10.5, 0.18, 0.3], [0, 0.16, -3.16], 0x405644);
    box(scene, [10.5, 0.18, 0.3], [0, 4.65, -3.16], 0x405644);

    const stations = {};
    function station(name, x, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);
        scene.add(group);
        stations[name] = group;
        return group;
    }

    // Window and wall decorations.
    box(scene, [2.5, 2.05, 0.12], [0, 3.05, -3.12], 0xd8c6a0);
    box(scene, [2.27, 1.82, 0.08], [0, 3.05, -3.03], 0xa9d0c0, { emissive: 0x3b675b, emissiveIntensity: 0.3 });
    box(scene, [0.09, 1.85, 0.1], [0, 3.05, -2.96], 0xe9d5af);
    box(scene, [2.3, 0.09, 0.1], [0, 3.05, -2.96], 0xe9d5af);
    const profile = station('profile', -3.35, -3.13);
    box(profile, [1.35, 1.05, 0.1], [0, 3.35, 0], 0x344c3e);
    box(profile, [1.13, 0.83, 0.08], [0, 3.35, 0.09], 0xd9bd86);
    box(profile, [0.65, 0.07, 0.08], [0, 3.48, 0.15], 0x6a8064);
    box(profile, [0.4, 0.07, 0.08], [-0.1, 3.25, 0.15], 0x6a8064);
    const library = station('library', 3.4, -2.95);
    box(library, [1.35, 0.12, 0.45], [0, 3.65, 0], 0xcaa875);
    for (let i = 0; i < 5; i++) box(library, [0.16, 0.48 + i * 0.04, 0.25], [-0.45 + i * 0.22, 3.96 + i * 0.02, 0.04], [0xd58a6f, 0xe1c38f, 0x86a688, 0xc7d2ab, 0xb66e55][i]);
    function table(group, width, depth) {
        box(group, [width, 0.18, depth], [0, 1.28, 0], 0xc79c69);
        for (const x of [-width / 2 + 0.16, width / 2 - 0.16]) {
            for (const z of [-depth / 2 + 0.16, depth / 2 - 0.16]) box(group, [0.16, 1.22, 0.16], [x, 0.65, z], 0x785943);
        }
    }

    const bench = station('workbench', -3.15);
    table(bench, 2.35, 1.5);
    box(bench, [1.35, 0.85, 0.15], [0, 2.03, -0.28], 0x303d34);
    screen(bench, 1.18, 0.68, [0, 2.04, -0.195], '< / >', 'BUILD SOMETHING', '#2c443a', '#d2ea9c');
    box(bench, [0.14, 0.25, 0.14], [0, 1.48, -0.28], 0x303d34);
    box(bench, [0.8, 0.07, 0.32], [0, 1.4, 0.42], 0xebe0c3);
    box(bench, [0.35, 0.15, 0.32], [-0.86, 1.45, 0.25], 0xdb855f);
    cylinder(bench, 0.13, 0.11, 0.24, [0.89, 1.48, 0.25], 0xe7d2a6);
    box(bench, [0.9, 0.06, 0.65], [0, 0.1, 1.5], 0x6d8061);

    const arcade = station('arcade', 0);
    box(arcade, [1.55, 2.75, 1.35], [0, 1.46, 0], 0x587a67);
    box(arcade, [1.65, 0.35, 1.45], [0, 2.85, 0], 0x334a3c);
    box(arcade, [1.28, 1.15, 0.08], [0, 2.05, 0.7], 0x28372f);
    screen(arcade, 1.08, 0.94, [0, 2.05, 0.75], 'PLAY', 'INSERT CURIOSITY', '#243e35', '#d2ea9c');
    box(arcade, [1.5, 0.15, 0.55], [0, 1.25, 0.85], 0xd7b482);
    cylinder(arcade, 0.08, 0.08, 0.2, [-0.4, 1.42, 0.9], 0x3d4b37);
    cylinder(arcade, 0.12, 0.12, 0.12, [-0.4, 1.57, 0.9], 0xe08c71);
    for (let i = 0; i < 3; i++) cylinder(arcade, 0.07, 0.07, 0.05, [0.15 + i * 0.2, 1.36, 0.92], [0xcfe59d, 0xe4ab77, 0xd78d78][i]);
    box(arcade, [0.65, 0.09, 0.08], [0, 0.65, 0.7], 0xd0bc91);

    const research = station('research', 3.15);
    table(research, 2.35, 1.5);
    box(research, [0.8, 0.06, 0.6], [-0.42, 1.4, 0.1], 0xe7d9b8);
    box(research, [0.65, 0.025, 0.43], [-0.42, 1.45, 0.1], 0xf3ebd3);
    box(research, [0.25, 0.06, 0.25], [0.55, 1.41, -0.1], 0x445c4a);
    const sculpture = new THREE.Mesh(new THREE.IcosahedronGeometry(0.39, 1), material(0xa6c989, { flatShading: true }));
    sculpture.position.set(0.55, 1.85, -0.1);
    sculpture.castShadow = true;
    research.add(sculpture);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(sculpture.geometry), new THREE.LineBasicMaterial({ color: 0x4d6c53 }));
    sculpture.add(wire);
    box(research, [0.35, 0.09, 0.48], [-0.85, 1.42, -0.25], 0xd89170);
    box(research, [0.35, 0.09, 0.48], [-0.85, 1.52, -0.25], 0xd8cba3);
    box(research, [0.85, 0.06, 0.65], [0, 0.1, 1.5], 0x6d8061);

    // A plant gives the room a little life without loading any external assets.
    cylinder(scene, 0.38, 0.27, 0.55, [4.6, 0.34, 2.2], 0xb87858);
    for (let i = 0; i < 7; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), material(i % 2 ? 0x668d62 : 0x83a96e));
        const angle = i * Math.PI * 2 / 7;
        leaf.position.set(4.6 + Math.cos(angle) * 0.3, 0.9 + (i % 3) * 0.14, 2.2 + Math.sin(angle) * 0.3);
        leaf.scale.set(0.65, 1.5, 0.65);
        leaf.castShadow = true;
        scene.add(leaf);
    }

    let transition = null;
    function render() { renderer.render(scene, camera); }
    function resize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        const aspect = width / height;
        const halfHeight = Math.max(5.4, 6.5 / aspect);
        camera.left = -halfHeight * aspect;
        camera.right = halfHeight * aspect;
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
        if (aspect < 0.8) camera.setViewOffset(width, height, 0, -height * 0.15, width, height);
        else camera.clearViewOffset();
        camera.updateProjectionMatrix();
        render();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    controls.addEventListener('change', render);
    controls.addEventListener('start', () => { transition = null; });

    focusStation = name => {
        const target = name ? new THREE.Vector3(stations[name].position.x, name === 'profile' || name === 'library' ? 2.4 : 1.2, stations[name].position.z) : new THREE.Vector3(0, 1.1, 0);
        const position = overview.clone().add(target);
        if (reducedMotion.matches) {
            camera.position.copy(position);
            controls.target.copy(target);
            controls.update();
            render();
            return;
        }
        transition = { start: performance.now(), fromPosition: camera.position.clone(), fromTarget: controls.target.clone(), position, target };
        requestAnimationFrame(animate);
    };
    function animate(now) {
        if (!transition) return;
        const progress = Math.min((now - transition.start) / 650, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        camera.position.lerpVectors(transition.fromPosition, transition.position, eased);
        controls.target.lerpVectors(transition.fromTarget, transition.target, eased);
        controls.update();
        render();
        if (progress < 1) requestAnimationFrame(animate);
        else transition = null;
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerStart;
    canvas.addEventListener('pointerdown', event => { pointerStart = { x: event.clientX, y: event.clientY }; });
    canvas.addEventListener('pointerup', event => {
        if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) return;
        const bounds = canvas.getBoundingClientRect();
        pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(Object.values(stations), true)[0];
        if (!hit) return;
        let object = hit.object;
        while (object.parent && object.parent !== scene) object = object.parent;
        const name = Object.keys(stations).find(key => stations[key] === object);
        if (name) selectStation(name);
    });
    canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        transition = null;
        canvas.classList.remove('is-ready');
        status.hidden = false;
        status.textContent = 'The 3D view was interrupted. You can still explore using the station links.';
    });
    resize();
    canvas.classList.add('is-ready');
    status.hidden = true;
} catch (error) {
    console.error('Unable to start the 3D workshop:', error);
    status.textContent = 'The 3D view could not be loaded. You can still explore using the station links.';
    document.getElementById('workshop-hint').textContent = 'CHOOSE A STATION TO EXPLORE';
}
