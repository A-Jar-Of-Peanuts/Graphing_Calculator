import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


document.getElementById("sub3D").addEventListener('click', submit3D)

var width = 500;
var height = 500;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
document.getElementById("three").insertBefore(renderer.domElement, document.getElementById("three").children[1]);

var VIEW_ANGLE = 45;
var ASPECT = width / height;
var NEAR = 0.1;
var FAR = 10000;
var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
const controls = new OrbitControls( camera, renderer.domElement );


camera.up.set(0, 1, 0);
controls.update();

camera.lookAt(0, 0, 0);
controls.update();

camera.position.z = 200;
controls.update();

camera.position.y = 25;
controls.update();


camera.position.x = 25;
controls.update();
//controls.autoRotate = true;

scene.add(camera);

function axes() {

    const axesHelper = new THREE.AxesHelper( 10000 );
    scene.add( axesHelper );
}

function animate() {
	requestAnimationFrame( animate );

    controls.update();
	renderer.render( scene, camera );
}

function clear() {
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    axes();
}

function submit3D() {
    var x = document.getElementById("eq3D");
    graph(x);
}

// graph function
// function graph(eq) {
//     clear();
//     var vertices = [];

// //     for ( var i = -10; i<=10; i+=.05) {
        
// //         for (var j = -10; j<= 10; j+=.05) {
// //             var x = i;
// //             var y = j;
// //             var z = parse(eq.value, x, y);
// //             vertices.push( x, z, y );

// // //             const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// // //             const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// // //             const mesh = new THREE.Mesh( geometry, material );
// // // scene.add( mesh );

// //         }
// //     }

// for ( var i = -50; i<=50; i+=1) {
        
//     for (var j = -50; j<= 50; j+=1) {
//         var x = i;
//         var y = j;
//         var z = parse(eq.value, x, y);
//         vertices.push( x, z, y );
//     }
// }

//     var geometry = new THREE.BufferGeometry();
//     geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
//     var material = new THREE.MeshBasicMaterial( { color: 0xFFA500 } );
//     var points = new THREE.Points( geometry, material );
//     scene.add( points );
// }

function graph(eq) {
    clear();
    var vertices = [];

    for ( var i = -10; i<=10; i+=.05) {

        for (var j = -10; j<= 10; j+=.05) {
            var x = i;
            var y = j;
            var z = parse(eq.value, x, y);
            vertices.push( x, z, y );
        }
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    var material = new THREE.PointsMaterial( { color: 0x888888 } );
    var points = new THREE.Points( geometry, material );
    scene.add( points );
}

const pemdas = new Map();

pemdas.set('l', -3);
pemdas.set('t', -2);
pemdas.set('c', -1);
pemdas.set('s', 0);
pemdas.set('(', 1);
pemdas.set(')', 2);
pemdas.set('^', 3);
pemdas.set('*', 4);
pemdas.set('/', 5);
pemdas.set('+', 6);
pemdas.set('-', 7);

// parse equation
function parse(eq, val, valy) {
    var str = eq;
    str = str.replaceAll(/ /g,'')
    str = str.replaceAll('sin', '1s');
    str = str.replaceAll('cos', '1c');
    str = str.replaceAll('tan', '1t');
    str = str.replaceAll('ln', '1l');
    str = str.replaceAll('pi', 'p');
    var l = compute(str, val, valy, 10);

    try {
        return l[0];
    } catch (e) {
        return NaN;
    }
}

// handling parentheses and individual numbers
function atomCalc(eq, val, valy, lhs) {  
    if (!eq.length) {
        return [lhs, eq];
    }

    var cur = eq.charAt(0);  
    if (!(cur != '+' && cur != '-' && cur != '*' && cur != '/' && cur != '^' && cur != 's'
    && cur != 'c' && cur != 't' && cur != 'l')) {
        return [lhs, eq];
    }

    if (eq.charAt(0) == 'x') {
        lhs = parseFloat(val);
        eq = eq.substring(1);
    } else if (eq.charAt(0) == 'y') {
        lhs = parseFloat(valy);
        eq = eq.substring(1);
    }else if (!isNaN(eq.charAt(0)) || eq.charAt(0) == '.') {
        var atom = "";
        cur = eq.charAt(0);
        while((!isNaN(eq.charAt(0)) || eq.charAt(0) == '.') && eq.length) {
            atom += cur;
            eq = eq.substring(1);
            cur = eq.charAt(0);
        }
        lhs = parseFloat(atom);
    } else if (eq.charAt(0) == '(') {
        eq = eq.substring(1);
        var result = compute(eq, val, valy, 10);
        eq = result[1].substring(1);
        lhs = result[0];
    
    } else if (eq.charAt(0) == 'e'){
        lhs = Math.E;
        eq = eq.substring(1);
    }  else if (eq.charAt(0) == 'p') {
        lhs = Math.PI;
        eq = eq.substring(1);
    }

    //atomCalc(eq, val, lhs);
    return [lhs, eq];
}

function compute(eq, val, valy, min_prec) {
    var ans = atomCalc(eq, val, valy, 0);
    var lhs = ans[0];
    eq = ans[1];
    var rhs = 0;

    while(eq.length) {
        var cur = eq.charAt(0);

        if (cur != '+' && cur != '-' && cur != '*' && cur != '/' && cur != '^' && cur != 's'
        && cur != 'c' && cur != 't' && cur != 'l') {
            break;
        }

        if (pemdas.get(cur) > min_prec) {
            break;
        }

        var next_min_prec = pemdas.get(cur);

        var result = compute(eq.substring(1), val, valy, next_min_prec);
        rhs = result[0];
        eq = result[1];
        lhs = singleOp(lhs, rhs, cur);
    }

    return [lhs, eq];
}

function singleOp(lhs, rhs, op) {
    switch(op) {
        case '+':
            return parseFloat(lhs) + parseFloat(rhs);
            break;
        case '-':
            return parseFloat(lhs) - parseFloat(rhs);
            break;
        case '*':
            return parseFloat(lhs) * parseFloat(rhs);
            break;
        case '/':
            return parseFloat(lhs) / parseFloat(rhs);
            break;
        case '^':
            return Math.pow(lhs, rhs);
            break;
        case 's':
            return Math.sin(rhs);
            break;
        case 'c':
            return Math.cos(rhs);
            break;
        case 't':
            return Math.tan(rhs);
            break;
        case 'l':
            return Math.log(rhs);
            break;
    }
}

axes();
renderer.render( scene, camera );
animate()

