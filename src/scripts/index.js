import Vue from "../../node_modules/vue/dist/vue"
import allMexico from "./locations.js";

console.log(allMexico);


const App = new Vue({
    el: '#app',
    data: () => ({
        selectListFirstItemText: "Selecciona un estado...",
        selectListCityToggle: false,
        selectListItemIndex: 0,
        currentSelection: 0,
        selectedItems: {
            idxs: [],
            names: []
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
            console.log(this.selectedItems.names);
            return !(this.selectedItems.names.length > 3 && this.selectedItems.names[this.selectedItems.names.length - 1][1] != undefined);
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
                this.selectedItems.names[this.selectedItems.names.length - 1].push(allMexico[this.currentSelection].cities[index - 1].name);
                this.places = allMexico;
            }
            this.selectListItemIndex = 0;
            this.currentSelection = index - 1;
            this.selectListCityToggle = !this.selectListCityToggle
            this.selectedItems.idxs[this.selectedItems.idxs.length - 1].push(index - 1);
        }
    },
    watch: {},
})