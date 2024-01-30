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
}

// graph function
function graph(eq) {
    clear();
    var x = 0;
    var y = 0;
    var scale = 70;
    var pdev = 0;
    var curdev = 0;
    ctx.moveTo(0,0);
    for (var i = -width/2; i<=width/2; i+=.1) {
        x = i;
        y = parse(eq.value, i);
        
        nextX = i+=0.1;
        nextY = parse(eq.value, nextX);

        curdev = (nextY - y)/(nextX- x);
        //console.log(x + " " + y);
        if (pdev * curdev >= 0) {
            if (y <= height/2) {
                ctx.lineTo(convertX(scale*x), convertY(scale*y));
            }
        } else {
            ctx.moveTo(convertX(scale*(x+.1)), convertY(scale*(parse(eq.value, x+.1))));
        }
        pdev = curdev;
    }
    ctx.stroke();
    console.log(parse('.1+2', 1));
}

const pemdas = new Map();

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
function parse(eq, val) {
    var str = eq;
    str = str.replace('sin', '1s');
    str = str.replace('cos', '1c');
    str = str.replace('tan', '1t');
    console.log(str);
    var l = compute(str, val, -10);

    try {
        return l;
    } catch (e) {
        return NaN;
    }
}

// handling parentheses and individual numbers
function atomCalc(eq, val, lhs) {  
    if (!eq.length) {
        return [lhs, eq];
    }

    cur = eq.charAt(0);  
    if (!(cur != '+' && cur != '-' && cur != '*' && cur != '/' && cur != '^' && cur != 's'
    && cur != 'c' && cur != 't')) {
        return [lhs, eq];
    }

    if (eq.charAt(0) == 'x') {
        lhs = parseFloat(val);
        eq = eq.substring(1);
    } else if (!isNaN(eq.charAt(0)) || eq.charAt(0) == '.') {
        var atom = "";
        cur = eq.charAt(0);
        while((!isNaN(eq.charAt(0)) || eq.charAt(0) == '.') && eq.length) {
            atom += cur;
            eq = eq.substring(1);
            cur = eq.charAt(0);
        }
        console.log(atom);
        lhs = parseFloat(atom);
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
    } 

    //atomCalc(eq, val, lhs);
    return [lhs, eq];
}

function compute(eq, val, min_prec) {
    var ans = atomCalc(eq, val, 0);
    var lhs = ans[0];
    eq = ans[1];

    if (eq.length) {
        for (var i = 0; i<eq.length; i++) {
            var cur = eq.charAt(i);
            if (cur != '+' && cur != '-' && cur != '*' && cur != '/' && cur != '^' && cur != 's'
            && cur != 'c' && cur != 't') {
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
            console.log(rhs);
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
    }
}