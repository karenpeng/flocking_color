var stats = [{
		label: 'seperation',
		value: 1.5
}, {
		label: 'aligment',
		value: 1
}, {
		label: 'cohesion',
		value: 1
}];

var gui = new Vue({
		el: '#gui',
		data: {
				stats: stats
		}
});

var colors = [{
		number: 0,
		color: flock.boids[0].color
}, {
		number: 1,
		color: flock.boids[1].color
}, {
		number: 2,
		color: flock.boids[2].color
}, {
		number: 3,
		color: flock.boids[3].color
}, {
		number: 4,
		color: flock.boids[4].color
}];

var result = new Vue({
		el: '#result',
		data: {
				colors: colors
		}
});