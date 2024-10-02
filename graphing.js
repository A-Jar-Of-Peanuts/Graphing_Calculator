// TODO: refactor code to make it more readable, also make it more interactive
const width = 500;
const height = 500;


const c = document.getElementById("myCanvas");
c.width = width;
c.height = height;

const ctx = c.getContext("2d");

// axes
ctx.beginPath();
ctx.moveTo(0, height/2);
ctx.lineTo(width, height/2);
ctx.moveTo(width/2, 0);
ctx.lineTo(width/2, height);
ctx.stroke();

// clear and draw axes
function clear() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, height/2);
    ctx.lineTo(width, height/2);
    ctx.moveTo(width/2, 0);
    ctx.lineTo(width/2, height);
    ctx.stroke();
}

// convert cartesian coords to screen coords
function convertX(x) {
    return (x + width/2);
}
function convertY(y) {
    return (-y + height/2);
}
function submit() {
    const x = document.getElementById("eq");
    const equation = "y = " + x.value;
    console.log(equation);
    graph(equation);
}

// graph function
// TODO: fix the graphing logic cuz it kinda sucks
function graph(equation) {
    clear();
    let x = 0;
    let y = 0;
    const scale = 10;
    let pdev = 0;
    let curdev = 0;
    ctx.moveTo(0,0);
    const eqLambda = getEquation(equation);
    for (var i = -width/2; i<=width/2; i+=.001) {
        x = i;
        y = eqLambda({x: i});
        nextX = i+=0.01;
        nextY = eqLambda({x: nextX});

        curdev = (nextY - y)/(nextX- x);
        if (pdev * curdev >= 0) {
            if (y <= height/2) {
                ctx.lineTo(convertX(scale*x), convertY(scale*y));
            }
        } else {
            ctx.moveTo(convertX(scale*(x+.1)), convertY(scale*(eqLambda({x: x+0.1}))));
        }
        pdev = curdev;
        px = x;
        py = y;
    }
    ctx.stroke();
}