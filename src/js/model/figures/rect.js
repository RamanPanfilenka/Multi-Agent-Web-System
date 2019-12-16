export class Rect{
	constructor(x, y, potencdialRadius){
		this.X = x;
		this.Y = y;
		this.PotencdialRadius = potencdialRadius;
	}

	GetPotencial(x, y, deviation = 0){
		let inPotencial = false;
		let pathX = Math.abs(x - this.X);
    	let pathY = Math.abs(y - this.Y);
		if(pathX < this.PotencdialRadius + deviation && pathY < this.PotencdialRadius + deviation){
			inPotencial = true;
		}

		return inPotencial;
	}

	DrawPotencial(ctx){
		ctx.beginPath();
		ctx.rect(this.X-this.PotencdialRadius, this.Y-this.PotencdialRadius, 2*this.PotencdialRadius,2*this.PotencdialRadius);
		var old = ctx.lineWidth;
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.lineWidth = old;
	}
}