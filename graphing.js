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
    for (var i = -width/2; i<=width/2; i++) {
        x = i;
        y = parse(eq, i);
        //console.log(x + " " + y);
        if (y <= height/2) {
            ctx.lineTo(convertX(scale*x), convertY(scale*y));
        }
    }
    ctx.stroke();
}

function parse(eq, val) {
    total = 0;
    prev = '';
    for (let i = 0; i < eq.value.length; i++) {
        var cur = eq.value.charAt(i);
        if (cur == 'x') {
            switch(prev) {
                case '':
                    total = val;
                    break;
                case '+':
                    total += parseInt(val);
                    break;
                case '-':
                    total -= val;
                    break;
                case '/':
                    total /= val;
                    break;
                    case '*':
                        total *= val;
                        break;
            }
        } else if (!isNaN(cur)) {
            switch(prev) {
                case '':
                    total = cur;
                    break;
                case '+':
                    total += parseInt(cur);
                    break;
                case '-':
                    total -= cur;
                    break;
                case '/':
                    total /= cur;
                    break;
                    case '*':
                        total *= cur;
                        break;
            }
        } else {
            prev = cur;
        }
    }
    console.log(val + " " + total);
    return total;
}
