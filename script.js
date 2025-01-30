(function(){
    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;
  
    // Main
    initHeader();
    initAnimation();
    addListeners();
  
    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};
  
        largeHeader = document.createElement("div");
        largeHeader.style.position = "fixed";
        largeHeader.style.top = "0";
        largeHeader.style.left = "0";
        largeHeader.style.width = "100%";
        largeHeader.style.height = "100vh";
        largeHeader.style.overflow = "hidden";
        document.body.prepend(largeHeader);
  
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        largeHeader.appendChild(canvas);
        ctx = canvas.getContext("2d");
  
        // Create points
        points = [];
        for(var x = 0; x < width; x += width/20) {
            for(var y = 0; y < height; y += height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }
  
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
  
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }
  
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }
  
    function addListeners() {
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }
  
    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }
  
    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }
  
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        largeHeader.style.height = height+'px';
        canvas.width = width;
        canvas.height = height;
    }
  
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }
  
    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }
  
    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }
  
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
  
    function Circle(pos, rad, color) {
        var _this = this;
  
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();
  
        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = _this.color;
            ctx.fill();
        };
    }
  })();
  