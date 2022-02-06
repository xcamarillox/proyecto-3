import axios from "axios"
import allMexico from "./locations.js";


const APIkey = "0daa5082c483deefa2dd813c45f8a087";


const getCurrentWeather = async(selectedItems, wantedIndex) => {
    const latAndLon = getLatAndLon(selectedItems.idxs[wantedIndex])
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${latAndLon.lat}&lon=${latAndLon.lon}&appid=${APIkey}&units=metric`;
    try {
        const response = await axios.get(endpoint, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.status = 200) {
            return response.data;
        }
        throw new Error('Request failed!');
    } catch (error) {
        console.log("error:", error);
    }
}

const getLatAndLon = (idxs) => {
    const latAndLonArr = allMexico[idxs[0]].cities[idxs[1]].coordinates.split(",", 2)
    let latAndLon = {
        lat: latAndLonArr[0].trim(),
        lon: latAndLonArr[1].trim()
    }
    return latAndLon
}

export { getLatAndLon, getCurrentWeather }