<template>
  <div>
    <h1>Flow Chart</h1>
    <button @click="showPipeline()" v-show="isPipelineShown">Hide</button>
    <button @click="showPipeline()" v-show="!isPipelineShown">Show</button>
    <vue-mermaid :nodes="nodes" v-if="isPipelineShown"></vue-mermaid>
    <div align="left">
      <p>pipeline</p>
      <json-viewer :value="pipeline" :expand-depth="5" copyable boxed sort></json-viewer>
    </div>
  </div>
</template>

<script>
export default {
  name: "FlowChart",
  data() {
    return {
      title: "Flow Chart!",
      isPipelineShown: false,
      nodes: [{ id: "-1", text: "Begin", next: ["0"] }],
      pipeline: null
    };
  },
  sockets: {
    connect() {
      console.log("Client: Try to connect!");
      this.$socket.emit("requestFlowchart");
    },
    responseFlowchart: function(pipeline) {
      console.log(pipeline.steps);
      this.pipeline = pipeline;

      const elementId = { id: 0 };
      let steps = pipeline.steps;
      for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        let name = step["primitive"]["primitive"]["name"];
        let node = { id: elementId.id, text: name, next: [elementId.id + 1] };
        this.nodes.push(node);
        elementId.id += 1;
      }
      this.isPipelineShown = true;
    }
  },
  methods: {
    showPipeline() {
      console.log(this.isPipelineShown);
      this.isPipelineShown = !this.isPipelineShown;
    }
  }
};
</script>

<style scoped>
</style>
