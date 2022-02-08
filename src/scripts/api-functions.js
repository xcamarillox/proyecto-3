// From modules
//
// Development
import allMexico from "./locations.js";


const APIkey = "0daa5082c483deefa2dd813c45f8a087";

const getFullWeatherData = async(selectedItems, wantedIndex) => {
    const latAndLon = getLatAndLon(selectedItems.idxs[wantedIndex])
    const endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${latAndLon.lat}&lon=${latAndLon.lon}&appid=${APIkey}&units=metric`;
    return getWeatherData(endpoint)
}
const getCurrentWeatherData = async(selectedItems, wantedIndex) => {
    const latAndLon = getLatAndLon(selectedItems.idxs[wantedIndex])
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latAndLon.lat}&lon=${latAndLon.lon}&appid=${APIkey}&units=metric`;
    return getWeatherData(endpoint)
}

const getLatAndLon = (idxs) => {
    const latAndLonArr = allMexico[idxs[0]].cities[idxs[1]].coordinates.split(",", 2)
    let latAndLon = {
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
        throw new Error('Request failed!');
    } catch (error) {
        console.log(error);
    }
}

export { getFullWeatherData, getCurrentWeatherData }