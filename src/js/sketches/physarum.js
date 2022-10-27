class Agent {
	constructor(x, y, heading, color, trail, width, height, config){
		this.x = x;
		this.y = y;
		this.heading = heading;
		this.color = color;
		this.trail = trail;
		this.width = width;
		this.height = height;
		this.config = config;
	}
	
	index(x, y) {
		return x + y * this.width;
	}
	
	senseRelativeAngle(sensor_angle, sensor_distance) {
		return this.trail[this.index(
			Math.round(this.x + Math.cos(this.heading + sensor_angle) * sensor_distance),
			Math.round(this.y + Math.sin(this.heading + sensor_angle) * sensor_distance)
		)];
	}
	
	senseAndRotate(sensor_angle, sensor_distance, random_turning, turning_speed) {
		const sense_left   = this.senseRelativeAngle(sensor_angle, sensor_distance);
		const sense_middle = this.senseRelativeAngle(0, sensor_distance);
		const sense_right  = this.senseRelativeAngle(-sensor_angle, sensor_distance);

		const modified_turning = (random_turning ? (Math.random() * 0.5 + 0.5) : 1) * turning_speed;
		let option = -1;
		if (sense_middle > sense_left && sense_middle > sense_right) {
			// no change
			option = 0;
		} else if (sense_left > sense_right) {
			option = 1;
			this.heading += modified_turning;
		} else if (sense_right > sense_left) {
			option = 2;
			this.heading -= modified_turning;
		} else {
			option = 3;
			this.heading += Math.round(Math.random() * 2 - 1) * turning_speed;
		}
		this.last_option = option;
	}
	
	move(speed) {
		this.px = this.x;
		this.py = this.y;
		this.x += speed * Math.cos(this.heading);
		this.y += speed * Math.sin(this.heading);
		if (this.config.wrap_around) {
			if(this.x < 0 || this.x > this.width){
				this.x = (this.x + this.width) % this.width;
				this.px = this.x;
			}
			if(this.y < 0 || this.y > this.height){
				this.y = (this.y + this.height) % this.height;
				this.py = this.y;
			}
		}
	}
	
	deposit(deposit_amount) {
		const x = Math.round(this.x);
		const y = Math.round(this.y);
		if (x > 5 && y > 5 && x < this.width-5 && y < this.height-5)	
			this.trail[this.index(x, y)] += deposit_amount;
	}
}

class Physarum {
	constructor(width, height, drawingContext, texture, textureWidth, textureHeight, config) {
		this.width = width;
		this.height = height;
		this.drawingContext = drawingContext;
		this.texture = texture;
		this.textureWidth = textureWidth;
		this.textureHeight = textureHeight;
		this.config = config;

		this.trail = new Float32Array(width * height);
		
		this.agents = [];
		
		this.weight = [
			1/16,	1/8,	1/16,
			1/8,	1/4,	1/8,
			1/16,	1/8,	1/16,
		];
		
	}
	
	addAgent(x, y, heading, color){
		this.agents.push(new Agent(x, y, heading, color, this.trail, this.width, this.height, this.config));
	}
	
	update(){
		const length = this.agents.length;		
		for (var i = 0; i < length; i++) {
			this.agents[i].senseAndRotate(this.config.sensor_angle, this.config.sensor_distance, this.config.random_turning, this.config.turning_speed);
			this.agents[i].move(this.config.speed);
		}
		
		//deposit
		for (var i = 0; i < length; i++)
			this.agents[i].deposit(this.config.deposit_amount);
		
		//deposit combining with texture data
		for(var y = 0; y < this.textureHeight; y+=2){
			for(var x = 0; x < this.textureWidth; x+=2){
				const indexIn = x + y * this.textureWidth;
				if(this.texture[indexIn] > 0){
					const indexOut = Math.round(x + this.width/2 - this.textureWidth/2) + Math.round(y + this.height/2 - this.textureHeight/2) * this.width;
					this.trail[indexOut] = this.texture[indexIn];
				}
			}
		}
		
		//deposit combining with texture data
		this.diffuseAndDecay();
	}
	
	draw(){
		//this.drawingContext.shadowColor = "green";
		//this.drawingContext.shadowBlur = 5;
		for (var i = 0; i < this.agents.length; i++) {
			this.drawingContext.beginPath();
			this.drawingContext.strokeStyle = this.agents[i].color;
			this.drawingContext.moveTo(this.agents[i].px, this.agents[i].py);
			this.drawingContext.lineTo(this.agents[i].x, this.agents[i].y);
			this.drawingContext.stroke();
		}
		//this.drawingContext.shadowBlur = 0;
		
		
		//debug
		/*
		loadPixels();
		for(var y = 0; y < this.height; y++){
			for(var x = 0; x < this.width; x++){
				const index = x + y * this.width;
				const value = this.trail[index];
				pixels[index * 4 + 0] = value * 255;
				pixels[index * 4 + 1] = value * 255;
				pixels[index * 4 + 2] = value * 255;
				pixels[index * 4 + 4] = 255;
			}
		}
		updatePixels();
		*/
	}

	diffuseAndDecay() {
		let old_trail = Float32Array.from(this.trail);
		for (let y = 1; y < this.height-1; ++y) {
			for (let x = 1; x < this.width-1; ++x) {
				const diffused_value = (
					old_trail[x - 1 + (y - 1) * this.width] * this.weight[0] +
					old_trail[x - 0 + (y - 1) * this.width] * this.weight[1] +
					old_trail[x + 1 + (y - 1) * this.width] * this.weight[2] +
					old_trail[x - 1 + (y + 0) * this.width] * this.weight[3] +
					old_trail[x + 0 + (y + 0) * this.width] * this.weight[4] +
					old_trail[x + 1 + (y + 0) * this.width] * this.weight[5] +
					old_trail[x - 1 + (y + 1) * this.width] * this.weight[6] +
					old_trail[x + 0 + (y + 1) * this.width] * this.weight[7] +
					old_trail[x + 1 + (y + 1) * this.width] * this.weight[8]
				);

				this.trail[x + y * this.width] = Math.min(1.0, diffused_value * this.config.decay_factor);
			}
		}
	}

	reset() {
		this.trail = new Float32Array(this.width * this.height);
		this.agents.splice(0, this.agents.length); // empty list
	}
}

export default Physarum;