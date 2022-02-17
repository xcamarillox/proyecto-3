// Development
import { indexToColor, getPlaceNameLabel, getNextDaysLabels } from "./aux-functions.js";

const getMyChart = (itemsArr, mode) => {
    switch (mode) {
        case 0:
            return lineChartMultipleDataset(itemsArr, {
                pathArr: ["daily", "temp", "max"],
                title: "Pronostico a 7 dias de Max"
            });
        case 1:
            return lineChartMultipleDataset(itemsArr, {
                pathArr: ["hourly", "temp"],
                title: "Pronostico por horas (48hrs) de Temp"
            });
        case 2:
            return barChartMultipleDataset(itemsArr, {
                pathArr: [
                    ["current", "temp"]
                ],
                dataSetLabel: ["Ahora"],
                title: "Temperatura Ahora"
            });
        case 3:
            return barChartMultipleDataset(itemsArr, {
                pathArr: [
                    ["daily", 0, "temp", "max"],
                    ["daily", 0, "temp", "min"],
                    ["current", "temp"],
                    ["current", "feels_like"],
                ],
                dataSetLabel: ["Max", "Min", "Hoy", "S.T."],
                title: "Hoy"
            });
        default:
            return lineChartMultipleDataset(itemsArr, {
                pathArr: ["hourly", "temp"],
                title: "Pronostico por horas (48hrs) de Temp"
            });
    }
}

const barChartMultipleDataset = (itemsArr, setupObjt) => {
    let pathArr = setupObjt.pathArr;
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
                text: setupObjt.title
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
            myChart.data.datasets[i].label = setupObjt.dataSetLabel[i];
            myChart.data.datasets[i].data.push(itemsSingleDataValue)
        }
        if (i == 0 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(255, 159, 64, 0.5)');
        else if (i == 1 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(54, 162, 235, 0.5)');
        else if (i == 2 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(75, 192, 192, 0.5)');
        else if (i == 3 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(255, 205, 86, 0.5)');
        else if (pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(201, 203, 207, 0.5)');
    }
    return myChart;
}

const lineChartMultipleDataset = (itemsArr, setupObjt) => {
    let pathArr = setupObjt.pathArr;
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
                text: setupObjt.title
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
            for (let k = 1; k < pathArr.length; k++) itemsSingleDataValue = itemsSingleDataValue[pathArr[k]];
            myChart.data.datasets[i].data.push(itemsSingleDataValue)
        }
    }
    return myChart;
}

export { getMyChart }