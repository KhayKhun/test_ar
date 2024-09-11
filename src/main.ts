import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'dat.gui';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, stats: Stats, gui: GUI;
const models: THREE.Object3D[] = [];
const arButton: HTMLButtonElement = document.getElementById('enter-ar') as HTMLButtonElement;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 9.3;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    arButton.addEventListener('click', enterAR);

    window.addEventListener('resize', onWindowResize);

    new OrbitControls(camera, renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 5); // soft white light
    scene.add(light);

    loadGLTFModel();

    stats = new Stats();
    document.body.appendChild(stats.dom);

    gui = new GUI();
    setupGUI();

    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function loadGLTFModel() {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('http://localhost:5173/src/assets/untitled.glb', (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        models.push(model);
        scene.add(model);
    }, undefined, (error) => {
        console.error('An error occurred while loading the GLTF file:', error);
    });
}

function setupGUI() {
    const cubeFolder = gui.addFolder('Cube');
    // Add rotation controls if needed
    cubeFolder.open();

    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera.position, 'z', 0, 20);
    cameraFolder.open();
}

async function enterAR() {
  // Check if WebXR is supported
  if (!navigator.xr) {
      alert("WebXR not supported in this browser.");
      return;
  }

  const session = renderer.xr.getSession();

  if (session) {
      // If a session exists, end it
      await session.end();
  } else {
      // If no session exists, request a new AR session
      try {
          const newSession = await navigator.xr.requestSession('immersive-ar');
          renderer.xr.setSession(newSession);
      } catch (error) {
          alert("Failed to start AR session:");
          console.log(error)
      }
  }
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    // Update your models or camera here if needed
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.render(scene, camera);
    stats.update();
}

init();