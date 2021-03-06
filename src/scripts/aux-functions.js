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

const indexToColor = (index, opacity) => {
    if (opacity == undefined) opacity = 1;
    switch (index) {
        case 0:
            return `rgba(0, 0, 225, ${opacity})`; //blue
        case 1:
            return `rgba(255, 0, 0, ${opacity})`; //red
        case 2:
            return `rgba(0, 128, 0, ${opacity})`; //green
        case 3:
            return `rgba(255, 165, 0, ${opacity})`; //orange
        case 4:
            return `rgba(128, 0, 128, ${opacity})`; //purple
        case 5:
            return `rgba(0, 255, 255, ${opacity})`; //aqua
        default:
            return `rgba(0, 0, 0, ${opacity})`; //black
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

const getWeatherClass = (code) => {
    let icon = parseInt(code.substring(0, 2));
    let dayOrNigth = code.substring(2, 3);
    if (icon == 1 && dayOrNigth == "d") return "fa-solid fa-sun"
    else if (icon == 1 && dayOrNigth == "n") return "fa-solid fa-moon"
    else if (icon == 2 && dayOrNigth == "d") return "fa-solid fa-cloud-sun"
    else if (icon == 2 && dayOrNigth == "n") return "fa-solid fa-cloud-moon"
    else if (icon == 3) return "fa-solid fa-cloud"
    else if (icon == 4) return "fa-solid fa-cloud"
    else if (icon == 9) return "fa-solid fa-cloud-rain"
    else if (icon == 10) return "fa-solid fa-cloud-rain"
    else if (icon == 11) return "fa-solid fa-bolt"
    else if (icon == 13) return "fa-solid fa-snowflake"
    else if (icon == 50) return "fa-solid fa-water"
    else return "fa-solid fa-sun"
}

export { indexToColor, getNextDaysLabels, getWindDirectionLabel, getPlaceNameLabel, getWeatherClass }