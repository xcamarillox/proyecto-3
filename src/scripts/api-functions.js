// Development
import allMexico from "./locations.js";

const APIkey = "0daa5082c483deefa2dd813c45f8a087";

const getCompleteWeatherData = async(selectedItems, wantedIndex, wantedUnits) => {
    let weatherData = {
        dataArray: [],
        isReturnAllMode: false
    };
    let indexCount = 1;
    let latAndLon, endpoint;
    let expression = wantedIndex == -1 || selectedItems.indexPathArr[wantedIndex] == undefined;
    if (expression) {
        indexCount = selectedItems.indexPathArr.length;
        weatherData.isReturnAllMode = true;
    };
    for (let i = 0; i < indexCount; i++) {
        latAndLon = getLatAndLon(selectedItems.indexPathArr[expression ? i : wantedIndex], selectedItems.namesPathArr[expression ? i : wantedIndex])
        endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${latAndLon.lat}&lon=${latAndLon.lon}&appid=${APIkey}&units=${wantedUnits}`;
        weatherData.dataArray.push(await getWeatherData(endpoint));
    }
    return weatherData;
}

//const getCurrentWeatherData = async(selectedItems, wantedIndex, units) => {}

const getLatAndLon = (indexPath, namesPath) => {
    let latAndLon;
    let latAndLonArr;
    if (indexPath[0] >= allMexico.length || indexPath[1] >= allMexico[indexPath[0]].cities.length) {
        latAndLonArr = namesPath[1].split(",", 2);
    } else {
        latAndLonArr = allMexico[indexPath[0]].cities[indexPath[1]].coordinates.split(",", 2)
    }
    latAndLon = {
        lat: latAndLonArr[0].trim(),
        lon: latAndLonArr[1].trim()
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