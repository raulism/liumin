window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame || function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
})();

var canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), 
canvas0 = document.getElementById('canvas0'), ctx0 = canvas0.getContext('2d'), 
cw = window.innerWidth, ch = window.innerHeight, fireworks = [], explosions = [], mx, my;
var maxFireworks = 30, minFireworks = 0;
ctx.canvas.width = cw;
ctx.canvas.height = ch*0.83;
ctx0.canvas.width = cw;
ctx0.canvas.height = ch*0.17;

var Firework = function(tx, ty) {
	this.tx = tx;
	this.ty = ty;
	this.sx = cw / 2;
	this.sy = ch;
	this.ax = this.sx;
	this.ay = this.sy;
	this.distanceToTarget = calculateDistance(tx,ty,this.sx,this.sy);
	this.actualDistance = 0;
	this.angle = Math.atan2(this.ty - this.sy, this.tx - this.sx);
	this.hue = 120 * Math.random();
	this.brightness = random(50, 70);
	this.speed = 2;
	this.acceleration = 1.05;
	this.coordinates = [];
	this.coordinateCount = 3;
	while (this.coordinateCount--) {
		this.coordinates.push([this.ax,this.ay]);
	}
};
Firework.prototype.draw = function() {
	ctx.beginPath();
	ctx.moveTo(this.coordinates[0][0],this.coordinates[0][1]);
	ctx.lineTo(this.ax, this.ay);
	ctx.strokeStyle = 'hsl(' + this.hue + ', 100%, ' + this.brightness + '%)';
	ctx.stroke();
};
Firework.prototype.update = function(index) {
	this.coordinates.shift();
	this.coordinates.push([this.ax,this.ay]);
	this.speed *= this.acceleration;
	var vx = this.speed * Math.cos(this.angle);
	var vy = this.speed * Math.sin(this.angle);
	this.actualDistance = calculateDistance(this.ax + vx,this.ay + vy,this.sx,this.sy);
	if(this.actualDistance >= this.distanceToTarget){
		createExplosion(this.tx,this.ty);
		fireworks.splice(index, 1);
	}else{
		this.ax += vx;
		this.ay += vy;
	}
};
function createExplosion(x,y){
	var explosionRange = 100;
	while(explosionRange--){
		explosions.push(new Explosion(x,y));
	}
}
var Explosion = function(x, y) {
	this.x = x;
	this.y = y;
	this.angle = random(0, Math.PI * 2);
	this.gravity = 1;
	this.speed = random(1, 10);
	this.retard = 0.95;// slow down the speed
	this.color = randomColor();
	this.brightness = 1;
	this.darken = random(0.015,0.03);
	this.coordinates = [];
	this.coordinateCount = 5;
	while (this.coordinateCount--) {
		this.coordinates.push([this.x,this.y]);
	}
};
Explosion.prototype.draw = function() {
	ctx.beginPath();
	ctx.moveTo(this.coordinates[0][0],this.coordinates[0][1]);
	ctx.lineTo(this.x, this.y);
	ctx.strokeStyle = this.color;
	ctx.stroke();
};
Explosion.prototype.update = function(index) {
	this.coordinates.shift();
	this.coordinates.push([this.x,this.y]);
	this.speed *= this.retard;
	this.x += this.speed * Math.cos(this.angle);
	this.y += this.speed * Math.sin(this.angle) + this.gravity;
	this.brightness -= this.darken;
	if(this.brightness <= this.darken){
		explosions.splice(index, 1);
	}
};

function main() {
	
	requestAnimFrame(main);

//	ctx.globalCompositeOperation = 'destination-out';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx0.font="30px Verdana";
	ctx0.textBaseline ="middle";
	ctx0.textAlign ="center";
	var gradient=ctx0.createLinearGradient(0,0,ctx0.canvas.width,0);
	gradient.addColorStop("0","magenta");
	gradient.addColorStop("0.5","blue");
	gradient.addColorStop("1.0","red");
	ctx0.fillStyle=gradient;
	ctx0.fillText("Happy Birthday to Yuan",ctx0.canvas.width*0.5,ctx0.canvas.height*0.5);
//	ctx.globalCompositeOperation = 'lighter';
	
	var i = fireworks.length;
	while (i--) {
		fireworks[i].draw();
		fireworks[i].update(i);
	}
	var j = explosions.length;
	while (j--) {
		explosions[j].draw();
		explosions[j].update(j);
	}
	if(minFireworks >= maxFireworks){
		fireworks.push(new Firework(random(0, cw),random(0, ch / 2)));
		minFireworks = 0;
	}else{
		minFireworks++;
	}
	if(mousedown){
		fireworks.push(new Firework(mx,my));
	}
	
}
function random(min, max) {
	return Math.random() * (max - min) + min;
}
function calculateDistance(p1x, p1y, p2x, p2y) {
	var xDistance = p1x - p2x, yDistance = p1y - p2y;
	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}
function randomColor() {
	color = '#' + Math.floor(Math.random() * 0xffffff).toString(16);
	return color;
}
window.onload = main;

canvas.addEventListener('mousemove', function(e) {
	mx = e.pageX - canvas.offsetLeft;
	my = e.pageY - canvas.offsetTop;
});
canvas.addEventListener('mousedown', function(e) {
	e.preventDefault();
	mousedown = true;
});

canvas.addEventListener('mouseup', function(e) {
	e.preventDefault();
	mousedown = false;
});
