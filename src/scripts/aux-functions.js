const getMyChart = (selectedItems, mode) => {
    switch (mode) {
        case 0:
            return currentChart(selectedItems);
        case 1:
            return dailyForecastChart(selectedItems);
        case 2:
            return hourlyForecastChart(selectedItems);
        case 3:
            return currentMultipleChart(selectedItems);
        default:
            return currentChart(selectedItems);
    }
}

const currentChart = (selectedItems) => {
    let xValues = [];
    let yValues = [];
    let barColors = [];
    for (let i = 0; i < selectedItems.dataArr.length; i++) {
        if (selectedItems.dataArr[i] == undefined) continue;
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
    let xValues = ["Hoy", getProximosDias(1), getProximosDias(2), getProximosDias(3), getProximosDias(4), getProximosDias(5), getProximosDias(6), getProximosDias(7)];

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
        if (selectedItems.dataArr[i] == undefined) continue;
        for (let j = 0; j < selectedItems.dataArr[i].daily.length; j++) {
            myChart.data.datasets[i].data.push(selectedItems.dataArr[i].daily[j].temp.day)
        }
    }
    return myChart;
}

const hourlyForecastChart = (selectedItems) => {
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
    for (let i = 0; i < selectedItems.dataArr.length; i++) {
        myChart.data.datasets.push({
            borderColor: indexToColor(i),
            label: selectedItems.namesPathArr[i][0] + " " + selectedItems.namesPathArr[i][1],
            data: []
        })
        if (selectedItems.dataArr[i] == undefined) continue;
        for (let j = 0; j < selectedItems.dataArr[i].hourly.length; j++) {
            myChart.data.datasets[i].data.push(selectedItems.dataArr[i].hourly[j].temp)
        }
    }
    return myChart;
}

const currentMultipleChart = (selectedItems) => {
    let xValues = [];

    let barColors = [];
    for (let i = 0; i < selectedItems.dataArr.length; i++) {
        if (selectedItems.dataArr[i] == undefined) continue;
        xValues.push(selectedItems.namesPathArr[i][0] + " " + selectedItems.namesPathArr[i][1])
            //barColors.push(indexToColor(i))
    }

    let chartOptions = {
        plugins: {
            legend: {
                display: true
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
    for (let i = 0; i < 4; i++) {
        myChart.data.datasets.push({
            backgroundColor: [],
            //fillColor: "red",
            borderColor: "",
            label: "",
            data: []
        })
        for (let j = 0; j < selectedItems.dataArr.length; j++) {
            //myChart.data.datasets[i].backgroundColor.push(indexToColor(j));
            if (i == 0) {
                myChart.data.datasets[i].backgroundColor.push('rgba(255, 159, 64, 0.5)');
                myChart.data.datasets[i].label = "Ahora";
                myChart.data.datasets[i].data.push(selectedItems.dataArr[j].current.temp)
            }
            if (i == 1) {
                myChart.data.datasets[i].backgroundColor.push('rgba(255, 205, 86, 0.5)');
                myChart.data.datasets[i].label = "S.T.";
                myChart.data.datasets[i].data.push(selectedItems.dataArr[j].current.feels_like)
            }
            if (i == 2) {
                myChart.data.datasets[i].backgroundColor.push('rgba(75, 192, 192, 0.5)');
                myChart.data.datasets[i].label = "Max";
                myChart.data.datasets[i].data.push(selectedItems.dataArr[j].daily[0].temp.max)
            }
            if (i == 3) {
                myChart.data.datasets[i].backgroundColor.push('rgba(54, 162, 235, 0.5)');
                myChart.data.datasets[i].label = "Min";
                myChart.data.datasets[i].data.push(selectedItems.dataArr[j].daily[0].temp.min)
            }
        }
    }
    console.log("myChart", myChart)
    return myChart;
}

const getProximosDias = (day, howManyDays) => {

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

export { getMyChart, indexToColor, getProximosDias, getWindDirectionLabel }