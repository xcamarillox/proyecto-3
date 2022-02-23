// From modules
import bootstrap from "bootstrap"
import Vue from "../../node_modules/vue/dist/vue"
import Chart from 'chart.js/auto';
import 'regenerator-runtime/runtime'; // async await functions

// Development
import allMexico from "./locations.js";
import { getMyChart } from "./chart-functions.js"
import { getCompleteWeatherData } from "./api-functions.js";
import {
    indexToColor,
    getNextDaysLabels,
    getPlaceNameLabel,
    getWindDirectionLabel,
    getWeatherClass
} from "./aux-functions.js";

const App = new Vue({
    el: '#app',
    data: () => ({
        etiquetasLugares: null,
        proximosDias: null,
        windDirection: null,
        getWeaterIconClass: null,
        myCharts: [],
        modalData: {},
        chartSelectListData: {},
        modalSelectListData: {},
        modalInputsData: {},
        selectedItems: [],
        itemsToShow: [],
    }),
    created() {
        this.windDirection = getWindDirectionLabel;
        this.etiquetasLugares = getPlaceNameLabel;
        this.proximosDias = getNextDaysLabels(-1, 8);
        this.getWeatherIconClass = getWeatherClass;
        this.chartEraseButtonClick();
        let myData = JSON.parse(window.localStorage.getItem("mySelectedItems"));
        if (myData != undefined) {
            this.selectedItems = myData;
            myData = JSON.parse(window.localStorage.getItem("myChartsSetupArr"));
            if (myData != undefined) {
                for (let i = 0; i < myData.length; i++) {
                    this.myCharts.push({
                        setup: this.copyObj(myData[i]),
                        chart: undefined,
                    })
                }
            }
            this.updateWeatherData(-1, 'metric');
        }
    },
    methods: {
        copyObj(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        itemColorStyleFunc(index) {
            return "color:" + indexToColor(index) + ";"
        },
        saveSelectedItems() {
            let cacheSelectedItems = this.copyObj(this.selectedItems)
            for (let i = 0; i < cacheSelectedItems.length; i++) cacheSelectedItems[i].data = [];
            window.localStorage.setItem("mySelectedItems", JSON.stringify(cacheSelectedItems))
        },
        changeOnRadio() {
            if (this.modalData.radioValue == 1 && this.modalData.modalSelectListDataReady ||
                this.modalData.radioValue == 2 && this.modalData.inputDataReady)
                this.modalData.aceptarButtonDisabledToggle = false;
            else this.modalData.aceptarButtonDisabledToggle = true;
        },
        addNewChart() {
            this.myCharts.push({
                setup: this.copyObj(this.chartSelectListData.selectedItemsIdxsArr),
                chart: undefined,
            })
            this.chartEraseButtonClick();
            this.updateChartData(false);
        },
        initModal(modalMode) {
            let title, inputDataReady, itemIndex;
            this.modalSelectListData = {
                places: [],
                cityToggle: true,
                selectedItemIndex: 0,
                indexPath: []
            }
            this.modalSelectListData.places.push("[SELECCIONA UN ESTADO]")
            for (const state of allMexico) this.modalSelectListData.places.push(state.name)
            if (this.modalData.hasOwnProperty('title')) title = this.modalData.title;
            if (this.modalData.hasOwnProperty('inputDataReady')) inputDataReady = this.modalData.inputDataReady;
            if (this.modalData.hasOwnProperty('itemIndex')) itemIndex = this.modalData.itemIndex;

            if (modalMode == 0 || modalMode == 1) {
                this.modalData = {
                    modalSelectListDataReady: false,
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
                this.modalInputsData = {
                    coord: "",
                    alias: ""
                }
            }
        },
        clickOK() {
            let cacheArr = [];
            //******PARAMS ON selectedItems******//
            let selectedItem = {
                selectedOp: 0,
                coord: "",
                namesPathArr: [],
                data: [undefined],
                status: ""
            }
            if (this.modalData.radioValue == 1) {
                cacheArr.push(allMexico[this.modalSelectListData.indexPath[0]].name);
                cacheArr.push(allMexico[this.modalSelectListData.indexPath[0]].cities[this.modalSelectListData.indexPath[1]].name);
                selectedItem.coord = allMexico[this.modalSelectListData.indexPath[0]].cities[this.modalSelectListData.indexPath[1]].coordinates;
            } else if (this.modalData.radioValue == 2) {
                cacheArr.push(this.modalInputsData.alias.trim());
                cacheArr.push(this.modalInputsData.coord.trim());
                selectedItem.coord = this.modalInputsData.coord;
            }
            selectedItem.selectedOp = this.modalData.radioValue;
            selectedItem.namesPathArr = cacheArr;
            this.selectedItems.splice(this.modalData.itemIndex, 1, selectedItem);

            this.updateWeatherData(this.modalData.itemIndex, "metric");
        },
        changeOnInput() {
            let splitArr = this.modalInputsData.coord.split(",");
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
        chartEraseButtonClick() {
            this.chartSelectListData = {
                disabledToggle: false,
                selectToggle: true,
                eraseButtonDisabledToggle: true,
                selectedItemIndex: 0,
                selectedItemsLabelsArr: [],
                selectedItemsIdxsArr: [],
                items: [
                    "[SELECCIONA DÍA O RANGO TEMPORAL]",
                    "El Día de Hoy",
                    "El Día " + this.proximosDias[1],
                    "El Día " + this.proximosDias[2],
                    "El Día " + this.proximosDias[3],
                    "El Día " + this.proximosDias[4],
                    "El Día " + this.proximosDias[5],
                    "El Día " + this.proximosDias[6],
                    "El Día " + this.proximosDias[7],
                    "Por 7 Días",
                    "Por 48 Hrs",
                ]
            }
        },
        changeOnChartSelect(index) {
            this.chartSelectListData.selectedItemsIdxsArr.push(index);
            this.chartSelectListData.selectedItemsLabelsArr.push(this.chartSelectListData.items[index]);
            this.chartSelectListData.selectedItemIndex = 0;
            if (this.chartSelectListData.selectToggle) {
                this.chartSelectListData.eraseButtonDisabledToggle = false;
                this.chartSelectListData.items = [];
                this.chartSelectListData.items.push(this.chartSelectListData.selectedItemsLabelsArr[0] + " > [SELECCIONA UN RUBRO]");
                switch (index) {
                    case 9:
                        this.chartSelectListData.items.push("Temperatura Máxima (Max)");
                        this.chartSelectListData.items.push("Temperatura Mínima (Min)");
                        this.chartSelectListData.items.push("PoP");
                        this.chartSelectListData.items.push("Humedad");
                        break;
                    case 10:
                        this.chartSelectListData.items.push("Temperatura (Temp)");
                        this.chartSelectListData.items.push("PoP");
                        break;
                    default:
                        if (index == 1) this.chartSelectListData.items.push("Temperatura: Max / Min / Ahora / S.T.");
                        else this.chartSelectListData.items.push("Temperatura:  Max / Min");
                        this.chartSelectListData.items.push("PoP / Humedad");
                        break;
                }
                this.chartSelectListData.items.push("Velocidad del Viento");
                this.chartSelectListData.items.push("Presión");
            } else {
                this.chartSelectListData.items = [this.chartSelectListData.selectedItemsLabelsArr[0] + " > " + this.chartSelectListData.selectedItemsLabelsArr[1] + " > Presiona el botón +"];
                this.chartSelectListData.disabledToggle = true;
            }
            this.chartSelectListData.selectToggle = !this.chartSelectListData.selectToggle;
        },
        changeOnModalSelect(index) {
            this.modalData.radioValue = 1;
            this.modalSelectListData.indexPath.push(index - 1);
            this.modalData.aceptarButtonDisabledToggle = true;
            if (this.modalSelectListData.cityToggle) {
                this.modalData.eraseButtonDisabledToggle = false;
                this.modalSelectListData.selectedItemIndex = 0;
                this.modalSelectListData.places = [];
                this.modalSelectListData.places.push(allMexico[this.modalSelectListData.indexPath[0]].name + " > [SELECCIONA CIUDAD]");
                for (const ciudad of allMexico[index - 1].cities) this.modalSelectListData.places.push(ciudad.name)
            } else {
                const placePath = this.modalData.placePath = allMexico[this.modalSelectListData.indexPath[0]].name + " > " +
                    allMexico[this.modalSelectListData.indexPath[0]].cities[this.modalSelectListData.indexPath[1]].name;
                this.modalSelectListData.selectedItemIndex = 0;
                this.modalSelectListData.places = [placePath];
                this.modalData.selectListDisabledToggle = true;
                this.modalData.aceptarButtonDisabledToggle = false;
                this.modalData.modalSelectListDataReady = true;
            }
            this.modalSelectListData.cityToggle = !this.modalSelectListData.cityToggle
        },
        deleteItem(index) {
            this.selectedItems.splice(index, 1);
            this.saveSelectedItems();
            this.updateChartData(true);
        },
        deleteItemChart(index) {
            this.myCharts[index].chart.destroy()
            this.myCharts.splice(index, 1);
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
            this.saveSelectedItems();
            this.updateChartData(true);
        },
        editItem(index) {
            this.initModal(2);
            const op1Selected = this.selectedItems[index].selectedOp == 1;
            this.modalInputsData.coord = op1Selected ? "" : this.selectedItems[index].namesPathArr[1]
            this.modalInputsData.alias = op1Selected ? "" : this.selectedItems[index].namesPathArr[0]
            this.modalData = {
                title: "Edita la ubicación",
                itemIndex: index,
                modalSelectListDataReady: op1Selected,
                inputDataReady: !op1Selected,
                selectListDisabledToggle: op1Selected,
                aceptarButtonDisabledToggle: false,
                eraseButtonDisabledToggle: !op1Selected,
                radioValue: op1Selected ? 1 : 2
            }
            if (op1Selected) {
                this.modalSelectListData.places = [];
                this.modalSelectListData.places.push(this.selectedItems[index].namesPathArr[0] + " > " +
                    this.selectedItems[index].namesPathArr[1])
            }
        },
        async updateWeatherData(wantedIndex, wantedUnits) {
            if (wantedIndex < 0 || this.selectedItems[wantedIndex] == undefined) {
                for (let i = 0; i < this.selectedItems.length; i++) this.selectedItems[i].status = "PENDING";
                this.itemsToShow = [];
            } else this.selectedItems[wantedIndex].status = "PENDING";
            let weatherData = await getCompleteWeatherData(this.selectedItems, wantedIndex, wantedUnits);
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
            if (this.myCharts[0] == undefined) {
                this.myCharts.push({
                    setup: [1, 1],
                    chart: undefined
                });
            }
            let myData = [];
            for (let i = 0; i < this.myCharts.length; i++) {
                if (this.myCharts[i] != undefined) {
                    if (this.myCharts[i].setup != undefined) myData.push(this.myCharts[i].setup);
                    if (this.myCharts[i].chart != undefined) this.myCharts[i].chart.destroy();
                    this.myCharts[i].chart = new Chart('myChart' + i, getMyChart(this.itemsToShow, this.myCharts[i].setup));
                }
            }
            this.saveSelectedItems()
            window.localStorage.setItem("myChartsSetupArr", JSON.stringify(myData));
            //console.log(this.myCharts);
            //console.log(this.itemsToShow)
        },
    },
    watch: {},
})