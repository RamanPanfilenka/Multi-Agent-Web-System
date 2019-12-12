var PotencdialRadius = 300;
var SmashKoef = 20;
var destation = 50;
var BallRadius = 20;
var Temp;
var CurrentFigure;
var width = c.width = window.innerWidth,
		height = c.height = window.innerHeight,
		ctx = c.getContext( '2d' ),
		
		balls = [],
		shake = 0,
		tick = 0;

		
for( var i = 0; i < 150; ++i )
balls.push( new ball );

//Balls Region--------------------
function ball(){
	
	this.Radius = BallRadius;
	let randX = Math.random() * width;
	let randY = Math.random() * height;
	let vel = 1 + 2 * Math.random();
	let rad = Math.random() * Math.PI * 2;
	
	this.Position = { X:  randX, Y:  randY};
	this.PreviousPosition = { X: randX, Y: randY };
	this.BestFunctionValue = { X: randX, Y: randY };
	this.Speed = { 
		X: Math.cos( rad ) * vel*5,
		Y: Math.sin( rad ) * vel*5,
	};
	
	this.Velocity = vel;
	this.Angle = rad;
	this.BestFunctionValue = { X: randX, Y: randY} 
	this.ConnectRadius = 600; 
}
ball.prototype.step = function(){
	this.Position.X += this.Speed.X;
	this.Position.Y += this.Speed.Y;
	
	if( this.Velocity > this.Radius / 2 ){
		
		this.Velocity -= .5;
		this.Speed.X = Math.cos( this.Angle ) * this.Velocity;
		this.Speed.Y = Math.sin( this.Angle ) * this.Velocity;
	}
	
	if( this.Position.X < 0 ){
		
		this.Position.X = 0;
		this.Speed.X *= -1;
		this.changeAngle();
		
	} else if( this.Position.X > width ){
		
		this.Position.X = width;
		this.Speed.X *= -1;
		this.changeAngle();
	}
	
	if( this.Position.Y < 0 ){
		
		this.Position.Y = 0;
		this.Speed.Y *= -1;
		this.changeAngle();
	} else if( this.Position.Y > height ){
		
		this.Position.Y = height;
		this.Speed.Y *= -1;
		this.changeAngle();
	}
	
	ctx.lineWidth = this.Radius;
	if(CurrentFigure !== undefined){
		CurrentFigure.DrawPotencial();
	}
	ctx.beginPath();
	ctx.lineCap = 'round';
	ctx.moveTo( this.Position.X - this.Speed.X, this.Position.Y - this.Speed.Y );
	ctx.lineTo( this.Position.X, this.Position.Y );
	ctx.stroke();

}
ball.prototype.changeAngle = function(){
	
	this.Angle = Math.atan( this.Speed.Y / this.Speed.X );
	
	if( this.Speed.X < 0 )
		this.Angle += Math.PI;
	if( this.Speed.X !== 0 )
		this.Velocity = this.Speed.X / Math.cos( this.Angle );
	else
		this.Velocity = this.Speed.Y / Math.sin( this.Angle );
}
//--------------------------------


//Figure Region-------------------
class Figure{
	constructor() {
	  }
}

class Circle extends Figure{
	GetPotencial = function (x, y, deviation = 0){
		let inPotencial = false;
		let pathX = Math.abs(x - StopX);
		let pathY = Math.abs(y - StopY);
		if(Math.sqrt(pathX*pathX+pathY*pathY) < PotencdialRadius + deviation){
			inPotencial = true;
		}
	
		return inPotencial;
	}

	DrawPotencial = function(){
		ctx.beginPath();
		ctx.arc(StopX, StopY, PotencdialRadius, 0, Math.PI*2, false);
		var old = ctx.lineWidth;
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.lineWidth = old;
	}
}

class Rect extends Figure{
	constructor() {
		super();
	}

	GetPotencial(x, y, deviation = 0){
		let inPotencial = false;
		let pathX = Math.abs(x - StopX);
    	let pathY = Math.abs(y - StopY);
		if(pathX < PotencdialRadius + deviation && pathY < PotencdialRadius + deviation){
			inPotencial = true;
		}

		return inPotencial;
	}

	DrawPotencial(){
		ctx.beginPath();
		ctx.rect(StopX-PotencdialRadius, StopY-PotencdialRadius, 2*PotencdialRadius,2*PotencdialRadius);
		var old = ctx.lineWidth;
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.lineWidth = old;
	}
}



//--------------------------------




function smash(){
	for( var i = 0; i < balls.length; ++i ){
		let ball1 = balls[ i ];
		for( var j = i + 1; j < balls.length; ++j ){
			let ball2 = balls[ j ];
			let dx = ball1.Position.X - ball2.Position.X;
			let dy = ball1.Position.Y - ball2.Position.Y;
			let distance = dx*dx + dy*dy;
			
			if( distance <= SmashKoef* (2 * ball1.Radius) ){
				ctx.lineWidth = ball1.Radius;
				ctx.beginPath();
				ctx.moveTo( ball1.x, ball1.y );
				ctx.lineTo( ball2.x, ball2.y );
				ctx.stroke();
				
				ball1.Speed.X += dx * ball1.Radius / 80;
				ball1.Speed.Y += dy * ball1.Radius / 80;
				ball2.Speed.X -= dx * ball1.Radius / 80;
				ball2.Speed.Y -= dy * ball1.Radius / 80;
			}
		}
	}
}


function anim(){
	
	Temp = window.requestAnimationFrame( anim );
	++tick;
	let randomX = Math.random() * shake;
	let randomY = Math.random() * shake;
	
	ctx.translate( randomX, randomY );
	ctx.clearRect(0, 0, c.width, c.height);
	balls.forEach(ball => ball.step());
	smash();

	ctx.translate( -randomX, -randomY );
}


window.addEventListener( 'resize', function(){
	width = c.width = window.innerWidth;
	height = c.height = window.innerHeight;
})

function stepAlgorith(){
        Temp = window.requestAnimationFrame( stepAlgorith );
	if(CurrentFigure == undefined)
	{
		window.cancelAnimationFrame( stepAlgorith );
	}
	++tick;
	let randomX = Math.random() * shake;
	let randomY = Math.random() * shake;
	ctx.translate( randomX, randomY );
	ctx.clearRect(0, 0, c.width, c.height);
	balls.forEach(ball => ball.step());
	smash();
	balls.forEach(ball => {
        ball = BestFromAllInRadius(ball);
		ball = SetBestValue(ball);
		ball = CorrectSpeed(ball);
		let inPotencial = CurrentFigure.GetPotencial(ball.Position.X, ball.Position.Y);
		if(inPotencial){
			ball.Speed.X = 0;
			ball.Speed.Y = 0;
			ball.Velocity = 0;
			ball.Angle = 0;
		}
	});
	var allInPotencial = balls.every(ball => CurrentFigure.GetPotencial(ball.Position.X, ball.Position.Y));
	var allInPotencialWithDev = balls.every(ball => CurrentFigure.GetPotencial(ball.Position.X, ball.Position.Y, destation));
	if(allInPotencial){
		balls.forEach(ball => {
				ball.Speed.X = 0;
				ball.Speed.Y = 0;
				ball.Velocity = 0;
				ball.Angle = 0;
		});
	}
	if(!allInPotencial && allInPotencialWithDev){

	}
	smash();
	ctx.translate( -randomX, -randomY );
}

function CorrectSpeed(ball) {
    if (ball.BestFromAll != undefined) {
        ball.Speed.X = ball.Speed.X * 0.03 + 0.2 * Math.random() * (ball.BestFunctionValue.X - ball.Position.X) + 0.5 * Math.random() * (ball.BestFromAll.X - ball.Position.X);
        ball.Speed.Y = ball.Speed.Y * 0.03 + 0.2 * Math.random() * (ball.BestFunctionValue.Y - ball.Position.Y) + 0.5 * Math.random() * (ball.BestFromAll.Y - ball.Position.Y);
    } else {
        ball.Speed.X = ball.Speed.X * 0.3 + Math.random() * (ball.BestFunctionValue.X - ball.Position.X);
        ball.Speed.Y = ball.Speed.Y * 0.3 + Math.random() * (ball.BestFunctionValue.Y - ball.Position.Y);
    }
    return ball;
}

function BestFromAllInRadius(currentBall) {
    var bestValue = currentBall.BestFunctionValue;
    balls.forEach(ball => {
        if (Math.sqrt((Math.pow(Math.abs(ball.Position.X - currentBall.Position.X), 2) +
                Math.pow(Math.abs(ball.Position.Y - currentBall.Position.Y), 2))) <= currentBall.ConnectRadius) {
            if (OurFunction(ball.BestFunctionValue.X, ball.BestFunctionValue.Y) > OurFunction(currentBall.BestFunctionValue.X, currentBall.BestFunctionValue.Y)) {
                bestValue = ball.BestFunctionValue;
            }
        }
    });
    currentBall.BestFromAll = bestValue;
    return currentBall;
}

function SetBestValue(ball) {
    if (OurFunction(ball.Position.X, ball.Position.Y) > OurFunction(ball.BestFunctionValue.X, ball.BestFunctionValue.Y)) {
        ball.BestFunctionValue.X = ball.Position.X;
        ball.BestFunctionValue.Y = ball.Position.Y;
    }
    return ball;
}

var I = 0;

window.onload = function(){
	document.getElementById('c').onclick = function OnCanvasClick(ev){
		I++;
		if(I % 2 != 0){
			window.cancelAnimationFrame(Temp);
			StopX = ev.pageX;
			StopY = ev.pageY;
			ctx.clearRect(0, 0, c.width, c.height);
			let currentChoise = document.querySelectorAll(':checked')[0].getAttribute("value");
			CurrentFigure = GetFigure(currentChoise);
			CurrentFigure.GetPotencial();
			stepAlgorith();
		}else{
			window.cancelAnimationFrame(Temp);
			ctx.clearRect(0, 0, c.width, c.height);
			CurrentFigure = undefined;
			setRandomSpeed();
			anim();
		}
		
	}
}

function setRandomSpeed() {
	balls.forEach(ball =>{
		let vel = 1 + 2 * Math.random()/10;
		let rad = Math.random() * Math.PI * 2/10;
		ball.Speed = { 
			X: Math.cos( rad ) * vel,
			Y: Math.sin( rad ) * vel,
		};
		ball.Velocity = vel;
		ball.Angle = rad;
	})
}

function OurFunction(x, y) {
    let pathX = StopY - Math.abs(x - StopX);
    let pathY = StopX - Math.abs(y - StopY);
    return pathY + pathX;
}

function GetFigure(currentChoise){
	switch(currentChoise){
		case "0":
			return new Circle();
			break;
		case "1":
			return new Rect();
			break;
	}
}

anim();