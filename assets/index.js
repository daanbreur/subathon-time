const ctx = document.getElementById("chart").getContext("2d");
const errorP = document.getElementById("error");

const chart = new Chart(ctx, {
	type: "line",
	data: {
		labels: [],
		datasets: [
			{
				data: [],
				backgroundColor: 'rgba(255,255,255,1)',
				borderColor: 'rgba(255,255,255,1)',
				color: 'rgba(255,255,255,1)',
			}
		],
	},
	options: {
		responsive: true,
		scales: {
			y: {
				min: 0,
				suggestedMax: 60 * 60,
				ticks: {
					display: true,
					color: 'rgba(255,255,255,1)',
					callback: function(value) { return seconds_to_hms(value) + ' uur' },
					stepSize: 60,
				},
				grid: {
					display: false,
				}
			},
			x: {
				ticks: {
					color: 'rgba(255,255,255,1)',
				},
				grid: {
					display: false,
				}
			}
		},
		plugins: {
			legend: {display: false},
			title: {display: false},
			tooltip: {
				callbacks: {
					label: () => null,
					footer: (tooltipItems) => seconds_to_hms(tooltipItems[0].raw) + ' uur'
				}
			},
			custom_canvas_background_color: {
				beforeDraw: (chart) => {
					const ctx = chart.canvas.getContext('2d');
					ctx.save();
					ctx.globalCompositeOperation = 'destination-over';
					ctx.fillStyle = 'lightGreen';
					ctx.fillRect(0, 0, chart.width, chart.height);
					ctx.restore();
				}
			}
		},
	}
});

Papa.parse("https://cdn.daanbreur.systems/Serpentgameplay_Timer.csv", {
	download: true,
	delimiter: ",",
	header: true,
	error: function () {
		errorP.innerText = `Er is een error gebeurt, probeer later opnieuw`
	},
	complete: function (results, file) {
		parseData(results)
	},
});

const parseData = async ({data}) => {
	let labels = [], datasetData = [];

	data.forEach(dataEntry => {
		if (dataEntry.Timertijd != "") {
			labels.push(dataEntry.Tijdstip);
			datasetData.push(hms_to_seconds(dataEntry.Timertijd));
		}
	})

	chart.data.labels = labels;
	chart.data.datasets[0].data = datasetData;
	chart.update();
}

function hms_to_seconds(hmsInput) {
	let a = hmsInput.split(':');
	let seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
	return seconds;
}

function seconds_to_hms(seconds) {
	return new Date(seconds*1000).toISOString().substr(11, 5);
}