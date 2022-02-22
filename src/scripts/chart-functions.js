// Development
import { indexToColor, getPlaceNameLabel, getNextDaysLabels } from "./aux-functions.js";

const getMyChart = (itemsArr, mode) => {
    if (mode[0] < 9) { // Día específico
        let day = mode[0] - 1;
        if (mode[0] == 1 && mode[1] == 1) return barChartMultipleDataset(itemsArr, {
            pathArr: [
                ["daily", 0, "temp", "max"],
                ["daily", 0, "temp", "min"],
                ["current", "temp"],
                ["current", "feels_like"],
            ],
            dataSetLabel: ["Max", "Min", "Ahora", "S.T."],
            title: "Temperatura Max, Min, Ahora y S.T: Hoy [°C]"
        })
        else if (mode[0] != 1 && mode[1] == 1) return barChartMultipleDataset(itemsArr, {
            pathArr: [
                ["daily", day, "temp", "max"],
                ["daily", day, "temp", "min"],
            ],
            dataSetLabel: ["Max", "Min"],
            title: `Temperatura Max y Min: ${getNextDaysLabels(day)} [°C]`
        })
        else if (mode[1] == 2) return barChartMultipleDataset(itemsArr, {
            pathArr: [
                ["daily", day, "pop"],
                ["daily", day, "humidity"],
            ],
            dataSetLabel: ["PoP", "Humedad"],
            title: `PoP y Humedad: ${day == 0 ? "Hoy" : getNextDaysLabels(day)} [%]`
        })
        else if (mode[1] == 3) return barChartMultipleDataset(itemsArr, {
            pathArr: [
                ["daily", day, "wind_speed"],
            ],
            dataSetLabel: ["Velocidad del Viento [km/h]"],
            title: `Velocidad del Viento: ${day == 0 ? "Hoy" : getNextDaysLabels(day)} [km/h]`
        })
        else if (mode[1] == 4) return barChartMultipleDataset(itemsArr, {
            pathArr: [
                ["daily", day, "pressure"],
            ],
            dataSetLabel: ["Presión [hPa]"],
            title: `Presión: ${day == 0 ? "Hoy" : getNextDaysLabels(day)} [hPa]`
        })
    } else if (mode[0] == 9) { // 7 Días
        if (mode[1] == 1) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["daily", "temp", "max"],
            title: "Pronóstico a 7 días de la Temperatura Max [°C]"
        });
        if (mode[1] == 2) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["daily", "temp", "min"],
            title: "Pronóstico a 7 días de la Temperatura Min [°C]"
        });
        if (mode[1] == 3) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["daily", "pop"],
            title: "Pronóstico a 7 días de Probabilidad de Precipitación (PoP) [%]"
        });
        if (mode[1] == 4) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["daily", "humidity"],
            title: "Pronóstico a 7 días de la Humedad [%]"
        });
        if (mode[1] == 5) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["daily", "wind_speed"],
            title: "Pronóstico a 7 días la Velocidad del Viento [km/h]"
        });
        if (mode[1] == 6) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["daily", "pressure"],
            title: "Pronóstico a 7 días de la Presión [hPa]"
        });
    } else if (mode[0] == 10) { // 48hr
        if (mode[1] == 1) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["hourly", "temp"],
            title: "Pronóstico a 48 horas de la Temperatura [°C]"
        });
        if (mode[1] == 2) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["hourly", "pop"],
            title: "Pronóstico a 48 horas de Probabilidad de Precipitación (PoP) [%]"
        });
        if (mode[1] == 3) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["hourly", "wind_speed"],
            title: "Pronóstico a 48 horas de la Velocidad del Viento [km/h]"
        });
        if (mode[1] == 4) return lineChartMultipleDataset(itemsArr, {
            pathArr: ["hourly", "pressure"],
            title: "Pronóstico a 48 horas de la Presión [hPa]"
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
                font: {
                    size: 18,
                    weight: 'normal'
                },
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
            if (pathArr.length == 1) myChart.data.datasets[0].backgroundColor.push(indexToColor(itemsArr[j].selectedItemsIndex, 0.5));
            for (let k = 0; k < pathArr[i].length; k++) itemsSingleDataValue = itemsSingleDataValue[pathArr[i][k]];
            if (pathArr[i][pathArr[i].length - 1] == "pop") itemsSingleDataValue *= 100; //pop to percentage
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
                font: {
                    size: 18,
                    weight: 'normal'
                },
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
            if (pathArr[pathArr.length - 1] == "pop") itemsSingleDataValue *= 100; //pop to percentage
            myChart.data.datasets[i].data.push(itemsSingleDataValue)
        }
    }
    return myChart;
}

export { getMyChart }