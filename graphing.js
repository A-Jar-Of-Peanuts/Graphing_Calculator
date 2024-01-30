var width = 500;
var height = 500;


var c = document.getElementById("myCanvas");
c.width = width;
c.height = height;

var ctx = c.getContext("2d");

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
    var x = document.getElementById("eq");
    graph(eq);
    //onsole.log(x.value);
}

function graph(eq) {
    clear();
    var x = 0;
    var y = 0;
    var scale = 5;
    ctx.moveTo(0,0);
    for (var i = -width/2; i<=width/2; i+=1) {
        x = i;
        y = parse(eq, i);
        if (isNaN(y) || !isFinite(y)) {
            console.log("NAN");
            for(var j = i-1; j <= i-0.01; j+=0.01) {
                var temp = parse(eq, j)
                ctx.lineTo(convertX(scale*j), convertY(scale*temp));
                if (convertY(scale*temp) > height) {
                    break;
                }
            }
            ctx.moveTo(convertX(scale*i+0.01), convertY(scale*parse(eq, i+0.01)))
            for(var j = i+0.01; j <= i+1; j+=0.01) {
                var temp = parse(eq, j)
                ctx.lineTo(convertX(scale*j), convertY(scale*temp));
                if (convertY(scale*temp) > height) {
                    break;
                }
            }
            x = i+1;
            y = parse(eq, i+1);
        }
        //console.log(x + " " + y);
        if (y <= height/2) {
            ctx.lineTo(convertX(scale*x), convertY(scale*y));
        }
    }
    ctx.stroke();
}

const pemdas = new Map();

pemdas.set('(', 1);
pemdas.set(')', 2);
pemdas.set('^', 3);
pemdas.set('*', 4);
pemdas.set('/', 5);
pemdas.set('+', 6);
pemdas.set('-', 7);

function parse(eq, val) {
    var str = eq.value;
    var str = str.replace("sin", "s");
    var l = compute(eq.value, val, -10);

    try {
        return l;
    } catch (e) {
        return NaN;
    }
}

function compute(eq, val, min_prec) {
    var lhs = 0;
    if (eq.charAt(0) == 'x') {
        lhs = parseInt(val);
        eq = eq.substring(1);
    } else if (!isNaN(eq.charAt(0))) {
        lhs = parseInt(eq.charAt(0));
        eq = eq.substring(1);
    } else if (eq.charAt(0) == '(') {
        var atom = "";
        eq = eq.substring(1);
        cur = eq.charAt(0);
        while(cur!=')') {
            atom += cur;
            eq = eq.substring(1);
            cur = eq.charAt(0);
        }
        eq = eq.substring(1);
        lhs = compute(atom, val, -10);
        console.log(lhs);
    
    } else if (eq.charAt(0) == 'e'){
        lhs = Math.E;
        console.log(lhs);
        eq = eq.substring(1);
    } else if (eq.charAt(0) == 's') {
        eq = eq.substring(1);
        lhs = Math.sin()
    }

    if (eq.length) {
        for (var i = 0; i<eq.length; i++) {
            var cur = eq.charAt(i);
            if (cur != '+' && cur != '-' && cur != '*' && cur != '/' && cur != '^' && cur != 's') {
                break;
            }
            if (pemdas.get(cur) < min_prec) {
                break;
            }
            
            next_min_prec = pemdas.get(cur);
            var rhs = compute(eq.substring(1), val, next_min_prec);
            lhs = singleOp(lhs, rhs, cur);
        }
    }
    return lhs;
}

function singleOp(lhs, rhs, op) {
    switch(op) {
        case '+':
            return parseInt(lhs) + parseInt(rhs);
            break;
        case '-':
            return parseInt(lhs) - parseInt(rhs);
            break;
        case '*':
            return parseInt(lhs) * parseInt(rhs);
            break;
        case '/':
            return parseInt(lhs) / parseInt(rhs);
            break;
        case '^':
            return Math.pow(lhs, rhs);
            break;
    }
}