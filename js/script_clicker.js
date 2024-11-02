var c = document.getElementById("c");
var ctx = c.getContext("2d");
var cH;
var cW;
var bgColor = "#FF6138";
var animations = [];
var circles = [];

var colorPicker = (function() {
    var colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
    var index = 0;
    function next() {
        index = index++ < colors.length - 1 ? index : 0;
        return colors[index];
    }
    function current() {
        return colors[index];
    }
    return {
        next: next,
        current: current
    };
})();

function removeAnimation(animation) {
    var index = animations.indexOf(animation);
    if (index > -1) animations.splice(index, 1);
}

function calcPageFillRadius(x, y) {
    var l = Math.max(x - 0, cW - x);
    var h = Math.max(y - 0, cH - y);
    return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

function addClickListeners() {
    document.addEventListener("touchstart", handleEvent);
    document.addEventListener("mousedown", handleEvent);
}

var clickCount = 0;

function handleEvent(e) {
    if (e.touches) { 
        e.preventDefault();
        e = e.touches[0];
    }
    
    clickCount++;
    document.getElementById('click-count').innerText = `Clicks: ${clickCount}`;
    changeBackgroundColor();

    if (clickCount === 50) {
        displayTaunt("You're so close! Keep going!");
        alert("Please don't try clicking again! Just click 'Move On'!");
    } else if (clickCount > 50 && clickCount < 70) {
        displayTaunt("Please don't try clicking again! Just click 'Move On'!");
    } else if (clickCount === 70) {
        alert("You can't even move on from a useless clicker, no wonder that girl's still in your head!");
    } else if (clickCount === 40) {
        displayTaunt("Get a girlfriend, man! You have nothing else to do, huh?");
    } else if (clickCount === 30) {
        displayTaunt("Are you still here? Clicking won't make life better!");
    } 

    document.getElementById('next-button').style.display = (clickCount > 50) ? 'block' : 'none';

    var currentColor = colorPicker.current();
    var nextColor = colorPicker.next();
    var targetR = calcPageFillRadius(e.pageX, e.pageY);
    var rippleSize = Math.min(200, (cW * .4));
    var minCoverDuration = 750;

    var pageFill = new Circle({
        x: e.pageX,
        y: e.pageY,
        r: 0,
        fill: nextColor
    });
    
    var fillAnimation = anime({
        targets: pageFill,
        r: targetR,
        duration: Math.max(targetR / 2, minCoverDuration),
        easing: "easeOutQuart",
        complete: function() {
            bgColor = pageFill.fill;
            removeAnimation(fillAnimation);
        }
    });

    var ripple = new Circle({
        x: e.pageX,
        y: e.pageY,
        r: 0,
        fill: currentColor,
        stroke: {
            width: 3,
            color: currentColor
        },
        opacity: 1
    });
    
    var rippleAnimation = anime({
        targets: ripple,
        r: rippleSize,
        opacity: 0,
        easing: "easeOutExpo",
        duration: 900,
        complete: removeAnimation
    });

    var particles = [];
    for (var i = 0; i < 32; i++) {
        var particle = new Circle({
            x: e.pageX,
            y: e.pageY,
            fill: currentColor,
            r: anime.random(24, 48)
        });
        particles.push(particle);
    }
    var particlesAnimation = anime({
        targets: particles,
        x: function(particle) {
            return particle.x + anime.random(rippleSize, -rippleSize);
        },
        y: function(particle) {
            return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
        },
        r: 0,
        easing: "easeOutExpo",
        duration: anime.random(1000, 1300),
        complete: removeAnimation
    });
    animations.push(fillAnimation, rippleAnimation, particlesAnimation);
}

function changeBackgroundColor() {
    const colors = ["#FF6138", "#FFBE53", "#2980B9", "#282741"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
}

function displayTaunt(message) {
    var tauntMessage = document.getElementById('taunt-message');
    tauntMessage.innerText = message;
    tauntMessage.style.display = 'block';
    document.getElementById('next-button').style.display = (clickCount > 50) ? 'block' : 'none';
}

function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

var Circle = function(opts) {
    extend(this, opts);
}

Circle.prototype.draw = function() {
    ctx.globalAlpha = this.opacity || 1;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    if (this.stroke) {
        ctx.strokeStyle = this.stroke.color;
        ctx.lineWidth = this.stroke.width;
        ctx.stroke();
    }
    if (this.fill) {
        ctx.fillStyle = this.fill;
        ctx.fill();
    }
    ctx.closePath();
    ctx.globalAlpha = 1;
}

var animate = anime({
    duration: Infinity,
    update: function() {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, cW, cH);
        animations.forEach(function(anim) {
            anim.animatables.forEach(function(animatable) {
                animatable.target.draw();
            });
        });
    }
});

var resizeCanvas = function() {
    cW = window.innerWidth;
    cH = window.innerHeight;
    c.width = cW * devicePixelRatio;
    c.height = cH * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
}
resizeCanvas();
addClickListeners();
window.addEventListener("resize", resizeCanvas);
