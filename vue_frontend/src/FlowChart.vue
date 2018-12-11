<template>
  <div>
    <h1>Flow Chart</h1>
    <div align="left" v-for="item in nodes" :key="item.id">
      <input type="checkbox" :id="item.id" :value="item.id" v-model="nodesPicked">
      <label for="jack">{{item.text}}</label>
    </div>
    <span>Select Primitives: {{ nodesPicked }}</span>

    <div>
      <button @click="showPipeline()" v-show="isPipelineShown">Hide Flowchart</button>
      <button @click="showPipeline()" v-show="!isPipelineShown">Show Flowchart</button>
    </div>

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
      nodesPicked: [],
      nodes: [],
      pipeline: {}
    };
  },
  sockets: {
    connect() {
      console.log("Client: Try to connect!");
      this.$socket.emit("requestFlowchart");
    },
    responseFlowchart: function(pipeline) {
      // console.log(pipeline.steps);
      this.pipeline = pipeline;
      const elementId = { id: 0 };
      this.isPipelineShown = true;
      branch(this.pipeline, this.nodes, elementId);
      function branch(pipeline, nodes, elementId) {
        if (pipeline == null) {
          return;
        }
        let steps = pipeline.steps;
        for (let i = 0; i < steps.length; i++) {
          let step = steps[i];
          let name = step["primitive"]["primitive"]["name"];
          let id = elementId.id;
          let node = {
            id: id,
            text: id + ": " + name,
            next: [id + 1]
          };
          if (i == steps.length - 1 && !step.pipeline) {
            node.next = [];
          }
          nodes.push(node);
          elementId.id += 1;
          if (step.pipeline) {
            branch(step.pipeline, nodes, elementId);
            node.next.push(elementId.id);
          }
        }
      }
    }
  },
  methods: {
    showPipeline() {
      // console.log(this.isPipelineShown);
      this.isPipelineShown = !this.isPipelineShown;
    }
  }
};
</script>

<style scoped>
</style>
