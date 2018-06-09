class Sprite{
	constructor(input){
		Object.assign(this, input);
		
		if(this.type === 1){
			this.img = new Image();
			this.img.src = this.src;
			this.img.onload = () => {
				this.ready = true;
			};
		} else {
			if(this.ready === void 0){
				this.ready = true;
			}
		}
	}
	
	draw(){
		if(!this.ready){
			return 0;
		}
		
		var context = this.context;
		var fill = (this.mode || 'stroke') === 'fill';
		
		var x = this.x || 0;
		var y = this.y || 0;
		var size = this.size || 15;
		
		context.save();
		
		context.beginPath();
		context.fillStyle = this.color;
		
		if(this.dir !== void 0){
			context.translate(x, y);
			context.rotate(this.dir * Math.PI / 180);
			context.translate(-x, -y);
		}
		
		switch(this.type || 0){
			case 0:
				context.arc(x, y, size, 0, Math.PI * 2, false);
				fill ? context.fill() : context.stroke();
				break;
				
			case 1:
				var img = this.img;
				var width = this.width || img.width;
				var height = this.height || img.height;
				context.drawImage(img, x - width / 2, y - height / 2, width, height);
				break;
		}
		
		context.restore();
		
		this.update();
	}
	
	update(){
		this.x += this.dx || 0;
		this.y += this.dy || 0;
		this.dir += this.dDir || 0;
		
		if(this.y > height + this.height / 2){
			this.x = this.saveX || 0;
			this.y = -this.height / 2;
		}
	}
}