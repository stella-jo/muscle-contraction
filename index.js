import * as THREE from 'three';
import WebGPURenderer from 'three/addons/renderers/webgpu/WebGPURenderer';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
// scene.background = new THREE.Color("black");

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new WebGPURenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

let contraction = 1;
let actin1, actin2, myosin1, myosin2;

loader.load('/src/myosin.gltf', gltf => {
	scene.add(gltf.scene);
	gltf.scene.position.set(0, 0, 0);
});

loader.load('/src/actin.gltf', gltf => {
	actin1 = gltf.scene;
	scene.add(actin1);
	actin1.position.set(5, 0, 0);
});

loader.load('/src/actin.gltf', gltf => {
	actin2 = gltf.scene;
	scene.add(actin2);
	actin2.position.set(-5, 0, 0);
});

loader.load('/src/myosin.gltf', gltf => {
	myosin1 = gltf.scene;
	scene.add(myosin1);
	myosin1.position.set(10, 0, 0);
});

loader.load('/src/myosin.gltf', gltf => {
	myosin2 = gltf.scene;
	scene.add(myosin2);
	myosin2.position.set(-10, 0, 0);
});

const slider = document.querySelector("#contraction");
slider.addEventListener("input", (input) => {
	contraction = 0.01*input.target.value;
	actin1.position.set(2*contraction+3, 0, 0);
	actin2.position.set(-2*contraction-3, 0, 0);
	myosin1.position.set(4*contraction+6, 0, 0);
	myosin2.position.set(-4*contraction-6, 0, 0);
})

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2.5);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 1.5);
directionalLight1.position.set(2, 5, 4);
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 1.5);
directionalLight2.position.set(-2, 5, -4);
scene.add(directionalLight2);

// const helper = new THREE.DirectionalLightHelper(directionalLight1);
// scene.add(helper);

// const helper2 = new THREE.DirectionalLightHelper(directionalLight2);
// scene.add(helper2);

// const axes = new THREE.AxesHelper(10);
// scene.add(axes);

camera.position.z = 15;

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
})

function animate() {
	requestAnimationFrame(animate);
	renderer.renderAsync(scene, camera);
}
animate();