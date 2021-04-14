const ctx = document.getElementById("chart").getContext("2d");
const errorP = document.getElementById("error");

const chart = new Chart(ctx, {
	type: "line",
	data: {
		labels: [],
		datasets: [
			{
				label: "",
				data: []
			}
		],
	},
	options: {
		responsive: true,
		scales: {
			yAxes: [{
				ticks: {
					userCallback: function(v) { return epoch_to_hh_mm_ss(v) },
					stepSize: 30 * 60
				}
			}]
		},
		tooltips: {
			callbacks: {
				label: function(tooltipItem, data) {
					return data.datasets[tooltipItem.datasetIndex].label + ': ' + epoch_to_hh_mm_ss(tooltipItem.yLabel)
				}
			}
		},
		plugins: {
			legend: {display: false},
			title: {display: false},
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

	console.log(data)

	data.forEach(dataEntry => {
		labels.push(dataEntry.Tijdstip);
		datasetData.push(dataEntry.Timertijdseconds);
	})

	chart.data.labels = labels;
	chart.data.datasets[0].data = datasetData;
	chart.update();
}

function epoch_to_hh_mm_ss(epoch) {
	return new Date(epoch*1000).toISOString().substr(12, 7)
}