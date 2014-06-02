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