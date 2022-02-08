// From modules
import Vue from "../../node_modules/vue/dist/vue"
import 'regenerator-runtime/runtime'; // async await functions
// Development
import allMexico from "./locations.js";
import { getCompleteWeatherData } from "./api-functions.js";

console.log(allMexico);


const App = new Vue({
    el: '#app',
    data: () => ({
        selectListFirstItemText: "Selecciona un estado...",
        selectListCityToggle: false,
        selectListItemIndex: 0,
        selectedItems: {
            idxs: [],
            names: [],
            data: []
        },
        places: allMexico
    }),
    computed: {

    },
    methods: {
        copyObj(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        selectListShowToggle: function() {
            return !(this.selectedItems.names.length > 3 &&
                this.selectedItems.names[this.selectedItems.names.length - 1][1] != undefined);
        },
        clickOnSelect(index) {
            if (!this.selectListCityToggle) {
                this.selectedItems.idxs[this.selectedItems.idxs.length] = [];
                this.selectedItems.names[this.selectedItems.names.length] = [];
                this.selectedItems.names[this.selectedItems.names.length - 1].push(allMexico[index - 1].name);
                this.selectListFirstItemText = "Selecciona una cuidad...";
                this.places = allMexico[index - 1].cities;
            } else {
                this.selectListFirstItemText = "Selecciona un estado...";
                this.selectedItems.names[this.selectedItems.names.length - 1].push(allMexico[this.selectedItems.idxs[this.selectedItems.idxs.length - 1]].cities[index - 1].name);
                this.places = allMexico;
            }
            this.selectedItems.idxs[this.selectedItems.idxs.length - 1].push(index - 1);
            this.selectListCityToggle = !this.selectListCityToggle;
            this.selectListItemIndex = 0;
            if (!this.selectListCityToggle) this.refreshDashboard();
        },
        async getWeather() {
            console.log("getWeather", await getCompleteWeatherData(this.selectedItems, -1, "metric"))
        },
        async refreshDashboard() {
            console.log("this.selectedItems", this.selectedItems)
            console.log("getCompleteWeatherData:", await getCompleteWeatherData(this.selectedItems, this.selectedItems.names.length - 1), "metric")
        }
    },
    watch: {},
})