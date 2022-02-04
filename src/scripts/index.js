import Vue from "../../node_modules/vue/dist/vue"


const App = new Vue({
    el: '#app',
    data: () => ({
        drawer: false,
        snackbar: false
    }),
    computed: {},
    methods: {
        copyObj(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
    },
    watch: {},
})