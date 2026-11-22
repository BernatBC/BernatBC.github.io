import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const canvas = document.getElementById('workshop-canvas');
const status = document.getElementById('workshop-status');
const links = [...document.querySelectorAll('[data-station]')];
const panels = [...document.querySelectorAll('.content-panel')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const home = document.body.dataset.home;
const initialPath = location.pathname;
const pageType = document.body.dataset.page;
const welcome = document.getElementById('welcome');
const hotspots = document.getElementById('hotspots');
const resetView = document.getElementById('view-reset');
const aliases = { skills: 'library', experiences: 'workbench', projects: 'workbench', education: 'research', 'recent-posts': 'library' };
const suspendedFrames = new Map();
let focusStation = () => {};
let updateMotion = () => {};
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
    document.body.classList.add('has-panel');
    updateMotion();
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
    document.body.classList.remove('has-panel');
    updateMotion();
    if (updateHistory) history.pushState(null, '', home);
    focusStation(null);
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });
}
for (const button of document.querySelectorAll('.panel-close')) button.addEventListener('click', () => closePanel());
resetView.addEventListener('click', () => focusStation(null));
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panels.some(panel => !panel.hidden)) {
        closePanel();
        return;
    }
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]'))) return;
    const destinations = ['profile', 'workbench', 'arcade', 'research', 'library'];
    const index = Number(event.key) - 1;
    if (Number.isInteger(index) && index >= 0 && index < destinations.length) {
        lastTrigger = document.querySelector(`.hud-nav [data-station="${destinations[index]}"]`);
        selectStation(destinations[index]);
    } else if (event.key.toLowerCase() === 'r' && !resetView.hidden) {
        focusStation(null);
    }
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

const libraryTools = document.getElementById('library-tools');
const librarySearch = document.getElementById('library-search');
const libraryResults = document.getElementById('library-results');
const libraryCards = [...document.querySelectorAll('#library-posts .story-card')];
const filterButtons = [...libraryTools.querySelectorAll('[data-filter]')];
let libraryFilter = 'all';
function updateLibrary() {
    const query = librarySearch.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const card of libraryCards) {
        const matchesFilter = libraryFilter === 'all' || card.dataset.types.split(' ').includes(libraryFilter);
        const matchesSearch = card.dataset.search.toLocaleLowerCase().includes(query);
        card.hidden = !(matchesFilter && matchesSearch);
        if (!card.hidden) visible++;
    }
    libraryResults.textContent = visible === 0 ? 'No stories found. Try another search or filter.' : `${visible} ${visible === 1 ? 'story' : 'stories'}`;
}
librarySearch.addEventListener('input', updateLibrary);
for (const button of filterButtons) {
    button.addEventListener('click', () => {
        libraryFilter = button.dataset.filter;
        for (const item of filterButtons) item.setAttribute('aria-pressed', String(item === button));
        updateLibrary();
    });
}
libraryTools.hidden = false;
updateLibrary();

try {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-7, 7, 5, -5, 0.1, 100);
    const overview = new THREE.Vector3(9, 8, 12);
    camera.position.copy(overview);
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 1.45, 0);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 5;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.minAzimuthAngle = -Math.PI / 2.8;
    controls.maxAzimuthAngle = Math.PI / 2.8;
    controls.update();

    // A soft studio environment adds believable reflections on glossy and metallic surfaces.
    const environment = new THREE.PMREMGenerator(renderer);
    scene.environment = environment.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.18;
    environment.dispose();
    const maxAnisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);

    scene.add(new THREE.HemisphereLight(0xe3edda, 0x48513f, 1.25));
    const sun = new THREE.DirectionalLight(0xffe5bf, 3.0);
    sun.position.set(-4, 10, 7);
    sun.castShadow = true;
    const shadowSize = window.innerWidth > 700 ? 2048 : 1024;
    sun.shadow.mapSize.set(shadowSize, shadowSize);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    sun.shadow.normalBias = 0.02;
    sun.shadow.radius = 2;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xb7d8bd, 0.7);
    fill.position.set(6, 5, -4);
    scene.add(fill);

    const materials = {};
    function material(color, extra = {}) {
        const key = `${color}-${JSON.stringify(extra, (name, value) => (value && value.isTexture ? value.uuid : value))}`;
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
    function roundedBox(parent, size, position, color, radius = 0.05, extra) {
        const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, 3, radius), material(color, extra));
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
    function canvasPlane(parent, width, height, position, draw, { lit = false, resolution = [512, 320] } = {}) {
        const textureCanvas = document.createElement('canvas');
        [textureCanvas.width, textureCanvas.height] = resolution;
        const ctx = textureCanvas.getContext('2d');
        draw(ctx);
        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = maxAnisotropy;
        const surface = lit ? new THREE.MeshStandardMaterial({ map: texture, roughness: 0.95 }) : new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), surface);
        mesh.position.set(...position);
        parent.add(mesh);
        return mesh;
    }
    // Deterministic noise keeps procedural textures identical between visits.
    function random(seed) {
        let state = seed;
        return () => {
            state = (state * 1664525 + 1013904223) >>> 0;
            return state / 4294967296;
        };
    }
    function proceduralTexture(size, draw, { repeat = [1, 1], rotation = 0, color = true } = {}) {
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = textureCanvas.height = size;
        draw(textureCanvas.getContext('2d'), size);
        const texture = new THREE.CanvasTexture(textureCanvas);
        if (color) texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(...repeat);
        texture.anisotropy = maxAnisotropy;
        if (rotation) {
            texture.center.set(0.5, 0.5);
            texture.rotation = rotation;
        }
        return texture;
    }
    // Light wood grain that tints with the material colour; streaks run along the texture's vertical axis.
    function drawWoodGrain(ctx, size) {
        const rand = random(7);
        ctx.fillStyle = '#f4f4f4';
        ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 160; i++) {
            const x = rand() * size;
            const width = 0.6 + rand() * 2.2;
            ctx.fillStyle = `rgba(70,45,25,${0.03 + rand() * 0.1})`;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            for (let y = 0; y <= size; y += 32) ctx.lineTo(x + Math.sin(y * 0.03 + i) * 2.5, y);
            for (let y = size; y >= 0; y -= 32) ctx.lineTo(x + width + Math.sin(y * 0.03 + i) * 2.5, y);
            ctx.fill();
        }
        for (let i = 0; i < 5; i++) {
            const x = rand() * size;
            const y = rand() * size;
            const knot = ctx.createRadialGradient(x, y, 0, x, y, 10 + rand() * 8);
            knot.addColorStop(0, 'rgba(80,50,28,.3)');
            knot.addColorStop(1, 'rgba(80,50,28,0)');
            ctx.fillStyle = knot;
            ctx.fillRect(x - 24, y - 24, 48, 48);
        }
    }
    function drawPlaster(ctx, size) {
        const rand = random(11);
        ctx.fillStyle = '#f2f2f2';
        ctx.fillRect(0, 0, size, size);
        for (let i = 0; i < 2600; i++) {
            const shade = rand() > 0.5 ? 255 : 90;
            ctx.fillStyle = `rgba(${shade},${shade},${shade},${rand() * 0.07})`;
            const dot = 1 + rand() * 3;
            ctx.fillRect(rand() * size, rand() * size, dot, dot);
        }
    }
    const woodMapAcross = proceduralTexture(256, drawWoodGrain, { rotation: Math.PI / 2 });
    const plasterMap = proceduralTexture(256, drawPlaster, { repeat: [4, 2] });
    const floorMap = proceduralTexture(256, drawWoodGrain, { repeat: [1, 3] });
    const woodFloor = { map: floorMap, bumpMap: floorMap, bumpScale: 1.2, roughness: 0.62 };
    const woodTop = { map: woodMapAcross, bumpMap: woodMapAcross, bumpScale: 1, roughness: 0.55 };
    const plaster = { map: plasterMap, bumpMap: plasterMap, bumpScale: 0.6, roughness: 0.92 };
    function glowTexture(color) {
        return proceduralTexture(64, (ctx, size) => {
            const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
            gradient.addColorStop(0, `rgba(${color},1)`);
            gradient.addColorStop(0.35, `rgba(${color},0.35)`);
            gradient.addColorStop(1, `rgba(${color},0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
        });
    }
    const glowMap = glowTexture('255,226,170');
    function glow(parent, position, size, opacity, map = glowMap) {
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
        sprite.position.set(...position);
        sprite.scale.setScalar(size);
        sprite.raycast = () => {};
        parent.add(sprite);
        return sprite;
    }
    // Soft dark gradients stand in for ambient occlusion where furniture meets the floor and wall.
    const contactTexture = proceduralTexture(128, (ctx, size) => {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(20,12,6,.55)');
        gradient.addColorStop(0.6, 'rgba(20,12,6,.2)');
        gradient.addColorStop(1, 'rgba(20,12,6,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
    });
    function contactShadow(parent, width, depth, position, opacity = 1) {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshBasicMaterial({ map: contactTexture, transparent: true, opacity, depthWrite: false }));
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(...position);
        parent.add(mesh);
        return mesh;
    }
    const swayLeaves = [];
    const ambientUpdates = [];
    // Architectural trim and a shallow plinth give the open room a finished edge.
    roundedBox(scene, [10.55, 0.4, 6.85], [0, -0.22, 0], 0x675342, 0.08);
    box(scene, [10.5, 0.12, 6.8], [0, 0, 0], 0x9d805f);
    box(scene, [10.45, 0.035, 0.035], [0, -0.13, 3.42], 0xb49167);
    for (let x = -4.8; x <= 4.8; x += 0.8) {
        const index = Math.round((x + 4.8) / 0.8);
        box(scene, [0.78, 0.02, 6.7], [x, 0.07, 0], [0xc5a67c, 0xb99872, 0xc3a17a, 0xb3926d][index % 4], woodFloor);
        box(scene, [0.012, 0.006, 1.3], [x - 0.23, 0.083, -1.7 + (index % 3)], 0xa58461);
        box(scene, [0.78, 0.005, 0.014], [x, 0.083, index % 2 ? 0.8 : -1.4], 0xa58461);
    }
    box(scene, [10.5, 4.7, 0.22], [0, 2.35, -3.3], 0x657961, plaster);
    box(scene, [10.5, 0.18, 0.3], [0, 0.16, -3.16], 0x405644);
    box(scene, [10.5, 0.18, 0.3], [0, 4.65, -3.16], 0x405644);
    for (let x = -4.9; x <= 4.9; x += 1.22) box(scene, [0.035, 4.3, 0.03], [x, 2.35, -3.17], 0x71866c);
    box(scene, [10.6, 0.09, 0.14], [0, 1.05, -3.13], 0x536d53);
    box(scene, [10.5, 0.035, 0.08], [0, 1.13, -3.11], 0x91a386, { metalness: 0.15, roughness: 0.45 });
    // Faux ambient occlusion where the floor meets the wall, under the rug and beneath each piece of furniture.
    const wallShade = canvasPlane(scene, 10.4, 1.1, [0, 0.62, -3.0], ctx => {
        const gradient = ctx.createLinearGradient(0, 0, 0, 128);
        gradient.addColorStop(0, 'rgba(12,22,14,0)');
        gradient.addColorStop(1, 'rgba(12,22,14,.42)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 8, 128);
    }, { resolution: [8, 128] });
    wallShade.material.transparent = true;
    wallShade.material.depthWrite = false;
    contactShadow(scene, 10.4, 1.3, [0, 0.0855, -2.65], 0.9);
    contactShadow(scene, 4, 2.1, [0, 0.0855, 1.65], 0.55);
    contactShadow(scene, 3, 2.2, [-3.15, 0.0855, 0.55], 0.9);
    contactShadow(scene, 3, 2.2, [3.15, 0.0855, 0.55], 0.9);
    contactShadow(scene, 2.2, 1.8, [0, 0.0855, 0], 1);

    const rug = canvasPlane(scene, 3.5, 1.65, [0, 0.09, 1.65], ctx => {
        const rand = random(23);
        ctx.fillStyle = '#9b7c65';
        ctx.fillRect(0, 0, 1024, 512);
        // Woven threads in both directions give the rug a fabric feel.
        for (let y = 0; y < 512; y += 3) {
            ctx.fillStyle = `rgba(${rand() > 0.5 ? '255,235,210' : '40,22,14'},${0.03 + rand() * 0.06})`;
            ctx.fillRect(0, y, 1024, 1.5);
        }
        for (let x = 0; x < 1024; x += 3) {
            ctx.fillStyle = `rgba(${rand() > 0.5 ? '255,235,210' : '40,22,14'},${0.02 + rand() * 0.05})`;
            ctx.fillRect(x, 0, 1.5, 512);
        }
        ctx.strokeStyle = '#d6c6a9';
        ctx.lineWidth = 16;
        ctx.strokeRect(40, 40, 944, 432);
        ctx.strokeRect(68, 68, 888, 376);
        ctx.lineWidth = 6;
        for (let x = 140; x < 940; x += 124) {
            ctx.beginPath();
            ctx.moveTo(x, 116); ctx.lineTo(x + 50, 256); ctx.lineTo(x, 396); ctx.stroke();
        }
        ctx.fillStyle = '#c77e64';
        for (let x = 202; x < 900; x += 124) {
            ctx.beginPath(); ctx.moveTo(x, 236); ctx.lineTo(x + 14, 256); ctx.lineTo(x, 276); ctx.lineTo(x - 14, 256); ctx.fill();
        }
    }, { lit: true, resolution: [1024, 512] });
    rug.rotation.x = -Math.PI / 2;
    rug.receiveShadow = true;
    rug.material.color.setScalar(0.72);
    for (const x of [-1.75, 1.75]) {
        for (let z = 0.86; z <= 2.45; z += 0.055) box(scene, [0.1, 0.012, 0.022], [x + Math.sign(x) * 0.04, 0.088, z], 0xd6c6a9, { roughness: 1 });
    }

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
    canvasPlane(scene, 2.27, 1.82, [0, 3.05, -3.0], ctx => {
        const sky = ctx.createLinearGradient(0, 0, 0, 320);
        sky.addColorStop(0, '#9ccdc0'); sky.addColorStop(1, '#e3d9a8');
        ctx.fillStyle = sky; ctx.fillRect(0, 0, 512, 320);
        ctx.fillStyle = '#fff0bd'; ctx.beginPath(); ctx.arc(385, 72, 35, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#86aea0'; ctx.beginPath(); ctx.moveTo(0, 260); ctx.lineTo(170, 80); ctx.lineTo(270, 210); ctx.lineTo(355, 112); ctx.lineTo(512, 265); ctx.lineTo(512, 320); ctx.lineTo(0, 320); ctx.fill();
        ctx.fillStyle = '#6e9a80'; ctx.beginPath(); ctx.moveTo(0, 275); ctx.lineTo(105, 190); ctx.lineTo(200, 252); ctx.lineTo(330, 165); ctx.lineTo(512, 275); ctx.lineTo(512, 320); ctx.lineTo(0, 320); ctx.fill();
        ctx.fillStyle = '#4d7964'; ctx.fillRect(0, 282, 512, 38);
    });
    box(scene, [0.09, 1.85, 0.1], [0, 3.05, -2.96], 0xe9d5af);
    box(scene, [2.3, 0.09, 0.1], [0, 3.05, -2.96], 0xe9d5af);
    box(scene, [2.65, 0.12, 0.3], [0, 1.99, -2.95], 0xbca887);
    for (const x of [-1.18, 1.18]) box(scene, [0.12, 2.08, 0.12], [x, 3.05, -2.99], 0xcbb998);
    box(scene, [2.48, 0.12, 0.12], [0, 4.04, -2.99], 0xcbb998);

    // Drifting clouds and a pulsing sun glow keep the view outside alive.
    const clouds = canvasPlane(scene, 2.27, 0.9, [0, 3.45, -2.99], ctx => {
        const rand = random(5);
        for (let i = 0; i < 7; i++) {
            const x = rand() * 512;
            const y = 18 + rand() * 90;
            const width = 50 + rand() * 60;
            for (const offset of [-512, 0, 512]) {
                ctx.fillStyle = 'rgba(255,250,232,.5)';
                for (let puff = 0; puff < 5; puff++) {
                    ctx.beginPath();
                    ctx.ellipse(x + offset + (puff - 2) * width * 0.28, y + Math.abs(puff - 2) * 3, width * (0.32 - Math.abs(puff - 2) * 0.05), 11 + (2 - Math.abs(puff - 2)) * 5, 0, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }, { resolution: [512, 128] });
    clouds.material.map.wrapS = THREE.RepeatWrapping;
    clouds.material.transparent = true;
    clouds.material.depthWrite = false;
    const sunGlow = glow(scene, [0.57, 3.55, -2.98], 1.3, 0.5);
    ambientUpdates.push(now => {
        clouds.material.map.offset.x = (now * 0.000004) % 1;
        sunGlow.material.opacity = 0.42 + Math.sin(now * 0.0011) * 0.08;
    });

    // Sunbeams through the window: a faint volume, a patch of light on the floor and floating dust.
    const beamDirection = new THREE.Vector3(0.5, -1, 1.4);
    function beamPoint(x, y, target = new THREE.Vector3()) {
        const drop = y - 0.1;
        return target.set(x + beamDirection.x * drop, 0.1, -3.0 + beamDirection.z * drop);
    }
    const beamTop = [[-1.05, 3.88], [1.05, 3.88], [1.05, 2.22], [-1.05, 2.22]];
    const beamPositions = [];
    const beamColors = [];
    const beamUvs = [];
    const floorCorners = beamTop.map(([x, y]) => beamPoint(x, y));
    for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4;
        const quad = [
            [beamTop[i][0], beamTop[i][1], -3.0, 1], [beamTop[j][0], beamTop[j][1], -3.0, 1],
            [floorCorners[j].x, 0.1, floorCorners[j].z, 0], [floorCorners[i].x, 0.1, floorCorners[i].z, 0]
        ];
        for (const index of [0, 1, 2, 0, 2, 3]) {
            const [x, y, z, strength] = quad[index];
            beamPositions.push(x, y, z);
            beamColors.push(0.04 * strength, 0.032 * strength, 0.017 * strength);
        }
    }
    const beamGeometry = new THREE.BufferGeometry();
    beamGeometry.setAttribute('position', new THREE.Float32BufferAttribute(beamPositions, 3));
    beamGeometry.setAttribute('color', new THREE.Float32BufferAttribute(beamColors, 3));
    const beamMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    scene.add(new THREE.Mesh(beamGeometry, beamMaterial));
    const patchTexture = proceduralTexture(128, (ctx, size) => {
        ctx.fillStyle = '#fff';
        ctx.filter = 'blur(2px)';
        for (const [x, y] of [[8, 8], [68, 8], [8, 68], [68, 68]]) ctx.fillRect(x, y, 52, 52);
    });
    patchTexture.wrapS = patchTexture.wrapT = THREE.ClampToEdgeWrapping;
    const patchGeometry = new THREE.BufferGeometry();
    patchGeometry.setAttribute('position', new THREE.Float32BufferAttribute(floorCorners.flatMap(corner => [corner.x, 0.0925, corner.z]), 3));
    patchGeometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1, 1, 1, 1, 0, 0, 0], 2));
    patchGeometry.setIndex([0, 2, 1, 0, 3, 2]);
    const patchMaterial = new THREE.MeshBasicMaterial({ map: patchTexture, color: 0x54462a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    scene.add(new THREE.Mesh(patchGeometry, patchMaterial));
    const dustCount = 70;
    const dustSeeds = Array.from({ length: dustCount }, (_, i) => {
        const rand = random(100 + i);
        return { t: rand(), x: rand() * 2 - 1, y: rand(), speed: 0.4 + rand() * 0.8, phase: rand() * 10 };
    });
    const dustPositions = new Float32Array(dustCount * 3);
    const dust = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ map: glowMap, size: 7, sizeAttenuation: false, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffeec4 }));
    dust.geometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dust.frustumCulled = false;
    scene.add(dust);
    const dustPoint = new THREE.Vector3();
    function updateDust(now) {
        for (let i = 0; i < dustCount; i++) {
            const seed = dustSeeds[i];
            const windowY = 2.25 + seed.y * 1.6;
            const progress = (seed.t + now * 0.00002 * seed.speed) % 1;
            beamPoint(seed.x * 1.05, windowY, dustPoint);
            const x = seed.x * 1.05 + (dustPoint.x - seed.x * 1.05) * progress;
            dustPositions[i * 3] = x + Math.sin(now * 0.0004 + seed.phase) * 0.1;
            dustPositions[i * 3 + 1] = windowY + (0.1 - windowY) * progress + Math.sin(now * 0.0006 + seed.phase) * 0.06;
            dustPositions[i * 3 + 2] = -3.0 + (dustPoint.z + 3.0) * progress + Math.cos(now * 0.0005 + seed.phase) * 0.1;
        }
        dust.geometry.attributes.position.needsUpdate = true;
    }
    updateDust(0);
    ambientUpdates.push(updateDust);
    const profile = station('profile', -3.35, -3.13);
    roundedBox(profile, [1.35, 1.05, 0.1], [0, 3.35, 0], 0x3c5143, 0.025);
    canvasPlane(profile, 1.13, 0.83, [0, 3.35, 0.11], ctx => {
        ctx.fillStyle = '#e5d7b8'; ctx.fillRect(0, 0, 512, 320);
        ctx.fillStyle = '#78927c'; ctx.fillRect(30, 30, 165, 260);
        ctx.fillStyle = '#c9b895'; ctx.beginPath(); ctx.arc(113, 120, 45, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#3e5b4b'; ctx.beginPath(); ctx.ellipse(113, 245, 70, 83, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = '#40594c'; ctx.font = '20px sans-serif'; ctx.fillText('THE PERSON', 225, 105);
        ctx.fillText('BEHIND THE', 225, 135);
        ctx.font = 'bold 36px Georgia'; ctx.fillText('work.', 225, 185);
        ctx.fillRect(225, 213, 80, 3);
    });
    const library = station('library', 3.4, -2.95);
    box(library, [1.55, 0.12, 0.45], [0, 3.65, 0], 0xb99872);
    for (let i = 0; i < 6; i++) {
        const height = [0.47, 0.57, 0.51, 0.64, 0.48, 0.56][i];
        box(library, [0.16, height, 0.25], [-0.54 + i * 0.21, 3.71 + height / 2, 0.04], [0xb87861, 0xd0bc96, 0x708e77, 0xa2b097, 0xa86c57, 0x768b7c][i]);
        box(library, [0.1, 0.018, 0.015], [-0.54 + i * 0.21, 3.82, 0.18], 0xe0d0ad);
    }
    for (const x of [-0.58, 0.58]) box(library, [0.06, 0.23, 0.25], [x, 3.5, -0.06], 0x5b6d59);
    box(scene, [1.6, 0.12, 0.42], [-3.35, 2.55, -2.96], 0xcaa875);
    box(scene, [0.28, 0.16, 0.25], [-3.8, 2.7, -2.9], 0xd58a6f);
    box(scene, [0.3, 0.1, 0.25], [-3.8, 2.83, -2.9], 0xe9d6ad);
    plant(scene, [-2.9, 2.61, -2.88], 0.42, 0xbc866b);
    function table(group, width, depth) {
        roundedBox(group, [width, 0.18, depth], [0, 1.28, 0], 0xb9926e, 0.055, woodTop);
        box(group, [width - 0.15, 0.035, 0.035], [0, 1.2, depth / 2 - 0.01], 0x725942);
        for (const x of [-width / 2 + 0.16, width / 2 - 0.16]) {
            for (const z of [-depth / 2 + 0.16, depth / 2 - 0.16]) box(group, [0.16, 1.22, 0.16], [x, 0.65, z], 0x785943);
        }
    }

    const bench = station('workbench', -3.15);
    table(bench, 2.35, 1.5);
    box(bench, [1.65, 0.26, 0.35], [0, 1.04, 0.62], 0xa57b55);
    box(bench, [0.25, 0.035, 0.025], [0, 1.04, 0.81], 0xd7bd88);
    roundedBox(bench, [1.35, 0.85, 0.15], [0, 2.03, -0.28], 0x263a32, 0.06);
    canvasPlane(bench, 1.18, 0.68, [0, 2.04, -0.195], ctx => {
        ctx.fillStyle = '#243a33'; ctx.fillRect(0, 0, 512, 320);
        ctx.fillStyle = '#304a40'; ctx.fillRect(0, 0, 512, 38);
        ctx.fillStyle = '#9fb6a0'; ctx.font = '14px monospace'; ctx.fillText('WORKSPACE  /  PROJECTS', 22, 25);
        ctx.fillStyle = '#749284'; ctx.fillRect(22, 70, 5, 176);
        const lines = [[44, 75, 120, '#d4c194'], [44, 110, 220, '#a7c3a9'], [65, 145, 300, '#d5dcc2'], [65, 180, 190, '#b48f78'], [44, 215, 260, '#a7c3a9'], [44, 250, 145, '#d5dcc2']];
        for (const [x, y, width, color] of lines) { ctx.fillStyle = color; ctx.fillRect(x, y, width, 7); }
    });
    box(bench, [0.14, 0.25, 0.14], [0, 1.48, -0.28], 0x303d34);
    roundedBox(bench, [0.8, 0.07, 0.32], [0, 1.4, 0.42], 0xe0d5bb, 0.025);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 9; col++) box(bench, [0.055, 0.012, 0.055], [-0.32 + col * 0.08, 1.443, 0.33 + row * 0.08], 0xa5ad91);
    }
    roundedBox(bench, [0.14, 0.045, 0.21], [0.57, 1.4, 0.42], 0xd9cfaf, 0.02);
    box(bench, [0.35, 0.15, 0.32], [-0.86, 1.45, 0.25], 0xdb855f);
    cylinder(bench, 0.13, 0.11, 0.24, [0.89, 1.48, 0.25], 0xe7d2a6);
    cylinder(bench, 0.1, 0.1, 0.012, [0.89, 1.607, 0.25], 0x75513b);
    const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.025, 6, 12), material(0xe7d2a6));
    mugHandle.position.set(1.02, 1.48, 0.25);
    bench.add(mugHandle);
    cylinder(bench, 0.14, 0.16, 0.06, [-0.86, 1.4, -0.46], 0x43594a, 20);
    function lampArm(from, to) {
        const start = new THREE.Vector3(...from);
        const end = new THREE.Vector3(...to);
        const arm = cylinder(bench, 0.025, 0.025, start.distanceTo(end), start.clone().add(end).multiplyScalar(0.5).toArray(), 0x526b58);
        arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    }
    lampArm([-0.86, 1.43, -0.46], [-0.91, 1.86, -0.46]);
    lampArm([-0.91, 1.86, -0.46], [-0.7, 2.1, -0.46]);
    const lampJoint = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), material(0xc9ad80, { metalness: 0.3 }));
    lampJoint.position.set(-0.91, 1.86, -0.46);
    bench.add(lampJoint);
    const benchLamp = cylinder(bench, 0.07, 0.19, 0.16, [-0.7, 2.05, -0.46], 0xc6a16c, 20);
    benchLamp.rotation.z = -0.25;
    const lampBulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff0c4, toneMapped: false }));
    lampBulb.position.set(-0.68, 1.99, -0.46);
    bench.add(lampBulb);
    glow(bench, [-0.68, 1.97, -0.4], 0.7, 0.5);
    const deskLight = new THREE.PointLight(0xffd6a0, 0.7, 2.4);
    deskLight.position.set(-0.66, 1.9, -0.3);
    bench.add(deskLight);
    const steamMap = glowTexture('240,240,230');
    const steam = Array.from({ length: 4 }, (_, i) => {
        const puff = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamMap, transparent: true, opacity: 0, depthWrite: false }));
        bench.add(puff);
        puff.raycast = () => {};
        return { puff, phase: i / 4 };
    });
    ambientUpdates.push(now => {
        for (const { puff, phase } of steam) {
            const progress = (now * 0.00028 + phase) % 1;
            puff.position.set(0.89 + Math.sin(progress * 7 + phase * 9) * 0.045, 1.64 + progress * 0.5, 0.25);
            puff.scale.setScalar(0.1 + progress * 0.22);
            puff.material.opacity = Math.sin(progress * Math.PI) * 0.3;
        }
    });
    roundedBox(bench, [0.68, 0.12, 0.58], [-0.25, 0.75, 1.48], 0x526d5b, 0.08);
    roundedBox(bench, [0.68, 0.62, 0.12], [-0.25, 1.18, 1.75], 0x526d5b, 0.06);
    cylinder(bench, 0.055, 0.055, 0.62, [-0.25, 0.41, 1.48], 0x3b4d40);
    for (let i = 0; i < 4; i++) {
        const angle = i * Math.PI / 2;
        const foot = box(bench, [0.09, 0.08, 0.4], [-0.25 + Math.sin(angle) * 0.17, 0.12, 1.48 + Math.cos(angle) * 0.17], 0x3b4d40);
        foot.rotation.y = angle;
    }

    const arcade = station('arcade', 0);
    const cabinetShape = new THREE.Shape();
    cabinetShape.moveTo(0.6, 0.12);
    cabinetShape.lineTo(0.6, 2.86);
    cabinetShape.quadraticCurveTo(0.6, 2.95, 0.5, 2.95);
    cabinetShape.lineTo(-0.34, 2.95);
    cabinetShape.quadraticCurveTo(-0.39, 2.95, -0.43, 2.89);
    cabinetShape.lineTo(-0.58, 2.65);
    cabinetShape.lineTo(-0.41, 2.45);
    cabinetShape.lineTo(-0.55, 1.5);
    cabinetShape.lineTo(-0.94, 1.39);
    cabinetShape.lineTo(-0.94, 1.12);
    cabinetShape.lineTo(-0.62, 1.05);
    cabinetShape.lineTo(-0.62, 0.12);
    cabinetShape.closePath();
    const sideGeometry = new THREE.ExtrudeGeometry(cabinetShape, { depth: 0.12, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 });
    for (const x of [-0.75, 0.63]) {
        const side = new THREE.Mesh(sideGeometry, material(0x496b5a));
        side.rotation.y = Math.PI / 2;
        side.position.x = x;
        side.castShadow = true;
        side.receiveShadow = true;
        arcade.add(side);
        const edge = new THREE.CurvePath();
        const points = [[0.38, 2.95], [0.58, 2.65], [0.41, 2.45], [0.55, 1.5], [0.94, 1.39], [0.94, 1.12], [0.62, 1.05], [0.62, 0.12]];
        for (let i = 1; i < points.length; i++) {
            edge.add(new THREE.LineCurve3(new THREE.Vector3(x + 0.06, points[i - 1][1], points[i - 1][0]), new THREE.Vector3(x + 0.06, points[i][1], points[i][0])));
        }
        const trim = new THREE.Mesh(new THREE.TubeGeometry(edge, 48, 0.018, 6, false), material(0xc0a276, { metalness: 0.35 }));
        arcade.add(trim);
    }
    box(arcade, [1.25, 1.05, 1.2], [0, 0.64, 0], 0x365447);
    box(arcade, [1.25, 1.5, 0.85], [0, 1.9, -0.16], 0x304b40);
    roundedBox(arcade, [1.3, 0.33, 0.98], [0, 2.75, -0.1], 0x263e34, 0.035);
    for (const [y, z] of [[2.9, 0.405], [2.6, 0.405]]) {
        roundedBox(arcade, [1.24, 0.025, 0.025], [0, y, z], 0xb99a72, 0.01);
    }
    canvasPlane(arcade, 1.18, 0.23, [0, 2.75, 0.395], ctx => {
        ctx.fillStyle = '#e1c69b'; ctx.fillRect(0, 0, 512, 320);
        ctx.strokeStyle = '#7b8d73'; ctx.lineWidth = 8; ctx.strokeRect(16, 22, 480, 276);
        ctx.fillStyle = '#344d40'; ctx.textAlign = 'center'; ctx.font = 'bold 115px Georgia';
        ctx.fillText('ARCADE', 256, 205);
    });

    const monitor = new THREE.Group();
    monitor.position.set(0, 2.05, 0.49);
    monitor.rotation.x = -0.15;
    arcade.add(monitor);
    roundedBox(monitor, [1.26, 1.14, 0.12], [0, 0, 0], 0x1e332d, 0.045);
    roundedBox(monitor, [1.12, 0.96, 0.025], [0, 0, 0.066], 0x0f211f, 0.035);
    for (const [size, position] of [
        [[1.06, 0.035, 0.025], [0, 0.45, 0.092]],
        [[1.06, 0.035, 0.025], [0, -0.45, 0.092]],
        [[0.035, 0.88, 0.025], [-0.53, 0, 0.092]],
        [[0.035, 0.88, 0.025], [0.53, 0, 0.092]]
    ]) {
        roundedBox(monitor, size, position, 0xb99a72, 0.012);
    }
    for (const x of [-0.57, 0.57]) {
        for (const y of [-0.49, 0.49]) {
            const screw = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), material(0xd0b88e));
            screw.position.set(x, y, 0.092);
            monitor.add(screw);
        }
    }
    const powerLight = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), material(0xc9765e));
    powerLight.position.set(0.48, -0.51, 0.094);
    monitor.add(powerLight);
    let arcadeScreenContext;
    function drawArcadeScreen(ctx, now) {
        const time = now * 0.001;
        const glow = ctx.createLinearGradient(0, 0, 0, 320);
        glow.addColorStop(0, '#315955'); glow.addColorStop(1, '#142d2e');
        ctx.fillStyle = glow; ctx.fillRect(0, 0, 512, 320);
        ctx.fillStyle = '#a8c9a9';
        for (let i = 0; i < 18; i++) {
            const x = (i * 83 - time * (18 + i % 4 * 5) % 550 + 550) % 550;
            ctx.fillRect(x, 42 + (i * 37) % 112, 4, 4);
        }
        ctx.fillStyle = '#406b63';
        ctx.beginPath();
        ctx.moveTo(0, 219); ctx.lineTo(78, 142); ctx.lineTo(147, 204); ctx.lineTo(245, 130);
        ctx.lineTo(341, 210); ctx.lineTo(430, 150); ctx.lineTo(512, 213); ctx.lineTo(512, 320); ctx.lineTo(0, 320);
        ctx.fill();
        ctx.fillStyle = '#638671';
        ctx.fillRect(0, 244, 512, 76);
        ctx.fillStyle = '#94a17b';
        const groundOffset = (time * 42) % 64;
        for (let x = -64 + groundOffset; x < 512; x += 64) {
            ctx.fillRect(x, 258, 34, 4);
            ctx.fillRect(x + 24, 282, 20, 4);
        }
        const jump = Math.max(0, Math.sin(time * 2.5)) * 48;
        const playerX = 112 + Math.sin(time * 0.75) * 20;
        const playerY = 205 - jump;
        ctx.fillStyle = 'rgba(20,35,31,.38)';
        ctx.beginPath(); ctx.ellipse(playerX + 16, 246, 17 - jump * 0.08, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e5d5ad';
        ctx.fillRect(playerX + 5, playerY, 22, 17);
        ctx.fillRect(playerX, playerY + 17, 32, 24);
        ctx.fillStyle = '#39574b';
        ctx.fillRect(playerX + 11, playerY + 7, 4, 4);
        ctx.fillRect(playerX + 21, playerY + 7, 4, 4);
        ctx.fillRect(playerX + 9, playerY + 20, 14, 4);
        ctx.fillStyle = '#c77e64';
        const step = Math.sin(time * 12) > 0 ? 5 : 0;
        ctx.fillRect(playerX + 2, playerY + 38, 11, 6 + step);
        ctx.fillRect(playerX + 21, playerY + 38, 11, 11 - step);
        ctx.fillStyle = '#b87861';
        const obstacleX = 540 - (time * 64 % 590);
        if (obstacleX > -32) {
            ctx.fillRect(obstacleX + 10, 222, 14, 23);
            ctx.fillRect(obstacleX, 231, 34, 12);
            ctx.fillRect(obstacleX - 4, 235, 8, 5);
            ctx.fillRect(obstacleX + 30, 226, 8, 5);
        }
        ctx.fillStyle = '#e1c69b';
        ctx.font = 'bold 17px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('DEMO GAME', 20, 18);
        ctx.textAlign = 'right';
        ctx.fillText(`1UP ${String(1200 + Math.floor(time * 9) % 8800).padStart(5, '0')}`, 492, 18);
        if (Math.floor(time * 2) % 2 === 0) {
            ctx.textAlign = 'center';
            ctx.font = 'bold 18px monospace';
            ctx.fillText('PRESS START', 256, 296);
        }
        ctx.fillStyle = 'rgba(255,255,255,.035)';
        for (let y = 0; y < 320; y += 6) ctx.fillRect(0, y, 512, 2);
        const vignette = ctx.createRadialGradient(256, 160, 120, 256, 160, 330);
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(4,14,12,.55)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, 512, 320);
        // A slow rolling band mimics the refresh sweep of an old CRT.
        const bandY = (time * 55) % 420 - 50;
        const band = ctx.createLinearGradient(0, bandY, 0, bandY + 50);
        band.addColorStop(0, 'rgba(200,255,230,0)');
        band.addColorStop(0.5, 'rgba(200,255,230,.06)');
        band.addColorStop(1, 'rgba(200,255,230,0)');
        ctx.fillStyle = band;
        ctx.fillRect(0, bandY, 512, 50);
    }
    const arcadeScreen = canvasPlane(monitor, 1.02, 0.85, [0, 0, 0.081], ctx => {
        arcadeScreenContext = ctx;
        drawArcadeScreen(ctx, 0);
    });
    const arcadeScreenTexture = arcadeScreen.material.map;
    arcadeScreenTexture.minFilter = THREE.NearestFilter;
    arcadeScreenTexture.magFilter = THREE.NearestFilter;
    arcadeScreenTexture.generateMipmaps = false;
    const glassSheen = new THREE.Mesh(new THREE.PlaneGeometry(1.02, 0.85), new THREE.MeshBasicMaterial({
        map: proceduralTexture(128, (ctx, size) => {
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, 'rgba(255,255,255,.16)');
            gradient.addColorStop(0.35, 'rgba(255,255,255,.04)');
            gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
            gradient.addColorStop(1, 'rgba(255,255,255,.05)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
        }),
        transparent: true,
        depthWrite: false
    }));
    glassSheen.position.set(0, 0, 0.085);
    monitor.add(glassSheen);
    const screenGlow = glow(monitor, [0, 0, 0.3], 2.4, 0.2, glowTexture('130,230,200'));
    const screenLight = new THREE.PointLight(0x8fd6c0, 1.0, 3.2);
    screenLight.position.set(0, 0.1, 0.9);
    monitor.add(screenLight);
    const marqueeGlow = glow(arcade, [0, 2.75, 0.55], 1.7, 0.22, glowTexture('255,214,150'));
    const arcadeButtons = [];
    const controlsPanel = new THREE.Group();
    controlsPanel.position.set(0, 1.38, 0.73);
    controlsPanel.rotation.x = 0.13;
    arcade.add(controlsPanel);
    roundedBox(controlsPanel, [1.3, 0.12, 0.58], [0, 0, 0], 0xc8ad83, 0.035);
    cylinder(controlsPanel, 0.13, 0.13, 0.025, [-0.37, 0.07, 0], 0x40574a, 24);
    cylinder(controlsPanel, 0.025, 0.025, 0.18, [-0.37, 0.16, 0], 0x647365, 16);
    const joystick = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), material(0xc9765e, { roughness: 0.35 }));
    joystick.position.set(-0.37, 0.27, 0);
    joystick.castShadow = true;
    controlsPanel.add(joystick);
    for (const [x, z, color] of [[0.16, -0.08, 0x8caa88], [0.37, -0.08, 0xd6ac74], [0.26, 0.1, 0xc97f67], [0.47, 0.1, 0xd9c89e]]) {
        cylinder(controlsPanel, 0.075, 0.075, 0.025, [x, 0.073, z], 0x47594b, 16);
        const button = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 12), material(color));
        button.scale.y = 0.55;
        button.position.set(x, 0.103, z);
        button.castShadow = true;
        controlsPanel.add(button);
        arcadeButtons.push(button);
    }
    // Controls and glow follow the on-screen game: the joystick sways with the player and the button presses on each jump.
    ambientUpdates.push(now => {
        const time = now * 0.001;
        joystick.position.x = -0.37 + Math.cos(time * 0.75) * 0.02;
        arcadeButtons[0].position.y = Math.sin(time * 2.5) > 0 ? 0.088 : 0.103;
        const flicker = 1 + Math.sin(time * 31) * 0.03 + Math.sin(time * 7.3) * 0.05;
        screenLight.intensity = 1.0 * flicker;
        screenGlow.material.opacity = 0.2 * flicker;
        marqueeGlow.material.opacity = 0.2 + Math.sin(time * 1.6) * 0.05;
    });
    roundedBox(arcade, [0.64, 0.55, 0.035], [0, 0.72, 0.616], 0x223b32, 0.035);
    roundedBox(arcade, [0.27, 0.19, 0.025], [-0.14, 0.76, 0.64], 0x9c8b69, 0.02);
    box(arcade, [0.16, 0.022, 0.012], [-0.14, 0.79, 0.659], 0x273b32);
    box(arcade, [0.1, 0.045, 0.012], [-0.14, 0.71, 0.659], 0xb8795f);
    for (let i = 0; i < 4; i++) box(arcade, [0.2, 0.018, 0.012], [0.16, 0.82 - i * 0.07, 0.64], 0x83937b);
    roundedBox(arcade, [0.22, 0.22, 0.035], [-0.43, 0.67, 0.64], 0x344c40, 0.025);
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
            const vent = cylinder(arcade, 0.008, 0.008, 0.012, [-0.48 + col * 0.04, 0.61 + row * 0.05, 0.665], 0x1c3029, 8);
            vent.rotation.x = Math.PI / 2;
        }
    }
    roundedBox(arcade, [0.18, 0.27, 0.035], [0.46, 0.75, 0.64], 0x405447, 0.025);
    roundedBox(arcade, [0.09, 0.012, 0.012], [0.46, 0.82, 0.665], 0x1c3029, 0.004);
    const coinReturn = cylinder(arcade, 0.035, 0.035, 0.014, [0.46, 0.66, 0.666], 0xc0a276, 16);
    coinReturn.rotation.x = Math.PI / 2;
    box(arcade, [0.82, 0.05, 0.025], [0, 0.16, 0.615], 0x8e715a);
    for (const x of [-0.58, 0.58]) roundedBox(arcade, [0.28, 0.12, 1.2], [x, 0.1, 0], 0x263c32, 0.03);
    for (const x of [-0.82, 0.82]) {
        for (const y of [0.28, 2.68]) {
            const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 8), material(0xc0a276));
            rivet.position.set(x, y, 0.46);
            arcade.add(rivet);
        }
    }
    const sideArt = canvasPlane(arcade, 0.82, 1.14, [0.767, 1.87, 0], ctx => {
        ctx.strokeStyle = '#d4bd96'; ctx.lineWidth = 15;
        ctx.beginPath(); ctx.arc(260, 145, 87, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = '#c77e64'; ctx.lineWidth = 18;
        ctx.beginPath(); ctx.moveTo(38, 253); ctx.lineTo(181, 181); ctx.stroke();
        ctx.strokeStyle = '#e1cfaa'; ctx.lineWidth = 10;
        ctx.beginPath(); ctx.moveTo(43, 281); ctx.lineTo(199, 203); ctx.stroke();
        ctx.fillStyle = '#d4bd96'; ctx.beginPath(); ctx.moveTo(260, 100); ctx.lineTo(298, 145); ctx.lineTo(260, 190); ctx.lineTo(222, 145); ctx.closePath(); ctx.fill();
    });
    sideArt.rotation.y = Math.PI / 2;
    sideArt.material.transparent = true;

    const research = station('research', 3.15);
    table(research, 2.35, 1.5);
    box(research, [0.8, 0.06, 0.6], [-0.42, 1.4, 0.1], 0xe7d9b8);
    box(research, [0.65, 0.025, 0.43], [-0.42, 1.45, 0.1], 0xf3ebd3);
    box(research, [0.25, 0.06, 0.25], [0.55, 1.41, -0.1], 0x445c4a);
    const sculpture = new THREE.Mesh(new THREE.IcosahedronGeometry(0.39, 1), material(0xa6c989, { flatShading: true, emissive: 0x1d3a22, roughness: 0.3, metalness: 0.1 }));
    sculpture.position.set(0.55, 1.85, -0.1);
    sculpture.castShadow = true;
    research.add(sculpture);
    const sculptureGlow = glow(research, [0.55, 1.85, -0.1], 1.4, 0.16, glowTexture('166,230,150'));
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(sculpture.geometry), new THREE.LineBasicMaterial({ color: 0x4d6c53 }));
    sculpture.add(wire);
    ambientUpdates.push(now => {
        const bob = Math.sin(now * 0.0012) * 0.035;
        sculpture.position.y = 1.85 + bob;
        sculptureGlow.position.y = 1.85 + bob;
        sculpture.rotation.x = Math.sin(now * 0.0007) * 0.12;
        sculptureGlow.material.opacity = 0.14 + Math.sin(now * 0.0018) * 0.04;
    });
    box(research, [0.35, 0.09, 0.48], [-0.85, 1.42, -0.25], 0xd89170);
    box(research, [0.35, 0.09, 0.48], [-0.85, 1.52, -0.25], 0xd8cba3);
    for (let i = 0; i < 3; i++) box(research, [0.4 - i * 0.07, 0.012, 0.015], [-0.48, 1.473, 0.02 + i * 0.1], 0x93a68c);
    roundedBox(research, [0.65, 0.12, 0.5], [0.05, 0.72, 1.35], 0x8e715a, 0.055);
    roundedBox(research, [0.65, 0.55, 0.1], [0.05, 1.08, 1.59], 0x8e715a, 0.045);
    for (const x of [-0.18, 0.28]) {
        for (const z of [1.2, 1.5]) box(research, [0.09, 0.7, 0.09], [x, 0.37, z], 0x785943);
    }
    const pencil = cylinder(research, 0.025, 0.025, 0.48, [-0.05, 1.43, 0.3], 0xda9c65, 6);
    pencil.rotation.z = Math.PI / 2.4;
    pencil.rotation.x = Math.PI / 2;

    // Warm pendant lights and a little noticeboard frame the workspace.
    const pendants = [];
    for (const x of [-1.8, 1.8]) {
        const pendant = new THREE.Group();
        pendant.position.set(x, 4.7, -1.6);
        scene.add(pendant);
        cylinder(pendant, 0.018, 0.018, 0.7, [0, -0.35, 0], 0x3e5545, 8);
        cylinder(pendant, 0.08, 0.3, 0.25, [0, -0.79, 0], 0xd1a66e);
        const bulb = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 16), new THREE.MeshBasicMaterial({ color: 0xfff0c4, toneMapped: false }));
        bulb.position.set(0, -0.93, 0);
        pendant.add(bulb);
        const light = new THREE.PointLight(0xffdba8, 0.8, 3.2);
        light.position.set(0, -0.98, 0);
        pendant.add(light);
        glow(pendant, [0, -1.0, 0], 1.25, 0.55);
        pendants.push(pendant);
    }
    ambientUpdates.push(now => {
        pendants.forEach((pendant, i) => {
            pendant.rotation.z = Math.sin(now * 0.0009 + i * 2.1) * 0.022;
            pendant.rotation.x = Math.cos(now * 0.0007 + i * 1.3) * 0.016;
        });
    });
    box(scene, [1.2, 0.72, 0.08], [4.1, 2.5, -3.11], 0x806e50);
    box(scene, [1.04, 0.56, 0.04], [4.1, 2.5, -3.04], 0xcbb88d);
    box(scene, [0.32, 0.36, 0.02], [3.85, 2.52, -3.01], 0xf1e8ca);
    box(scene, [0.34, 0.26, 0.02], [4.25, 2.52, -3.01], 0xe2a684);
    cylinder(scene, 0.045, 0.045, 0.03, [3.85, 2.72, -2.99], 0xc76c4c);

    function plant(parent, position, scale, potColor) {
        const group = new THREE.Group();
        group.position.set(...position);
        group.scale.setScalar(scale);
        parent.add(group);
        cylinder(group, 0.38, 0.28, 0.55, [0, 0.275, 0], potColor, 24);
        cylinder(group, 0.4, 0.38, 0.09, [0, 0.53, 0], potColor, 24);
        cylinder(group, 0.34, 0.34, 0.02, [0, 0.58, 0], 0x544d3d, 24);
        for (let i = 0; i < 9; i++) {
            const angle = i * Math.PI * 2 / 9;
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), material(i % 2 ? 0x67866a : 0x829e77));
            const spread = i < 3 ? 0.12 : 0.28;
            leaf.position.set(Math.cos(angle) * spread, 0.9 + (i % 3) * 0.12, Math.sin(angle) * spread);
            leaf.scale.set(0.55, 2.1, 0.28);
            leaf.rotation.set(0, -angle, i < 3 ? -0.18 : -0.5);
            leaf.castShadow = true;
            group.add(leaf);
            swayLeaves.push({ leaf, base: leaf.rotation.z, phase: i * 1.7 + position[0] });
        }
    }
    plant(scene, [4.6, 0.08, 2.2], 1, 0xa9755f);
    plant(scene, [-4.6, 0.08, 2.3], 0.55, 0xc2a082);
    ambientUpdates.push(now => {
        for (const { leaf, base, phase } of swayLeaves) leaf.rotation.z = base + Math.sin(now * 0.0012 + phase) * 0.035;
    });

    // A sleeping cat curled up on the rug breathes slowly.
    const cat = new THREE.Group();
    cat.position.set(-1.05, 0.1, 1.75);
    cat.rotation.y = 0.55;
    scene.add(cat);
    const fur = { roughness: 0.95 };
    const catBody = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), material(0xd8924f, fur));
    catBody.scale.set(1.15, 0.62, 0.95);
    catBody.position.y = 0.17;
    const catHead = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), material(0xe0a063, fur));
    catHead.position.set(0.36, 0.13, 0.2);
    const catTail = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.055, 8, 28, Math.PI * 1.15), material(0xc9823f, fur));
    catTail.rotation.x = Math.PI / 2;
    catTail.rotation.z = 0.5;
    catTail.position.y = 0.06;
    const tailTip = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 8), material(0xf1deb8, fur));
    tailTip.position.set(Math.cos(0.5 + Math.PI * 1.15) * 0.32, 0.06, Math.sin(0.5 + Math.PI * 1.15) * 0.32);
    const paws = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), material(0xf1deb8, fur));
    paws.scale.set(1.5, 0.7, 1);
    paws.position.set(0.5, 0.05, 0.1);
    cat.add(catBody, catHead, catTail, tailTip, paws);
    for (const side of [-1, 1]) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.1, 4), material(0xc9823f, fur));
        ear.position.set(0.33, 0.26, 0.2 + side * 0.09);
        ear.rotation.x = side * 0.25;
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.008, 0.02), material(0x3a2a20));
        eye.position.set(0.485, 0.15, 0.2 + side * 0.065);
        eye.rotation.y = Math.PI / 2;
        cat.add(ear, eye);
    }
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), material(0xd98a86));
    nose.position.set(0.5, 0.115, 0.2);
    cat.add(nose);
    cat.traverse(child => { child.castShadow = true; });
    ambientUpdates.push(now => {
        const breath = Math.sin(now * 0.0016);
        catBody.scale.set(1.15 + breath * 0.012, 0.62 + breath * 0.025, 0.95 + breath * 0.012);
        catHead.position.y = 0.13 + breath * 0.004;
    });

    // A wall clock that keeps the visitor's local time.
    const clock = new THREE.Group();
    clock.position.set(2.3, 2.6, -3.1);
    scene.add(clock);
    const clockRim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.035, 8, 32), material(0x8a6a4c, { roughness: 0.5, metalness: 0.1 }));
    clockRim.castShadow = true;
    clock.add(clockRim);
    const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.3, 32), material(0xf0e6cc));
    clockFace.position.z = -0.02;
    clockFace.receiveShadow = true;
    clock.add(clockFace);
    for (let i = 0; i < 12; i++) {
        const tick = new THREE.Mesh(new THREE.BoxGeometry(0.015, i % 3 ? 0.03 : 0.06, 0.01), material(0x3b4d40));
        const angle = i * Math.PI / 6;
        tick.position.set(Math.sin(angle) * 0.23, Math.cos(angle) * 0.23, -0.005);
        tick.rotation.z = -angle;
        clock.add(tick);
    }
    function clockHand(length, width, color, z) {
        const pivot = new THREE.Group();
        const hand = new THREE.Mesh(new THREE.BoxGeometry(width, length, 0.008), material(color));
        hand.position.y = length / 2 - length * 0.12;
        pivot.add(hand);
        pivot.position.z = z;
        clock.add(pivot);
        return pivot;
    }
    const hourHand = clockHand(0.15, 0.022, 0x3b4d40, 0.0);
    const minuteHand = clockHand(0.23, 0.015, 0x3b4d40, 0.01);
    const secondHand = clockHand(0.25, 0.006, 0xc9765e, 0.02);
    function updateClock() {
        const date = new Date();
        const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
        const minutes = date.getMinutes() + seconds / 60;
        const hours = date.getHours() % 12 + minutes / 60;
        hourHand.rotation.z = -hours * Math.PI / 6;
        minuteHand.rotation.z = -minutes * Math.PI / 30;
        secondHand.rotation.z = -Math.floor(seconds) * Math.PI / 30;
    }
    updateClock();
    ambientUpdates.push(updateClock);

    let transition = null;
    const hotspotHeights = { profile: 3.75, workbench: 2.4, arcade: 3.05, research: 2.3, library: 4.25 };
    const projected = new THREE.Vector3();
    function render() {
        renderer.render(scene, camera);
        if (hotspots.hidden || document.body.classList.contains('has-panel')) return;
        for (const marker of hotspots.querySelectorAll('[data-station]')) {
            const name = marker.dataset.station;
            stations[name].localToWorld(projected.set(0, hotspotHeights[name], 0));
            projected.project(camera);
            marker.hidden = projected.z < -1 || projected.z > 1 || Math.abs(projected.x) > 0.96 || Math.abs(projected.y) > 0.94;
            marker.style.left = `${(projected.x + 1) * 50}%`;
            marker.style.top = `${(1 - projected.y) * 50}%`;
        }
    }
    function resize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        const aspect = width / height;
        let halfHeight = Math.max(5.4, 6.5 / aspect);
        if (aspect < 0.8 && height < 700) halfHeight *= 1.15;
        camera.left = -halfHeight * aspect;
        camera.right = halfHeight * aspect;
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
        if (aspect < 0.8) camera.setViewOffset(width, height, 0, -height * (height < 700 ? 0.13 : 0.1), width, height);
        else camera.clearViewOffset();
        camera.updateProjectionMatrix();
        render();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    controls.addEventListener('change', render);
    controls.addEventListener('start', () => { transition = null; });

    focusStation = name => {
        const target = name ? new THREE.Vector3(stations[name].position.x, name === 'profile' || name === 'library' ? 2.4 : 1.2, stations[name].position.z) : new THREE.Vector3(0, 1.45, 0);
        const position = overview.clone().add(target);
        position.y -= 1.45;
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
    function stationAt(event) {
        const bounds = canvas.getBoundingClientRect();
        pointer.set((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(Object.values(stations), true)[0];
        if (!hit) return null;
        let object = hit.object;
        while (object.parent && object.parent !== scene) object = object.parent;
        return Object.keys(stations).find(key => stations[key] === object) || null;
    }
    function showHoveredStation(name) {
        canvas.classList.toggle('is-hover', Boolean(name));
        for (const marker of hotspots.querySelectorAll('[data-station]')) {
            marker.classList.toggle('is-hover', marker.dataset.station === name);
        }
    }
    canvas.addEventListener('pointermove', event => {
        if (event.pointerType === 'mouse' && event.buttons === 0) showHoveredStation(stationAt(event));
    });
    canvas.addEventListener('pointerleave', () => showHoveredStation(null));
    canvas.addEventListener('pointerdown', event => { pointerStart = { x: event.clientX, y: event.clientY }; });
    canvas.addEventListener('pointerup', event => {
        if (!pointerStart || Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) return;
        const name = stationAt(event);
        if (name) selectStation(name);
    });
    let contextLost = false;
    const arcadePanel = document.getElementById('arcade-panel');
    function ambientPaused() {
        return document.hidden || reducedMotion.matches || contextLost || (document.body.classList.contains('has-panel') && arcadePanel.hidden);
    }
    canvas.addEventListener('webglcontextlost', event => {
        event.preventDefault();
        contextLost = true;
        transition = null;
        syncAmbient();
        hotspots.hidden = true;
        resetView.hidden = true;
        canvas.classList.remove('is-ready');
        status.hidden = false;
        status.textContent = 'The 3D view was interrupted. You can still explore using the station links.';
    });
    let ambientFrame = 0;
    let lastAmbientRender = 0;
    let lastScreenFrame = 0;
    function animateAmbient(now) {
        ambientFrame = 0;
        if (ambientPaused()) return;
        if (now - lastAmbientRender >= 42) {
            sculpture.rotation.y = now * 0.00025;
            for (const update of ambientUpdates) update(now);
            if (now - lastScreenFrame >= 100) {
                drawArcadeScreen(arcadeScreenContext, now);
                arcadeScreenTexture.needsUpdate = true;
                lastScreenFrame = now;
            }
            lastAmbientRender = now;
            render();
        }
        if (!ambientPaused()) ambientFrame = requestAnimationFrame(animateAmbient);
    }
    function syncAmbient() {
        if (ambientPaused()) {
            cancelAnimationFrame(ambientFrame);
            ambientFrame = 0;
        } else if (!ambientFrame) ambientFrame = requestAnimationFrame(animateAmbient);
    }
    document.addEventListener('visibilitychange', syncAmbient);
    reducedMotion.addEventListener('change', syncAmbient);
    updateMotion = syncAmbient;
    resize();
    canvas.classList.add('is-ready');
    status.hidden = true;
    hotspots.hidden = false;
    resetView.hidden = false;
    render();
    const activePanel = panels.find(panel => !panel.hidden);
    if (activePanel && activePanel.id !== 'post-panel') focusStation(activePanel.id.replace(/-panel$/, ''));
    syncAmbient();
} catch (error) {
    console.error('Unable to start the 3D workshop:', error);
    status.textContent = 'The 3D view could not be loaded. You can still explore using the station links.';
    document.getElementById('workshop-hint').textContent = 'CHOOSE A STATION TO EXPLORE';
}
