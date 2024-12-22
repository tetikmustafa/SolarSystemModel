import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Renderer kurulumu
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sahne ve kamera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(-90, 140, 140);

// OrbitControls (Fare ile gezdirme)
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Arkaplan Yıldızlar
const textureLoader = new THREE.TextureLoader();

const backgroundTexture = textureLoader.load('./src/img/stars.jpg');
scene.background = backgroundTexture;


backgroundTexture.wrapS = THREE.RepeatWrapping;
backgroundTexture.wrapT = THREE.RepeatWrapping;
backgroundTexture.repeat.set(2, 2);  // Tekrar sayısını ayarlar


// Güneş
const sunGeo = new THREE.SphereGeometry(12, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load('./src/img/sun.jpg')
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Gezegen Oluşturma Fonksiyonu
function createPlanet(size, texture, position) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const planet = new THREE.Mesh(geo, mat);
    planet.position.x = position;
    scene.add(planet);
    return planet;
}

// Işık Kaynakları

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);


// Gezegenler
const mercury = createPlanet(3, './src/img/mercury.jpg', 20);
const venus = createPlanet(5, './src/img/venus.jpg', 40);
const earth = createPlanet(6, './src/img/earth.jpg', 60);
const mars = createPlanet(4, './src/img/mars.jpg', 80);
const jupiter = createPlanet(10, './src/img/jupiter.jpg', 100);
const saturn = createPlanet(9, './src/img/saturn.jpg', 120);
const uranus = createPlanet(7, './src/img/uranus.jpg', 140);
const neptune = createPlanet(7, './src/img/neptune.jpg', 160);

// Pivotlar (Yörüngesel Dönüş İçin)
const mercuryPivot = new THREE.Object3D();
const venusPivot = new THREE.Object3D();
const earthPivot = new THREE.Object3D();
const marsPivot = new THREE.Object3D();
const jupiterPivot = new THREE.Object3D();
const saturnPivot = new THREE.Object3D();
const uranusPivot = new THREE.Object3D();
const neptunePivot = new THREE.Object3D();

// Pivotları Güneş'e ekleme
sun.add(mercuryPivot);
sun.add(venusPivot);
sun.add(earthPivot);
sun.add(marsPivot);
sun.add(jupiterPivot);
sun.add(saturnPivot);
sun.add(uranusPivot);
sun.add(neptunePivot);

// Gezegenleri pivotlara ekle
mercuryPivot.add(mercury);
venusPivot.add(venus);
earthPivot.add(earth);
marsPivot.add(mars);
jupiterPivot.add(jupiter);
saturnPivot.add(saturn);
uranusPivot.add(uranus);
neptunePivot.add(neptune);

// Gezegenleri konumlandır (Güneşten uzaklaştır)
mercury.position.set(30, 0, 0);
venus.position.set(60, 0, 0);
earth.position.set(90, 0, 0);
mars.position.set(120, 0, 0);
jupiter.position.set(150, 0, 0);
saturn.position.set(180, 0, 0);
uranus.position.set(210, 0, 0);
neptune.position.set(240, 0, 0);

// Ay (Moon) Pivot ve Ay
const moonPivot = new THREE.Object3D();
earthPivot.add(moonPivot);  // Ay'ı Dünya'nın pivotuna ekle

const moon = createPlanet(1.6, './src/img/moon.jpg', 10);  // Ayı oluştur
moonPivot.add(moon);  // Ay'ı pivotun içine ekle
moon.position.set(10, 0, 0);  // Ay'ı Dünya'nın yanına yerleştir

earth.add(moonPivot);  // Ay'ı Dünya'ya ekle

// Halka Ekleme
const ringGeo = new THREE.RingGeometry(10, 20, 32);
const ringMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./src/img/saturn_ring.png'),
    side: THREE.DoubleSide,
    transparent: true
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = -0.5 * Math.PI;
scene.add(ring);
ring.position.x = 0;

saturn.add(ring);

// Animasyon
function animate() {
    sun.rotateY(0.002);  // Güneş kendi etrafında döner
    
    // Gezegenler kendi eksenlerinde döner
    mercury.rotateY(0.004);
    venus.rotateY(0.003);
    earth.rotateY(0.002);
    mars.rotateY(0.0025);
    moon.rotateY(0.005);  // Ay kendi etrafında döner
    jupiter.rotateY(0.001);
    saturn.rotateY(0.0005);
    uranus.rotateY(0.0003);
    neptune.rotateY(0.0002);

    // Pivotlar (Güneş etrafında yörünge hareketi)
    mercuryPivot.rotateY(0.01);
    venusPivot.rotateY(0.008);
    earthPivot.rotateY(0.005);
    marsPivot.rotateY(0.004);
    jupiterPivot.rotateY(0.002);
    saturnPivot.rotateY(0.001);
    uranusPivot.rotateY(0.0007);
    neptunePivot.rotateY(0.0005);

    // Ay Dünya etrafında döner
    moonPivot.rotateY(0.03);

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Ekran Yeniden Boyutlandırma
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
