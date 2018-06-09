const fps = 1000 / 30;

window.onload = () =>{
	ready = false;
	
	init();
	setInterval(main, fps);
	console.log('来場者数をリセットする:\nreset();');
};

function init(){
	visitors = {
		all: 0,
		kids: 0,
		adults: 0
	};
	
	font = {		
		data: ['3_1-1_1-1_2-3_2-3_3-1_3-split-7_1-5_1-5_3-7_3-split-9_3-9_1-11_1-11_2-9_2-split-9_2-11_3-split-13_3-13_1-15_1-15_3-15_2-13_2-split-17_1-19_1-18_1-18_3-split-23_1-21_1-21_3-23_3-split-25_1-25_3-25_2-27_2-27_1-27_3-split-25_1-25_3-25_2-27_2-27_1-27_3','1_1-1_3-2_3-3_2-2_1-1_1-split-5_3-5_1-7_1-7_3-7_2-5_2-split-9_1-10_2-10_3-10_2-11_1-split-13_1-15_1-15_2-13_2-13_3-15_3-split-17_1-17_3-19_3-19_1-17_1-split-17_1-19_3-split-21_1-22_1-22_3-21_3-23_3-split-27_1-25_1-25_2-27_2-27_3-25_3-25_2-27_2-27_1-split'],
		
		dx: 2,
		dy: 0,
		
		id: 0,
		swap: true
	};
	
	font.data[0] += '-split-15_1-15_3-split-17_1-19_1-split-27_3-27_1-split-25_3-25_1-split';
	font.data[1] += '-split-7_1-7_3-split-10_2-10_3-split-23_3-21_3-split';
	
	if(localStorage.count_log === void 0){
		localStorage.count_log = JSON.stringify({all: visitors.all, kids: visitors.kids, adults: visitors.adults});
	} else {
		var data = JSON.parse(localStorage.count_log);
		
		visitors.all = data.all;
		visitors.kids = data.kids;
		visitors.adults = data.adults;
		
		write();
	}
	
	document.getElementsByClassName('main-contents')[0].style.height = `${window.innerHeight - 250}px`;
	size_container = document.getElementsByClassName('canvas-area-container')[0];
	
	canvas = document.getElementsByClassName('canvas-area')[0];
	context = canvas.getContext('2d');
	set_canvas_size();
	
	init_draw_objects();
	create_events();

	scratch_cat = new Sprite({
		saveX: -20,
		
		x: -20,
		y: -50,
		dir: 0,
		
		dx: 1.3,
		dy: 3.1,
		dDir: 3,
		
		width: 100,
		height: 100,
		
		type: 1,
		src: 'image/ScratchCat.394631e812be/Scratch Cat/For Screen_Web/SVG/scratch-cat.svg',
		
		context
	});
	
	tick = 220;
	ready = true;
	snap = new Audio();
	snap.src = 'snap.wav';
}

function init_draw_objects(){
	draw_objects = [];
	for(var y = 0; y < 5; y++){
		for(var x = 0; x < 33; x++){
			draw_objects.push(new Sprite({
				id_x: x,
				id_y: y,
				x: x * (width / 32),
				y: y * (height / 4),
				
				size: 15,
				mode: 'fill',
				color: '#1C1C1C',
				context
			}));
		}
	}
}

function set_canvas_size(){
	canvas.width = size_container.offsetWidth;
	canvas.height = 250;
	
	height = canvas.height;
	width = canvas.width;
}

function create_events(){
	window.addEventListener('resize', () => {
		window.requestAnimationFrame ? setTimeout(init_draw_objects, 0) : init_draw_objects();
	});
}

function main(){	
	if(ready){
		set_canvas_size();
		draw();
		tick++;
	}
}

function draw(){
	context.clearRect(0, 0, width, height);
	
	context.globalAlpha = 0.2;
	draw_objects.map(element => element.draw());
	
	context.globalAlpha = 1;
	
	for(var y_count = 0; y_count < 2; y_count++){
		for(var x_count = 0; x_count < 12; x_count++){
			scratch_cat.draw(width / 12 * x_count, y_count * 100, (y_count + 1) % 2 ? 180 : 0);
		}
	}
	scratch_cat.update();
	
	context.beginPath();
	context.globalAlpha = Math.abs(1 - Math.sin((tick * 0.9) * Math.PI / 180));
	if(context.globalAlpha < Math.pow(10, -7)){
		if(font.swap){
			font.id = !font.id >> 0;
			font.swap = false;
		}
	} else {
		if(!font.swap && context.globalAlpha > 0.1) font.swap = true;
	}
	
	context.lineCap = 'round';
	
	context.lineWidth = 15;
	context.strokeStyle = '#FAFAFA';
	draw_font();
	
	context.lineWidth = 5;
	context.strokeStyle = '#393939';
	draw_font();
}

function draw_font(){
	var pen_up = true;
	font.data[font.id].split(/-/).map(data => {
		if(data === 'split'){
			context.stroke();	
			pen_up = true;
		} else {
			var open = data.split(/_/).map(Number);
			var id_x = open[0] + font.dx;
			var id_y = open[1] + font.dy;
			var x = 0;
			var y = 0;
			
			draw_objects.map(element => {
				if(element.id_x === id_x && element.id_y === id_y){
					x = element.x;
					y = element.y;
				}
			});
			
			if(pen_up){
				context.moveTo(x, y);
				pen_up = false;
			} else {
				context.lineTo(x, y);
			}
		}
	});
}

function increment(type){
	visitors.all++;
	type ? visitors.adults++ : visitors.kids++;
	localStorage.count_log = JSON.stringify({all: visitors.all, kids: visitors.kids, adults: visitors.adults});
	write();
	
	snap.currentTime = 0;
	snap.play();
}

function write(){
	var result = document.getElementsByClassName('count-result');
	result[0].innerText = `来場者数:${visitors.all}人`;
	result[1].innerText = `子供:${visitors.kids}人`;
	result[2].innerText = `大人:${visitors.adults}人`;
}

function reset(){
	var x = (Math.random() * 20 >> 0) + 9;
	var y = (Math.random() * 20 >> 0) + 9;
	
	if(prompt(`${x} + ${y} = ?`) >> 0 === x + y){
		localStorage.removeItem('count_log');
		
		Object.keys(visitors).map(key => visitors[key] = 0);
		write();		
		
		alert('来場者数をリセットしました');
	}
}