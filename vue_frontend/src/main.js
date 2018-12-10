import Vue from "vue";
import App from "./App.vue";
import VueSocketio from "vue-socket.io";
import JsonViewer from "vue-json-viewer";
import VueMermaid from "vue-mermaid";
Vue.use(VueMermaid);

Vue.use(VueSocketio, "http://localhost:9090");
Vue.use(JsonViewer);

new Vue({
  el: "#app",
  render: h => h(App)
});
