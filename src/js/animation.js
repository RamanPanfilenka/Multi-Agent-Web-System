var balls = [];
var height = window.screen.height - 144;
var width = window.screen.width - 100;
var radius = 5;
var context;
var canvas;
var connectRadius = 200;
var epsilon = 0.1;
var referenceDrawInterval;
var countOfBalls = 100;
var StopX, StopY;
var InterationCount
window.onload = function() {
    canvas = document.createElement('canvas');
    canvas.id = "draw-panel";
    document.body.append(canvas);
    canvas.width = width;
    canvas.height = height;
    context = canvas.getContext('2d');
    referenceDrawInterval = setInterval(this.drawPreAlgorth, 10);
    document.getElementById('draw-panel').setAttribute("class", "some")
    document.getElementById('draw-panel').onclick = function OnCanvasClick(ev) {
        clearInterval(referenceDrawInterval);
        StopX = ev.pageX;
        StopY = ev.pageY;
        console.log('x: ' + StopX + ' y: ' + StopY)
        referenceDrawInterval = setInterval(draw, 10);
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function drawPreAlgorth(params) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (balls.length == 0) {
        for (var i = 0; i < countOfBalls; i++) {
            context.beginPath();
            var randX = getRandomArbitrary(radius, width - radius);
            var randY = getRandomArbitrary(radius, height - radius);
            context.arc(randX, randY, radius, 0, 2 * this.Math.PI);
            context.fillStyle = 'FFF000';
            context.fill();
            context.closePath();
            var ball = {
                Position: { X: randX, Y: randY },
                PreviousPosition: { X: randX, Y: randY },
                BestFunctionValue: { X: randX, Y: randY },
                Speed: {
                    X: getRandomArbitrary(-4, 4),
                    Y: getRandomArbitrary(-4, 4),
                }
            }
            balls.push(ball);
        }
    } else {
        balls.forEach(ball => {
            ball.PreviousPosition.X = ball.Position.X;
            ball.PreviousPosition.Y = ball.Position.Y;

            if (ball.Position.X < radius || ball.Position.X > width - radius)
                ball.Speed.X = -ball.Speed.X;
            if (ball.Position.Y < radius || ball.Position.Y > height - radius)
                ball.Speed.Y = -ball.Speed.Y;

            ball.Position.X += ball.Speed.X;
            ball.Position.Y += ball.Speed.Y;
            context.beginPath();
            context.arc(ball.Position.X, ball.Position.Y, radius, 0, 2 * this.Math.PI);
            context.fillStyle = 'FFF000';
            context.fill();
            context.closePath();
        });
    }
}


function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach(ball => {
        ball.PreviousPosition.X = ball.Position.X;
        ball.PreviousPosition.Y = ball.Position.Y;
        ball.Position.X += ball.Speed.X;
        ball.Position.Y += ball.Speed.Y;

        ball = CorrectSpeed(ball);
        ball = BestFromAllInRadius(ball);
        ball = SetBestValue(ball);

        context.beginPath();
        context.arc(ball.Position.X, ball.Position.Y, radius, 0, 2 * this.Math.PI);
        context.fillStyle = 'FFF000';
        context.fill();
        context.closePath();
    });
    StopDraw();
}

function OurFunction(x, y) {
    var pathX = StopY - Math.abs(x - StopX);
    var pathY = StopX - Math.abs(y - StopY);
    return pathY + pathX;
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
                Math.pow(Math.abs(ball.Position.Y - currentBall.Position.Y), 2))) <= connectRadius) {
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

function StopDraw() {
    var counter = 0,
        speedLow = 0;
    var position = balls[0].Position;
    balls.forEach(ball => {
        if (Math.sqrt(Math.pow(ball.Position.X - position.X, 2) + Math.pow(ball.Position.Y - position.Y, 2)) <= epsilon) {
            counter++;
        }
        if (ball.Speed.X < epsilon / 100 && ball.Speed.Y < epsilon / 100) {
            speedLow++;
        }
    });
    if (counter === countOfBalls) {
        alert('stop');
        clearInterval(referenceDrawInterval);
    } else {
        if (speedLow === countOfBalls)
            setAntiStopSpeed();
    }
}

function setAntiStopSpeed() {
    balls.forEach(ball => {
        ball.Speed.X = getRandomArbitrary(-1, 1) * 100;
        ball.Speed.Y = getRandomArbitrary(-1, 1) * 100;
    });
}