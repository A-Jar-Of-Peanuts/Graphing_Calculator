// var c = document.getElementById("3d");
// var webgl = c.getContext('webgl')

// c.width = width;
// c.height = height;

// var ctx = c.getContext("2d");

// function initWebGL(webgl, vortexes) {
//     var vertexBuffer = webgl.createBuffer();

//     webgl.bindBuffer(webgl.ARRAY_BUFFER, vertexBuffer);

//     webgl.bufferData(
//         webgl.ARRAY_BUFFER,
//         new Float32Array(vortexes),
//         webgl.STATIC_DRAW
//     );

//     webgl.clearColor(0, 0.5, 0.5, 0.9);

//     webgl.clear(webgl.COLOR_BUFFER_BIT);
// }

// function drawArrays(webgl) {
//     webgl.drawArrays(webgl.TRIANGLES, 0, 3);
// }

// var vortexes = [
//     0.8, 0.0,
//     0.0, 1,
//     1, 0.8
// ];
 
// initWebGL(webgl, vortexes);
 
// // var vertexShader = createVertexShader();
// // var fragmentShader = createFragmentShader();

// // var shaderProgram = createShaderProgram(webgl, vertexShader, fragmentShader);

// // transformCoordinatesAndSet(webgl, shaderProgram);

// drawArrays(webgl);