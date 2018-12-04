<template>
  <div>
    <h1>Flow Chart</h1>
    <VueFlowy :chart="chart"></VueFlowy>
    <div align="left">
      <p>pipeline</p>
      <json-viewer :value="pipeline" :expand-depth="5" copyable boxed sort></json-viewer>
    </div>
  </div>
</template>

<script>
import { VueFlowy, FlowChart } from "vue-flowy";
export default {
  name: "FlowChart",
  components: {
    VueFlowy
  },
  data: () => ({
    chart: new FlowChart(),
    pipeline: null
  }),
  sockets: {
    connect() {
      console.log("Client: Try to connect!");
      this.$socket.emit("requestFlowchart");
    },
    responseFlowchart: function(pipeline) {
      console.log(pipeline.steps);
      this.pipeline = pipeline;

      const elementId = { id: 0 };
      branch(pipeline, this.chart, elementId);

      function branch(pipeline, chart, elementId) {
        if (pipeline == null) {
          return null;
        }
        let head = null;
        let pre = null;
        let cur = null;

        let steps = pipeline.steps;
        for (let i = 0; i < steps.length; i++) {
          let step = steps[i];
          let name = step["primitive"]["primitive"]["name"];
          let element = chart.addElement(elementId.id, { label: name });
          elementId.id += 1;

          cur = element;
          if (i == 0) {
            head = element;
            pre = element;
          }
          if (i > 0) {
            pre.leadsTo(cur);
          }
          if (step.pipeline) {
            console.log("Step " + i + " not null");
            let branchHead = branch(step.pipeline, chart, elementId);
            cur.leadsTo(branchHead);
          }
          pre = cur;
        }

        return head;
      }
    }
  },
  mounted() {
    // const idea = this.chart.addElement("idea");
    // const A = this.chart.addElement("a", {
    //   label: "vscode"
    // });
    // const B = this.chart.addElement("b", {
    //   label: "github"
    // });
    // const C = this.chart.addElement("c", {
    //   label: "npm"
    // });
    // idea.leadsTo(A).leadsTo(B);
    // A.leadsTo(C);
  }
};
</script>

<style scoped>
</style>
