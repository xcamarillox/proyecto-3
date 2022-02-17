// From modules
import bootstrap from "bootstrap"
import Vue from "../../node_modules/vue/dist/vue"
import Chart from 'chart.js/auto';
import 'regenerator-runtime/runtime'; // async await functions
// Development
import allMexico from "./locations.js";
import { getCompleteWeatherData } from "./api-functions.js";
import {
    getMyChart,
    indexToColor,
    getNextDaysLabels,
    getPlaceNameLabel,
    getWindDirectionLabel
} from "./aux-functions.js";

const App = new Vue({
    el: '#app',
    data: () => ({
        proximosDias: getNextDaysLabels(-1, 9),
        etiquetasLugares: getPlaceNameLabel,
        myChart: null,
        modalData: {},
        selectListData: {},
        inputsData: {},
        selectedItems: [
            //{
            //selectedOp: 1,
            //coord: "40.73,-73.93"
            //namesPathArr: [],
            //data: [],
            //status: "pending"
            //}
        ],
        itemsToShow: [],
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
                    this.modalData.itemIndex = this.selectedItems.length;
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
            let selectedItem = {
                selectedOp: 0,
                coord: "",
                namesPathArr: [],
                data: [undefined],
                status: "",

            }
            if (this.modalData.radioValue == 1) {
                cacheArr.push(allMexico[this.selectListData.indexPath[0]].name);
                cacheArr.push(allMexico[this.selectListData.indexPath[0]].cities[this.selectListData.indexPath[1]].name);
                selectedItem.coord = allMexico[this.selectListData.indexPath[0]].cities[this.selectListData.indexPath[1]].coordinates;
            } else if (this.modalData.radioValue == 2) {
                cacheArr.push(this.inputsData.alias.trim());
                cacheArr.push(this.inputsData.coord.trim());
                selectedItem.coord = this.inputsData.coord;
            }
            selectedItem.selectedOp = this.modalData.radioValue;
            selectedItem.namesPathArr = cacheArr;
            this.selectedItems.splice(this.modalData.itemIndex, 1, selectedItem);
            this.updateWeatherData(this.modalData.itemIndex, "metric");
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
        },
        deleteItem(index) {
            this.selectedItems.splice(index, 1);
            this.updateChartData(true);
        },
        moveItem(index, direction) {
            if (index == 0 && direction == "up") return
            if (index == this.selectedItems.length - 1 && direction == "down") return
            let expression;
            if (direction == "up") expression = index - 1;
            else expression = index + 1;
            let cache = this.copyObj(this.selectedItems[index])
            this.selectedItems.splice(index, 1, this.copyObj(this.selectedItems[expression]));
            this.selectedItems.splice(expression, 1, cache);
            this.updateChartData(true);
        },
        editItem(index) {
            this.initModal(2);
            const op1Selected = this.selectedItems[index].selectedOp == 1;
            this.inputsData.coord = op1Selected ? "" : this.selectedItems[index].namesPathArr[1]
            this.inputsData.alias = op1Selected ? "" : this.selectedItems[index].namesPathArr[0]
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
                this.selectListData.places.push(this.selectedItems[index].namesPathArr[0] + " > " +
                    this.selectedItems[index].namesPathArr[1])
            }
        },
        itemColorStyleFunc(index) {
            return "color:" + indexToColor(index) + ";"
        },
        async getWeather() {
            console.log("getWeather", await getCompleteWeatherData(this.selectedItems, -1, "metric"))
        },
        async updateWeatherData(wantedIndex, wantedUnits) {
            console.log("updateWeatherData", this.selectedItems)
            if (wantedIndex < 0 || this.selectedItems[wantedIndex] == undefined) {
                for (let i = 0; i < this.selectedItems.length; i++) this.selectedItems[i].status = "PENDING";
                this.itemsToShow = [];
            } else this.selectedItems[wantedIndex].status = "PENDING";
            let weatherData = await getCompleteWeatherData(this.selectedItems, wantedIndex, wantedUnits);
            console.log("updateWeatherData", weatherData)
            let isOneItem = !weatherData.isReturnAllMode;
            for (let i = 0; i < weatherData.dataArray.length; i++) {
                if (weatherData.dataArray[i] != undefined) {
                    this.selectedItems[isOneItem ? wantedIndex : i].status = "READY";
                    this.selectedItems[isOneItem ? wantedIndex : i].data = weatherData.dataArray[i];
                    if (this.modalData.title != "Edita la ubicación") {
                        this.itemsToShow.push(this.copyObj(this.selectedItems[isOneItem ? wantedIndex : i]));
                        this.itemsToShow[this.itemsToShow.length - 1].selectedItemsIndex = isOneItem ? wantedIndex : i;
                    }
                } else {
                    this.selectedItems[isOneItem ? wantedIndex : i].status = "FAILED";
                    this.selectedItems[isOneItem ? wantedIndex : i].data = undefined;
                }
            }
            //for (let i = 0; i < this.selectedItems.length; i++) console.log(i, this.selectedItems[i].data.current.temp, this.selectedItems[i], this.selectedItems[i].namesPathArr, this.selectedItems[i].status)
            //console.log("_______________________")
            if (this.modalData.title == "Edita la ubicación") this.updateChartData(true)
            else this.updateChartData(false);
        },
        windDirection(windDeg) {
            return getWindDirectionLabel(windDeg)
        },
        updateChartData(isRescanMode) {
            if (isRescanMode) {
                this.itemsToShow = [];
                for (let i = 0; i < this.selectedItems.length; i++) {
                    if (this.selectedItems[i].data != undefined) {
                        this.itemsToShow.push(this.copyObj(this.selectedItems[i]));
                        this.itemsToShow[this.itemsToShow.length - 1].selectedItemsIndex = i;
                    }
                };
            };
            if (this.myChart != null) this.myChart.destroy();
            this.myChart = new Chart('myChart', getMyChart(this.itemsToShow, 4));
        },
    },
    watch: {},
})