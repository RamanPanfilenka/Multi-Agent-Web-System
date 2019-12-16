import Ball from "../model/ball"
import {enviroment} from "../../enviroment/enviroment"

export default class BallAnimation{
	constructor(balls){
		this.ctx = c.getContext( '2d' );
		this.balls = balls;
	}

	Smash(){
		for( var i = 0; i < this.balls.length; ++i ){
			let ball1 = this.balls[ i ];
			for( var j = i + 1; j < this.balls.length; ++j ){
				let ball2 = this.balls[ j ];
				let dx = ball1.Position.X - ball2.Position.X;
				let dy = ball1.Position.Y - ball2.Position.Y;
				let distance = dx*dx + dy*dy;
				
				if( distance <= enviroment.SmashKoef* (2 * ball1.Radius) ){
					this.ctx.lineWidth = ball1.Radius;
					this.ctx.beginPath();
					this.ctx.moveTo( ball1.x, ball1.y );
					this.ctx.lineTo( ball2.x, ball2.y );
					this.ctx.stroke();
					
					ball1.Speed.X += dx * ball1.Radius / 80;
					ball1.Speed.Y += dy * ball1.Radius / 80;
					ball2.Speed.X -= dx * ball1.Radius / 80;
					ball2.Speed.Y -= dy * ball1.Radius / 80;
				}
			}
		}
	}

	Anim(){
		this.tick++;
		let randomX = Math.random();
		let randomY = Math.random();
		
		this.ctx.translate( randomX, randomY );
		this.ctx.clearRect(0, 0, c.width, c.height);
		this.balls.forEach(ball => this.Step(ball));
		this.Smash();
	
		this.ctx.translate( -randomX, -randomY );
	}

	Step(ball){
		ball.Position.X += ball.Speed.X;
		ball.Position.Y += ball.Speed.Y;
	
		if( ball.Velocity > ball.Radius / 2 ){
	
			ball.Velocity -= .5;
			ball.Speed.X = Math.cos( ball.Angle ) * ball.Velocity;
			ball.Speed.Y = Math.sin( ball.Angle ) * ball.Velocity;
		}
	
		if( ball.Position.X < 0 ){
	
			ball.Position.X = 0;
			ball.Speed.X *= -1;
			this.ChangeAngle(ball);
	
		} else if( ball.Position.X > enviroment.width ){
	
			ball.Position.X = enviroment.width;
			ball.Speed.X *= -1;
			this.ChangeAngle(ball);
		}
	
		if( ball.Position.Y < 0 ){
	
			ball.Position.Y = 0;
			ball.Speed.Y *= -1;
			this.ChangeAngle(ball);
		} else if( ball.Position.Y > enviroment.height ){
	
			ball.Position.Y = enviroment.height;
			ball.Speed.Y *= -1;
			this.ChangeAngle(ball);
		}
		this.ctx.lineWidth = ball.Radius;
		if(this.CurrentFigure !== undefined){
			this.CurrentFigure.DrawPotencial(this.ctx);
		}
		this.ctx.beginPath();
		this.ctx.lineCap = 'round';
		this.ctx.moveTo( ball.Position.X, ball.Position.Y);
		this.ctx.lineTo( ball.Position.X, ball.Position.Y );
		this.ctx.stroke();
	
	}
	
	ChangeAngle(ball){
		ball.Angle = Math.atan( ball.Speed.Y / ball.Speed.X );
	
		if( ball.Speed.X < 0 )
			ball.Angle += Math.PI;
		if( ball.Speed.X !== 0 )
			ball.Velocity = ball.Speed.X / Math.cos( ball.Angle );
		else
			ball.Velocity = ball.Speed.Y / Math.sin( ball.Angle );
	}

	SetRandomSpeed() {
		this.balls.forEach(ball =>{
			let vel = 1 + 2 * Math.random()/10;
			let rad = Math.random() * Math.PI * 2/10;
			this.ball.Speed = { 
				X: Math.cos( rad ) * vel,
				Y: Math.sin( rad ) * vel,
			};
			this.ball.Velocity = vel;
			this.ball.Angle = rad;
		})
	}
}	