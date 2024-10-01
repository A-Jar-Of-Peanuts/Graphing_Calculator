import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ptree from "./CAS.js";


document.getElementById("sub4D").addEventListener('click', submit4D)

var width = 500;
var height = 500;
var w = -2;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( width, height );
document.getElementById("four").insertBefore(renderer.domElement, document.getElementById("four").children[1]);

var clock = new THREE.Clock();
clock.start();
var hasEquation = false;
var equation;
var lastTime = 0;

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
    if (hasEquation && (clock.getElapsedTime()-lastTime) >= .3) {
        lastTime = clock.elapsedTime;
        w+=1;
        graph(equation);
    }
    controls.update();
	renderer.render( scene, camera );
}

function clear() {
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    axes();
}

function submit4D() {
    var x = document.getElementById("eq4D");
    w = -2;
    hasEquation = true;
    equation = x;
    graph(x);
}

// graph function
function graph(eq) {
    clear();
    var vertices = [];

    for(var i = -10; i<=10; i+=.3) {
        for (var j = -10; j<= 10; j+=.3) {
            for(var z = -20; z<=20; z+=.3) {
                var result = parse(eq.value, i, j, z);
                if (Math.abs(result-w)<=0.05) {
                    vertices.push(i,z,j);
                }
            }
        }
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    var material = new THREE.MeshBasicMaterial( { color: 0xFFA500 } );
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
function parse(eq, val, valy, valz) {
    var str = eq;
    str = str.replaceAll(/ /g,'')
    str = str.replaceAll('sin', '1s');
    str = str.replaceAll('cos', '1c');
    str = str.replaceAll('tan', '1t');
    str = str.replaceAll('ln', '1l');
    str = str.replaceAll('pi', 'p');
    var l = compute(str, val, valy, valz, 10);

    try {
        return l[0];
    } catch (e) {
        return NaN;
    }
}

// handling parentheses and individual numbers
function atomCalc(eq, val, valy, valz, lhs) {  
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
    }else if (eq.charAt(0) == 'z') {
        lhs = parseFloat(valz);
        eq = eq.substring(1);
    } else if (!isNaN(eq.charAt(0)) || eq.charAt(0) == '.') {
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
        var result = compute(eq, val, valy, valz, 10);
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

function compute(eq, val, valy, valz, min_prec) {
    var ans = atomCalc(eq, val, valy, valz, 0);
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

        var result = compute(eq.substring(1), val, valy, valz, next_min_prec);
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

