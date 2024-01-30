import * as THREE from 'three';

var width = 500;
var height = 500;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
document.getElementById("three").insertBefore(renderer.domElement, document.getElementById("three").children[1]);

//camera.up.set(0,0,1);
camera.position.z = 100;
camera.position.x = 100;
 camera.position.y = 20;
camera.rotation.z += THREE.MathUtils.degToRad(0);
camera.rotation.y += THREE.MathUtils.degToRad(20);
camera.rotation.x += THREE.MathUtils.degToRad(10);


const vertices = [];

for ( var i = -20; i<=10; i+=.1) {
	
    for (var j = -10; j<= 10; j+=.1) {
        var x = i;
        var y = j;
        var z = x*x;
        //var z = y*y;
        vertices.push( x, y, z );
    }
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
const material = new THREE.PointsMaterial( { color: 0x888888 } );
const points = new THREE.Points( geometry, material );
scene.add( points );

function axes() {

    const axesHelper = new THREE.AxesHelper( 50 );
    scene.add( axesHelper );
}

function animate() {
	requestAnimationFrame( animate );

    camera.rotation.x += .004;
    camera.rotation.y += .004;
    camera.rotation.z += .004;

	renderer.render( scene, camera );
}

axes();
renderer.render( scene, camera );
//animate()