import BallAnimation from "../animation/animation"
import { enviroment } from "../../enviroment/enviroment";

export default class AlgotithmAnimation extends BallAnimation{
    constructor(balls, stopX, stopY, currentFigure){
        super(balls);
        this.StopX = stopX;
        this.StopY = stopY;
        this.CurrentFigure = currentFigure;
        this.destation = enviroment.destation;
    }

    Anim(){
         let randomX = Math.random();
         let randomY = Math.random();
         this.ctx.translate( randomX, randomY );
         this.ctx.clearRect(0, 0, c.width, c.height);
         this.balls.forEach(ball => this.Step(ball));
         this.Smash();
         this.balls.forEach(ball => {
             ball = this.BestFromAllInRadius(ball);
             ball = this.SetBestValue(ball);
             ball = this.CorrectSpeed(ball);
             let inPotencial = this.CurrentFigure.GetPotencial(ball.Position.X, ball.Position.Y);
             if(inPotencial){
                 ball.Speed.X = 0;
                 ball.Speed.Y = 0;
                 ball.Velocity = 0;
                 ball.Angle = 0;
             }
         });
         var allInPotencial = this.balls.every(ball => this.CurrentFigure.GetPotencial(ball.Position.X, ball.Position.Y));
         var allInPotencialWithDev = this.balls.every(ball => this.CurrentFigure.GetPotencial(ball.Position.X, ball.Position.Y, this.destation));
         if(allInPotencial){
             this.balls.forEach(ball => {
                     ball.Speed.X = 0;
                     ball.Speed.Y = 0;
                     ball.Velocity = 0;
                     ball.Angle = 0;
             });
         }
         this.Smash();
         this.ctx.translate( -randomX, -randomY );
     }

    CorrectSpeed(ball) {
        if (ball.BestFromAll != undefined) {
            ball.Speed.X = ball.Speed.X * 0.03 + 0.2 * Math.random() * (ball.BestFunctionValue.X - ball.Position.X) + 0.5 * Math.random() * (ball.BestFromAll.X - ball.Position.X);
            ball.Speed.Y = ball.Speed.Y * 0.03 + 0.2 * Math.random() * (ball.BestFunctionValue.Y - ball.Position.Y) + 0.5 * Math.random() * (ball.BestFromAll.Y - ball.Position.Y);
        } else {
            ball.Speed.X = ball.Speed.X * 0.3 + Math.random() * (ball.BestFunctionValue.X - ball.Position.X);
            ball.Speed.Y = ball.Speed.Y * 0.3 + Math.random() * (ball.BestFunctionValue.Y - ball.Position.Y);
        }
        ball.Speed.X /= 10;
        ball.Speed.Y /= 10 
        return ball;
     }
    
    BestFromAllInRadius(currentBall) {
        var bestValue = currentBall.BestFunctionValue;
        this.balls.forEach(ball => {
                if (Math.sqrt((Math.pow(Math.abs(ball.Position.X - currentBall.Position.X), 2) +
                    Math.pow(Math.abs(ball.Position.Y - currentBall.Position.Y), 2))) <= currentBall.ConnectRadius) {
                if (this.OurFunction(ball.BestFunctionValue.X, ball.BestFunctionValue.Y) > this.OurFunction(currentBall.BestFunctionValue.X, currentBall.BestFunctionValue.Y)) {
                    bestValue = ball.BestFunctionValue;
                }
            }
        });
        currentBall.BestFromAll = bestValue;
        return currentBall;
    }
    
    SetBestValue(ball) {
        if (this.OurFunction(ball.Position.X, ball.Position.Y) > this.OurFunction(ball.BestFunctionValue.X, ball.BestFunctionValue.Y)) {
            ball.BestFunctionValue.X = ball.Position.X;
            ball.BestFunctionValue.Y = ball.Position.Y;
        }
        return ball;
    }
   
    OurFunction(x, y) {
        let pathX = this.StopY - Math.abs(x - this.StopX);
        let pathY = this.StopX - Math.abs(y - this.StopY);
        return pathY + pathX;
    }
}




