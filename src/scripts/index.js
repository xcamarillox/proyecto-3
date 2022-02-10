// From modules
import bootstrap from "bootstrap"
import Vue from "../../node_modules/vue/dist/vue"
import 'regenerator-runtime/runtime'; // async await functions
// Development
import allMexico from "./locations.js";
import { getCompleteWeatherData } from "./api-functions.js";

console.log(allMexico);

const App = new Vue({
    el: '#app',
    data: () => ({
        modalData: {},
        selectListData: {},
        inputsData: {},
        selectedItems: {
            indexPathArr: [],
            namesPathArr: [],
            dataArr: []
        },
    }),
    computed: {

    },
    methods: {
        copyObj(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        initModal(modalMode) {
            let title, inputDataReady, itemIndex;
            this.selectListData = {
                places: [],
                cityToggle: true,
                selectedItemIndex: 0,
                indexPath: []
            }
            this.selectListData.places.push("[SELECCIONA UN ESTADO] >")
            for (const state of allMexico) {
                this.selectListData.places.push(state.name)
            }
            if (this.modalData.hasOwnProperty('title')) title = this.modalData.title;
            if (this.modalData.hasOwnProperty('inputDataReady')) inputDataReady = this.modalData.inputDataReady;
            if (this.modalData.hasOwnProperty('itemIndex')) itemIndex = this.modalData.itemIndex;

            if (modalMode == 0 || modalMode == 1) {
                this.modalData = {
                    selectListDataReady: false,
                    selectListDisabledToggle: false,
                    aceptarButtonDisabledToggle: true,
                    eraseButtonDisabledToggle: true,
                    radioValue: 1
                }
                if (modalMode == 1) {
                    this.modalData.title = "Añade una ubicación";
                    this.modalData.inputDataReady = false;
                    this.modalData.itemIndex = this.selectedItems.indexPathArr.length;
                } else {
                    this.modalData.title = title;
                    this.modalData.inputDataReady = inputDataReady;
                    this.modalData.itemIndex = itemIndex;
                }
            }
            if (modalMode != 0) {
                this.inputsData = {
                    coord: "",
                    alias: ""
                }
            }
        },
        changeOnRadio() {
            if (this.modalData.radioValue == 1 && this.modalData.selectListDataReady ||
                this.modalData.radioValue == 2 && this.modalData.inputDataReady)
                this.modalData.aceptarButtonDisabledToggle = false;
            else this.modalData.aceptarButtonDisabledToggle = true;
        },
        clickOK() {
            let cacheArr = [];
            if (this.modalData.radioValue == 1) {
                cacheArr.push(allMexico[this.selectListData.indexPath[0]].name);
                cacheArr.push(allMexico[this.selectListData.indexPath[0]].cities[this.selectListData.indexPath[1]].name)
                this.selectedItems.indexPathArr.splice(this.modalData.itemIndex, 1, this.copyObj(this.selectListData.indexPath))
                    //this.selectedItems.indexPathArr.push(this.copyObj(this.selectListData.indexPath))
            } else if (this.modalData.radioValue == 2) {
                cacheArr.push(this.inputsData.alias);
                cacheArr.push(this.inputsData.coord);
                this.selectedItems.indexPathArr.splice(this.modalData.itemIndex, 1, [allMexico.length, allMexico.length])
                    //this.selectedItems.indexPathArr.push([allMexico.length, allMexico.length])
            }
            this.selectedItems.namesPathArr.splice(this.modalData.itemIndex, 1, cacheArr)
        },
        changeOnInput() {
            let splitArr = this.inputsData.coord.split(",");
            this.modalData.radioValue = 2;
            this.modalData.inputDataReady = false;
            this.modalData.aceptarButtonDisabledToggle = true;
            if (splitArr.length == 2 &&
                splitArr[0].trim().length > 0 &&
                !isNaN(splitArr[0].trim()) &&
                splitArr[1].trim().length > 0 &&
                !isNaN(splitArr[1].trim())) {
                this.modalData.aceptarButtonDisabledToggle = false;
                this.modalData.inputDataReady = true;
            }
        },
        changeOnSelect(index) {
            this.modalData.radioValue = 1;
            this.selectListData.indexPath.push(index - 1);
            this.modalData.aceptarButtonDisabledToggle = true;
            if (this.selectListData.cityToggle) {
                this.modalData.eraseButtonDisabledToggle = false;
                this.selectListData.selectedItemIndex = 0;
                this.selectListData.places = [];
                this.selectListData.places.push(allMexico[this.selectListData.indexPath[0]].name + " > [SELECCIONA CIUDAD]");
                for (const ciudad of allMexico[index - 1].cities) {
                    this.selectListData.places.push(ciudad.name)
                }
            } else {
                const placePath = this.modalData.placePath = allMexico[this.selectListData.indexPath[0]].name + " > " +
                    allMexico[this.selectListData.indexPath[0]].cities[this.selectListData.indexPath[1]].name;
                this.selectListData.selectedItemIndex = 0;
                this.selectListData.places = [placePath];
                this.modalData.selectListDisabledToggle = true;
                this.modalData.aceptarButtonDisabledToggle = false;
                this.modalData.selectListDataReady = true;
            }
            this.selectListData.cityToggle = !this.selectListData.cityToggle
                //if (!this.selectListCityToggle) this.refreshDashboard();
        },
        deleteItem(index) {
            this.selectedItems.indexPathArr.splice(index, 1);
            this.selectedItems.namesPathArr.splice(index, 1);
        },
        moveItem(index, direction) {
            if (index == 0 && direction == "up") return
            if (index == this.selectedItems.indexPathArr.length - 1 && direction == "down") return
            let expression;
            if (direction == "up") expression = index - 1;
            else expression = index + 1;
            let cacheIndex = this.copyObj(this.selectedItems.indexPathArr[index])
            let cacheName = this.copyObj(this.selectedItems.namesPathArr[index])
            this.selectedItems.indexPathArr.splice(index, 1, this.copyObj(this.selectedItems.indexPathArr[expression]));
            this.selectedItems.namesPathArr.splice(index, 1, this.copyObj(this.selectedItems.namesPathArr[expression]));
            this.selectedItems.indexPathArr.splice(expression, 1, cacheIndex);
            this.selectedItems.namesPathArr.splice(expression, 1, cacheName);
        },
        editItem(index) {
            this.initModal(2);
            const op1Selected = this.selectedItems.indexPathArr[index][0] < allMexico.length;
            this.inputsData.coord = op1Selected ? "" : this.selectedItems.namesPathArr[index][1]
            this.inputsData.alias = op1Selected ? "" : this.selectedItems.namesPathArr[index][0]
            this.modalData = {
                title: "Edita la ubicación",
                itemIndex: index,
                selectListDataReady: op1Selected,
                inputDataReady: !op1Selected,
                selectListDisabledToggle: op1Selected,
                aceptarButtonDisabledToggle: false,
                eraseButtonDisabledToggle: !op1Selected,
                radioValue: op1Selected ? 1 : 2
            }
            if (op1Selected) {
                this.selectListData.places = [];
                this.selectListData.places.push(this.selectedItems.namesPathArr[index][0] + " > " +
                    this.selectedItems.namesPathArr[index][1])
                this.selectListData.indexPath = this.copyObj(this.selectedItems.indexPathArr[index])
            }
        },
        itemColorStyleFunc(index) {
            return "color:" + this.indexToColor(index)
        },
        indexToColor(index) {
            switch (index) {
                case 0:
                    return "blue;";
                case 1:
                    return "red;";
                case 2:
                    return "purple;";
                case 3:
                    return "orange;";
                default:
                    return "black;";
            }
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