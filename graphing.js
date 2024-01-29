var width = 500;
var height = 500;


var c = document.getElementById("myCanvas");
c.width = width;
c.height = height;

var ctx = c.getContext("2d");
ctx.beginPath();
ctx.moveTo(0, height/2);
ctx.lineTo(width, height/2);
ctx.moveTo(width/2, 0);
ctx.lineTo(width/2, height);
ctx.stroke();

function convertX(x) {
    return (x + width/2);
}
function convertY(y) {
    return (-y + height/2);
}
function submit() {
    var x = document.getElementById("eq");
    graph(eq);
    console.log(x.value);
}

function graph(eq) {
    var x = 0;
    var y = 0;
    var scale = 5
    ctx.moveTo(0,0);
    for (var i = -width/2; i<=width/2; i++) {
        x = i;
        y = Math.pow(Math.E, i);
        if (y <= height/2) {
            //console.log(x + " " + y);
            ctx.lineTo(convertX(scale*x), convertY(scale*y));
        }
    }
    ctx.stroke();
}

function parse(eq) {
    
}
