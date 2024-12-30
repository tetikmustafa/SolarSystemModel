import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Renderer kurulumu
const renderer = new THREE.WebGLRenderer({alpha:true}); //renderer oluşturduk
renderer.setSize(window.innerWidth, window.innerHeight); //boyutunu ayarladık
document.body.appendChild(renderer.domElement); //html'e ekledik

// Sahne ve kamera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    5000 // Far clipping distance artırıldı
);
camera.position.set(-90, 140, 1000); // Kamera daha uzağa konumlandırıldı

// OrbitControls (Fare ile gezdirme)
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Işık Kaynakları
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Güneş
const sunGeo = new THREE.SphereGeometry(16, 32, 32);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load('./src/img/sun.jpg')
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Gezegen Oluşturma Fonksiyonu
function createPlanet(size, texture, position, axialTilt) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const planet = new THREE.Mesh(geo, mat);
    planet.position.x = position;
    planet.rotation.z = THREE.MathUtils.degToRad(axialTilt); // Eksen eğikliği
    scene.add(planet);
    return planet;
}

// Gezegenler
const mercury = createPlanet(0.38, './src/img/mercury.jpg', 12, 0.034);
const venus = createPlanet(0.95, './src/img/venus.jpg', 22, 177.4);
const earth = createPlanet(1, './src/img/earth.jpg', 30, 23.5);
const mars = createPlanet(0.53, './src/img/mars.jpg', 45, 25.2);
const jupiter = createPlanet(11.2, './src/img/jupiter.jpg', 156, 3.1);
const saturn = createPlanet(9.45, './src/img/saturn.jpg', 286, 26.7);
const uranus = createPlanet(4.0, './src/img/uranus.jpg', 576, 97.8);
const neptune = createPlanet(3.88, './src/img/neptune.jpg', 900, 28.3);

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
mercury.position.set(22, 0, 0);
venus.position.set(32, 0, 0);
earth.position.set(40, 0, 0);
mars.position.set(55, 0, 0);
jupiter.position.set(166, 0, 0);
saturn.position.set(296, 0, 0);
uranus.position.set(586, 0, 0);
neptune.position.set(910, 0, 0);

/// Ay için yörünge çizgisi oluşturma
const moonOrbitRadius = 5; // Ay yörünge yarıçapı
const moonOrbitCurve = new THREE.EllipseCurve(
    0, 0, // Dünya'nın merkezi
    moonOrbitRadius, moonOrbitRadius*.9970, // Elips yarıçapları (daire için aynı)
    0, 2 * Math.PI, // Başlangıç ve bitiş açıları
    false // Saat yönünde çizim
);

const moonOrbitPoints = moonOrbitCurve.getPoints(100); // Yörünge üzerinde 100 nokta
const moonOrbitGeometry = new THREE.BufferGeometry().setFromPoints(
    moonOrbitPoints.map((p) => new THREE.Vector3(p.x, 0, p.y)) // Y'yi XZ düzlemine taşı
);

const moonOrbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const moonOrbitLine = new THREE.Line(moonOrbitGeometry, moonOrbitMaterial);
earth.add(moonOrbitLine); // Yörüngeyi Dünya'ya ekler

// Ay (Moon) Pivot ve Ay
const moonPivot = new THREE.Object3D();
earthPivot.add(moonPivot);

const moon = createPlanet(0.27, './src/img/moon.jpg', moonOrbitRadius, 6.68); // Ay eksen eğikliği 6.68°
moonPivot.add(moon);

earth.add(moon); // Ay'ı Dünya'ya ekle

// Halka Ekleme
const ringGeo = new THREE.RingGeometry(9, 15, 64);
const ringMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load('./src/img/saturn_ring.png'),
    side: THREE.DoubleSide,
    transparent: true
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = -0.5 * Math.PI;
saturn.add(ring);


// Gezegenleri ve isimlerini saklayan bir liste
const planets = [
    { name: 'Mercury', object: mercury },
    { name: 'Venus', object: venus },
    { name: 'Earth', object: earth },
    { name: 'Mars', object: mars },
    { name: 'Jupiter', object: jupiter },
    { name: 'Saturn', object: saturn },
    { name: 'Uranus', object: uranus },
    { name: 'Neptune', object: neptune },
];

// Gezegenlerin dünya koordinatındaki pozisyonlarını konsola yazdıran fonksiyon
function logPlanetPositions() {
    console.clear(); // Konsolu temizler
    planets.forEach(({ name, object }) => {
        const worldPosition = new THREE.Vector3();
        object.getWorldPosition(worldPosition); // Dünya pozisyonunu al
        console.log(`${name}: x=${worldPosition.x.toFixed(2)}, y=${worldPosition.y.toFixed(2)}, z=${worldPosition.z.toFixed(2)}`);
    });
}

// İzleri saklayan bir nesne
const trails = {};

// İz bırakma için kullanılan malzeme ve geometri
const trailMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const maxTrailLength = 300; // Maksimum iz uzunluğu

// Gezegenler için iz nesnelerini oluşturma
planets.forEach(({ name }) => {
    trails[name] = {
        positions: [], // İzlerin pozisyonlarını saklar
        line: new THREE.Line(
            new THREE.BufferGeometry(),
            trailMaterial.clone() // Her gezegen için farklı bir malzeme
        ),
    };
    scene.add(trails[name].line); // İzi sahneye ekle
});

// İzleri güncelleyen fonksiyon
function updateTrails() {
    planets.forEach(({ name, object }) => {
        const worldPosition = new THREE.Vector3();
        object.getWorldPosition(worldPosition); // Gezegenin global pozisyonunu al

        // Pozisyonu kaydet
        trails[name].positions.push(worldPosition.clone());

        // Eğer pozisyon sayısı maksimum uzunluğu aşarsa, eski pozisyonları sil
        if (trails[name].positions.length > maxTrailLength) {
            trails[name].positions.shift();
        }

        // İzi güncelle
        const trailPositions = new Float32Array(
            trails[name].positions.flatMap((pos) => [pos.x, pos.y, pos.z])
        );
        trails[name].line.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(trailPositions, 3)
        );
        trails[name].line.geometry.setDrawRange(0, trails[name].positions.length);
        trails[name].line.geometry.computeBoundingSphere();
    });
}

const planetPivots = [mercuryPivot, venusPivot, earthPivot, marsPivot, jupiterPivot, saturnPivot, uranusPivot, neptunePivot];
const planetObjects = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
const planetOrbitRadius = [22, 32, 40, 55, 166, 296, 586, 910];
const planetOrbitRatios = [
    0.9787,  // Mercury
    0.99997, // Venus
    0.99986, // Earth
    0.9958,  // Mars
    0.9976,  // Jupiter
    0.9973,  // Saturn
    0.9980,  // Uranus
    0.99998  // Neptune
];

planetObjects.forEach((planet, index) => {
    const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        planetOrbitRadius[index],
        planetOrbitRadius[index] * planetOrbitRatios[index],
        0, 2 * Math.PI,
        false
    );

    const orbitPoints = orbitCurve.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
        orbitPoints.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );

    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    sun.add(orbitLine);
});

// Animasyon
function animate() {
    sun.rotateY(0.002);

    mercury.rotateY(0.004);
    venus.rotateY(0.003);
    earth.rotateY(0.002);
    mars.rotateY(0.0025);
    moon.rotateY(0.005);
    jupiter.rotateY(0.001);
    saturn.rotateY(0.0005);
    uranus.rotateY(0.0003);
    neptune.rotateY(0.0002);

    mercuryPivot.rotateY(0.015);
    venusPivot.rotateY(0.012);
    earthPivot.rotateY(0.01);
    marsPivot.rotateY(0.008);
    jupiterPivot.rotateY(0.004);
    saturnPivot.rotateY(0.002);
    uranusPivot.rotateY(0.001);
    neptunePivot.rotateY(0.0008);

    moonPivot.rotateY(0.03);

    // updateTrails(); // İzleri güncelle

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Kamera için bir pivot oluştur
const cameraPivot = new THREE.Object3D();
scene.add(cameraPivot);
cameraPivot.add(camera);

// Kamera ve kontrol hedefini ayarlayan bir fonksiyon
function setCameraTarget(targetObject) {
    const targetPosition = new THREE.Vector3();
    targetObject.getWorldPosition(targetPosition);

    // Kamera pivotunu hedefin pozisyonuna taşı
    cameraPivot.position.copy(targetPosition);

    // OrbitControls hedefini güncelle
    orbit.target.copy(targetPosition);
    orbit.update();
}

// Kamera hedeflerini klavye tuşlarıyla değiştirme
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case '1': setCameraTarget(sun); break;
        case '2': setCameraTarget(mercury); break;
        case '3': setCameraTarget(venus); break;
        case '4': setCameraTarget(earth); break;
        case '5': setCameraTarget(mars); break;
        case '6': setCameraTarget(jupiter); break;
        case '7': setCameraTarget(saturn); break;
        case '8': setCameraTarget(uranus); break;
        case '9': setCameraTarget(neptune); break;
        default: break;
    }
});

// Klavye girişlerini dinleyen fonksiyon
window.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'l') { // "L" tuşu için kontrol
        logPlanetPositions();
    }
});

// Ekran Yeniden Boyutlandırma
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
