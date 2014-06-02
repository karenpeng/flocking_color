var stats = [{
		label: 'seperation',
		value: 2
}, {
		label: 'aligment',
		value: 0.6
}, {
		label: 'cohesion',
		value: 0.4
}];

var gui = new Vue({
		el: '#gui',
		data: {
				stats: stats
		}
});