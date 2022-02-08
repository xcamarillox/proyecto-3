// Development
import allMexico from "./locations.js";

const APIkey = "0daa5082c483deefa2dd813c45f8a087";

const getCompleteWeatherData = async(selectedItems, wantedIndex, units) => {
    let weatherData = {
        dataArray: [],
        isReturnAllMode: false
    };
    let indexCount = 1;
    let latAndLon, endpoint;
    if (wantedIndex == -1 || selectedItems.idxs[wantedIndex] == undefined) {
        indexCount = selectedItems.idxs.length
        weatherData.isReturnAllMode = true
    };
    for (let i = 0; i < indexCount; i++) {
        latAndLon = getLatAndLon(selectedItems.idxs[i])
        endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${latAndLon.lat}&lon=${latAndLon.lon}&appid=${APIkey}&units=${units}`;
        weatherData.dataArray.push(await getWeatherData(endpoint));
    }
    return weatherData;
}

//const getCurrentWeatherData = async(selectedItems, wantedIndex, units) => {}

const getLatAndLon = (idxs) => {
    let latAndLon
    if (idxs[0] > allMexico[idxs[0]].length || idxs[1] > allMexico[idxs[0]].cities[idxs[1]].length) {
        // TODO
    } else {
        const latAndLonArr = allMexico[idxs[0]].cities[idxs[1]].coordinates.split(",", 2)
        latAndLon = {
            lat: latAndLonArr[0].trim(),
            lon: latAndLonArr[1].trim()
        }
    }
    return latAndLon
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