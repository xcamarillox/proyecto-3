// Development
import { indexToColor, getPlaceNameLabel, getNextDaysLabels } from "./aux-functions.js";

const getMyChart = (itemsArr, mode) => {
    switch (mode) {
        case 0:
            return barChartSingleDataset(itemsArr, ["current", "temp"]);
        case 1:
            return dailyForecastChart(itemsArr);
        case 2:
            return hourlyForecastChart(itemsArr);
        case 3:
            return barChartMultipleDataset(itemsArr, [
                ["current", "temp"]
            ], ["dataSetLabel"]);
        case 4:
            return barChartMultipleDataset(itemsArr, [
                ["current", "temp"],
                ["current", "feels_like"],
                ["daily", 0, "temp", "max"],
                ["daily", 0, "temp", "min"],
            ], ["Hoy", "S.T.", "Max", "Min"]);
        case 5:
            return lineChartMultipleDataset(itemsArr, ["daily", "temp", "max"]);
        default:
            return currentChart(itemsArr);
    }
}

const barChartSingleDataset = (itemsArr, pathArr) => {
    let xValues = [];
    let yValues = [];
    let barColors = [];
    let itemsSingleDataValue;
    for (let i = 0; i < itemsArr.length; i++) {
        itemsSingleDataValue = itemsArr[i].data;
        for (let j = 0; j < pathArr.length; j++) itemsSingleDataValue = itemsSingleDataValue[pathArr[j]];
        xValues.push(getPlaceNameLabel(itemsArr, i))
        yValues.push(itemsSingleDataValue) //.current.temp
        barColors.push(indexToColor(itemsArr[i].selectedItemsIndex))
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

const dailyForecastChart = (itemsArr) => {
    let xValues = ["Hoy", getNextDaysLabels(1), getNextDaysLabels(2), getNextDaysLabels(3),
        getNextDaysLabels(4), getNextDaysLabels(5), getNextDaysLabels(6), getNextDaysLabels(7)
    ];

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
    for (let i = 0; i < itemsArr.length; i++) {
        myChart.data.datasets.push({
            borderColor: indexToColor(itemsArr[i].selectedItemsIndex),
            backgroundColor: "whitesmoke",
            label: getPlaceNameLabel(itemsArr, i),
            data: []
        })
        if (itemsArr[i].data == undefined) continue;
        for (let j = 0; j < itemsArr[i].data.daily.length; j++) {
            myChart.data.datasets[i].data.push(itemsArr[i].data.daily[j].temp.day)
        }
    }
    return myChart;
}

const hourlyForecastChart = (itemsArr) => {
    let xValues = []
    for (let i = 0; i < 48; i++) xValues.push((i + 1) + "Hr")

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
    for (let i = 0; i < itemsArr.length; i++) {
        myChart.data.datasets.push({
            borderColor: indexToColor(itemsArr[i].selectedItemsIndex),
            backgroundColor: "whitesmoke",
            label: getPlaceNameLabel(itemsArr, i),
            data: []
        })
        if (itemsArr[i].data == undefined) continue;
        for (let j = 0; j < itemsArr[i].data.hourly.length; j++) {
            myChart.data.datasets[i].data.push(itemsArr[i].data.hourly[j].temp)
        }
    }
    return myChart;
}

const barChartMultipleDataset = (itemsArr, pathArr, dataSetLabel) => {
    let xValues = [];
    for (let i = 0; i < itemsArr.length; i++) {
        if (itemsArr[i].data == undefined) continue;
        xValues.push(getPlaceNameLabel(itemsArr, i))
    }
    let chartOptions = {
        plugins: {
            legend: {
                display: pathArr.length > 1
            },
            title: {
                display: true,
                text: "Los Climas de Hoy"
            }
        }
    }
    let myChart = {
        type: "bar",
        data: {
            labels: xValues,
            datasets: []
        },
        options: chartOptions
    }
    let itemsSingleDataValue;
    for (let i = 0; i < pathArr.length; i++) {
        myChart.data.datasets.push({
            backgroundColor: [],
            borderColor: "",
            label: [],
            data: []
        })
        for (let j = 0; j < itemsArr.length; j++) {
            itemsSingleDataValue = itemsArr[j].data;
            if (pathArr.length == 1) myChart.data.datasets[0].backgroundColor.push(indexToColor(itemsArr[j].selectedItemsIndex));
            for (let k = 0; k < pathArr[i].length; k++) itemsSingleDataValue = itemsSingleDataValue[pathArr[i][k]];
            myChart.data.datasets[i].label = dataSetLabel[i];
            myChart.data.datasets[i].data.push(itemsSingleDataValue)
        }
        if (i == 0 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(75, 192, 192, 0.5)');
        else if (i == 1 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(255, 205, 86, 0.2)');
        else if (i == 2 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(255, 159, 64, 0.5)');
        else if (i == 3 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(54, 162, 235, 0.5)');
        else if (pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(201, 203, 207, 0.5)');
    }
    return myChart;
}

const lineChartMultipleDataset = (itemsArr, pathArr) => {
    let xValues = []
    if (pathArr[0] == "daily")
        xValues = ["Hoy", getNextDaysLabels(1), getNextDaysLabels(2), getNextDaysLabels(3),
            getNextDaysLabels(4), getNextDaysLabels(5), getNextDaysLabels(6), getNextDaysLabels(7)
        ];
    else
        for (let i = 0; i < 48; i++) xValues.push((i + 1) + "Hr")

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
    let itemsSingleDataValue;
    for (let i = 0; i < itemsArr.length; i++) {
        myChart.data.datasets.push({
            borderColor: indexToColor(itemsArr[i].selectedItemsIndex),
            backgroundColor: "whitesmoke",
            label: getPlaceNameLabel(itemsArr, i),
            data: []
        })
        itemsSingleDataValue = itemsArr[i].data;
        for (let j = 0; j < itemsArr[i].data[pathArr[0]].length; j++) {
            itemsSingleDataValue = itemsArr[i].data[pathArr[0]][j];
            console.log(itemsSingleDataValue);
            for (let k = 1; k < pathArr.length; k++) itemsSingleDataValue = itemsSingleDataValue[pathArr[k]];
            myChart.data.datasets[i].data.push(itemsSingleDataValue)
        }
    }
    console.log(myChart)
    return myChart;
}

export { getMyChart }