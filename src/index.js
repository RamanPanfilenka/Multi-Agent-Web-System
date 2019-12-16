import BallAnimation from "../src/js/animation/animation"
import Ball from "../src/js/model/ball"	
import AlgotithmAnimation from "./js/animation/algoritm";
import {Circle} from "../src/js/model/figures/circle"
import {Rect} from "../src/js/model/figures/rect"
import {enviroment} from "./enviroment/enviroment";


var figures = ["1", "0"]
var balls = [];
var animation;
var StopX, StopY, currentFigure;
var smashKoef = enviroment.SmashKoef;
var figureIndex = 0;
for( var i = 0; i < 170; ++i )
   balls.push(new Ball(20));

window.onload = function(){
    let index = 0;
    this.document.getElementById("c").width = window.innerWidth;
    this.document.getElementById("c").height = window.innerHeight;
    document.getElementById('c').onclick = function OnCanvasClick(ev){
 		 window.cancelAnimationFrame(animation);
 		 StopX = ev.pageX;
 		 StopY = ev.pageY;
 		 c.getContext('2d').clearRect(0, 0, c.width, c.height);
 		 algotithmAnimation(); 
     }
    
    mainAnim();
}

function mainAnim() {
    animation = window.requestAnimationFrame(mainAnim);
    var anim = new BallAnimation(balls, enviroment.SmashKoef);
    anim.Anim();
}

function algotithmAnimation(){
    animation = window.requestAnimationFrame(algotithmAnimation);
    let currentChoise = figures[figureIndex];
    currentFigure = GetFigure(currentChoise, StopX, StopY, enviroment.PotencialRadius, smashKoef);
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    var anim = new AlgotithmAnimation(balls, StopX, StopY, currentFigure, smashKoef);
    smashKoef = anim.Anim();
    var allInPotencial = balls.every(ball => checkSpeed(ball));
    if(allInPotencial){
        console.log(figureIndex);
        window.cancelAnimationFrame(animation);
        if(figureIndex == figures.length - 1){
            return;
        }
        setTimeout(() =>{
            figureIndex++;
            currentFigure.DrawPotencial(c.getContext('2d'));
            algotithmAnimation();
        }, 2000)
    }
}
       

function checkSpeed(ball) {
    if(ball.Speed.X == 0 && ball.Speed.Y == 0)
        return true;
    return false;
}


function GetFigure(currentChoise, x, y, potencialRadius){
    switch(currentChoise){
        case "0":
            return new Circle(x,y,potencialRadius-25);
            break;
        case "1":
            return new Rect(x,y,potencialRadius - 43);
            break;
    }
}