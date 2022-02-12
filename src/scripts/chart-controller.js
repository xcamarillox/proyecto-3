const getMyChart = (selectedItems, mode) => {
    switch (mode) {
        case 0:
            return currentChart(selectedItems);
        case 1:
            return dailyForecastChart(selectedItems);
        case 2:
            return hourlyForecastChart(selectedItems);
        default:
            return currentChart(selectedItems);
    }
}

const currentChart = (selectedItems) => {
    console.log(selectedItems);
    let xValues = [];
    let yValues = [];
    let barColors = [];
    for (let i = 0; i < selectedItems.dataArr.length; i++) {
        xValues.push(selectedItems.namesPathArr[i][0] + " " + selectedItems.namesPathArr[i][1])
        yValues.push(selectedItems.dataArr[i].current.temp)
        barColors.push(indexToColor(i))
    }
    let chartOptions = {
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Los Climas de Hoy"
            }
        }
    }

    return {
        type: "bar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues,
            }]
        },
        options: chartOptions
    };
}

const dailyForecastChart = (selectedItems) => {
    console.log(selectedItems);
    let xValues = [0, 1, 2, 3, 4, 5, 6, 7];

    let chartOptions = {
        plugins: {
            legend: {
                display: true
            },
            title: {
                display: true,
                text: "Pronostico Diario"
            }
        }
    }
    let myChart = {
        type: "line",
        data: {
            labels: xValues,
            datasets: []
        },
        options: chartOptions
    }
    for (let i = 0; i < selectedItems.dataArr.length; i++) {
        myChart.data.datasets.push({
            borderColor: indexToColor(i),
            label: selectedItems.namesPathArr[i][0] + " " + selectedItems.namesPathArr[i][1],
            data: []
        })
        for (let j = 0; j < selectedItems.dataArr[i].daily.length; j++) {
            myChart.data.datasets[i].data.push(selectedItems.dataArr[i].daily[j].temp.day)
        }
    }
    console.log("myChart", myChart)
    return myChart;
}

const hourlyForecastChart = (selectedItems) => {
    console.log(selectedItems);
    let xValues = []
    for (let i = 0; i < 48; i++) xValues.push(i)

    let chartOptions = {
        plugins: {
            legend: {
                display: true
            },
            title: {
                display: true,
                text: "Pronostico a 48hrs"
            }
        }
    }
    let myChart = {
        type: "line",
        data: {
            labels: xValues,
            datasets: []
        },
        options: chartOptions
    }
    for (let i = 0; i < selectedItems.dataArr.length; i++) {
        myChart.data.datasets.push({
            borderColor: indexToColor(i),
            label: selectedItems.namesPathArr[i][0] + " " + selectedItems.namesPathArr[i][1],
            data: []
        })
        for (let j = 0; j < selectedItems.dataArr[i].hourly.length; j++) {
            myChart.data.datasets[i].data.push(selectedItems.dataArr[i].hourly[j].temp)
        }
    }
    console.log("myChart", myChart)
    return myChart;
}

const indexToColor = (index) => {
    switch (index) {
        case 0:
            return "blue";
        case 1:
            return "red";
        case 2:
            return "green";
        case 3:
            return "orange";
        case 4:
            return "purple";
        case 5:
            return "pink";
        case 6:
            return "olive";
        default:
            return "black;";
    }
}

export { getMyChart, indexToColor }