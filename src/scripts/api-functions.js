// Development
import allMexico from "./locations.js";

const APIkey = "0daa5082c483deefa2dd813c45f8a087";

const getCompleteWeatherData = async(selectedItems, wantedIndex, wantedUnits) => {
    let weatherData = {
        dataArray: [],
        isReturnAllMode: false
    };
    let indexCount = 1;
    let coordObjt, endpoint;
    //let expression = wantedIndex == -1 || selectedItems.selectedArr[wantedIndex] == undefined || selectedItems.selectedArr[wantedIndex][1] == undefined;
    let expression = wantedIndex < 0 || selectedItems[wantedIndex].coord == undefined;
    if (expression) {
        indexCount = selectedItems.length;
        weatherData.isReturnAllMode = true;
    };
    for (let i = 0; i < indexCount; i++) {
        coordObjt = getLatAndLon(selectedItems[expression ? i : wantedIndex].coord)
        endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordObjt.lat}&lon=${coordObjt.lon}&appid=${APIkey}&units=${wantedUnits}`;
        weatherData.dataArray.push(await getWeatherData(endpoint));
    }
    return weatherData;
}

//const getCurrentWeatherData = async(selectedItems, wantedIndex, units) => {}

const getLatAndLon = (coord) => {
    let latAndLonArr = coord.split(",", 2);
    let coordObjt = {
        lat: latAndLonArr[0].trim(),
        lon: latAndLonArr[1].trim()
    }
    return coordObjt
}

const getWeatherData = async(endpoint) => {
    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        }
        throw new Error('Request failed! Response...', response);
    } catch (error) {
        console.log(error);
    }
}

export { getCompleteWeatherData }