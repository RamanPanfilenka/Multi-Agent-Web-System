export class Circle{
	constructor(x, y, potencdialRadius){
		this.X = x;
		this.Y = y;
		this.PotencdialRadius = potencdialRadius;
	}

	GetPotencial(x, y, deviation = 0){
		let inPotencial = false;
		let pathX = Math.abs(x - this.X);
		let pathY = Math.abs(y - this.Y);
		if(Math.sqrt(pathX*pathX+pathY*pathY) < this.PotencdialRadius + deviation){
			inPotencial = true;
		}
	
		return inPotencial;
	}

	DrawPotencial(ctx){
		ctx.beginPath();
		ctx.arc(this.X, this.Y, this.PotencdialRadius, 0, Math.PI*2, false);
		var old = ctx.lineWidth;
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.lineWidth = old;
	}
}
