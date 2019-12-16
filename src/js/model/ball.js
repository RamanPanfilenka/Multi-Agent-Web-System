import {enviroment} from "../../enviroment/enviroment"

export default class Ball{
	constructor(radius){
		this.Radius = enviroment.BallRadius;
		let randX = Math.random() * enviroment.width;
		let randY = Math.random() * enviroment.height;
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

}
