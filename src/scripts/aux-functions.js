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
            label: getPlaceNameLabel[i],
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
    let itemsSingleDataValue, flag;
    for (let i = 0; i < pathArr.length; i++) {
        myChart.data.datasets.push({
            backgroundColor: [],
            borderColor: "",
            label: [],
            data: []
        })
        flag = true;
        for (let j = 0; j < itemsArr.length; j++) {
            itemsSingleDataValue = itemsArr[j].data;
            if (pathArr.length == 1) myChart.data.datasets[0].backgroundColor.push(indexToColor(itemsArr[j].selectedItemsIndex));
            if (flag) {
                //myChart.data.datasets[i].label = dataSetLabel[j];
                //flag = !flag
            }
            for (let k = 0; k < pathArr[i].length; k++) {
                itemsSingleDataValue = itemsSingleDataValue[pathArr[i][k]];
                if (flag) {
                    myChart.data.datasets[i].label = dataSetLabel[k];
                    flag = !flag
                }
                //myChart.data.datasets[i].label.push(dataSetLabel[k]);
            };
            myChart.data.datasets[i].data.push(itemsSingleDataValue)
        }

        if (i == 0 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(75, 192, 192, 0.5)');
        else if (i == 1 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(255, 205, 86, 0.2)');
        else if (i == 2 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(255, 159, 64, 0.5)');
        else if (i == 3 && pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(54, 162, 235, 0.5)');
        else if (pathArr.length > 1) myChart.data.datasets[i].backgroundColor.push('rgba(201, 203, 207, 0.5)');
        console.log("myChart", myChart)
    }
    return myChart;
}
const getPlaceNameLabel = (itemsArr, index) => {
    return itemsArr[index].namesPathArr[0].length == 0 ?
        itemsArr[index].namesPathArr[1] :
        itemsArr[index].namesPathArr[0] + ' > ' + itemsArr[index].namesPathArr[1]
}

const getNextDaysLabels = (day, howManyDays) => {

    let diaNombre = new Array(7);
    diaNombre[0] = "Domingo";
    diaNombre[1] = "Lunes";
    diaNombre[2] = "Martes";
    diaNombre[3] = "Miercoles";
    diaNombre[4] = "Jueves";
    diaNombre[5] = "Viernes";
    diaNombre[6] = "Sabado";

    if (day < 0) {
        let proximosDias = [];
        for (let i = 0; i < howManyDays; i++) {
            proximosDias[i] = diaNombre[(new Date(new Date(new Date()).setDate(new Date(new Date()).getDate() + i))).getDay()] +
                " " + (new Date(new Date(new Date()).setDate(new Date(new Date()).getDate() + i))).getDate()
        }
        return proximosDias
    } else {
        return diaNombre[(new Date(new Date(new Date()).setDate(new Date(new Date()).getDate() + day))).getDay()] +
            " " + (new Date(new Date(new Date()).setDate(new Date(new Date()).getDate() + day))).getDate()
    }
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

const getWindDirectionLabel = (windDeg) => {
    if (windDeg >= 349 || windDeg <= 11) {
        return 'N'
    } else if (windDeg >= 12 && windDeg <= 33) {
        return 'NNE'
    } else if (windDeg >= 34 && windDeg <= 56) {
        return 'NE'
    } else if (windDeg >= 57 && windDeg <= 78) {
        return 'ENE'
    } else if (windDeg >= 79 && windDeg <= 101) {
        return 'E'
    } else if (windDeg >= 102 && windDeg <= 123) {
        return 'ESE'
    } else if (windDeg >= 124 && windDeg <= 146) {
        return 'SE'
    } else if (windDeg >= 147 && windDeg <= 168) {
        return 'SSE'
    } else if (windDeg >= 169 && windDeg <= 191) {
        return 'S'
    } else if (windDeg >= 192 && windDeg <= 213) {
        return 'SSO'
    } else if (windDeg >= 214 && windDeg <= 236) {
        return 'SO'
    } else if (windDeg >= 237 && windDeg <= 258) {
        return 'OSO'
    } else if (windDeg >= 259 && windDeg <= 281) {
        return 'O'
    } else if (windDeg >= 282 && windDeg <= 303) {
        return 'ONO'
    } else if (windDeg >= 304 && windDeg <= 326) {
        return 'NO'
    } else if (windDeg >= 327 && windDeg <= 348) {
        return 'NNO'
    }
    /*
        N = North (349 - 011 degrees)
        NNE = North-Northeast (012-033 degrees)
        NE = Northeast (034-056 degrees)
        ENE = East-Northeast (057-078 degrees)
        E = East (079-101 degrees)
        ESE = East-Southeast (102-123 degrees)
        SE = Southeast (124-146 degrees)
        SSE = South-Southeast (147-168 degrees)
        S = South (169-191 degrees)
        SSO = South-Southwest (192-213 degrees)
        SO = Southwest (214-236 degrees)
        OSO = West-Southwest (237-258 degrees)
        O = West (259-281 degrees)
        ONO = West-Northwest (282-303 degrees)
        NO = Northwest (304-326 degrees)
        NNO = North-Northwest (327-348 degrees)
    */
}

export { getMyChart, indexToColor, getNextDaysLabels, getWindDirectionLabel, getPlaceNameLabel }