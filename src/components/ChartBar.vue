<template>
  <div style="background: #fff; overflow: hidden;"></div>
</template>
<script>
import Bus from "@/bus.js";
import { Chart, registerShape } from "@antv/g2";
export default {
  name: "chart-bar",
  data() {
    return {
      chart: null,
    };
  },
  created() {
    Bus.$off("changeTypeData").$on("changeTypeData", () => {
      this.easyBar();
    });
  },
  watch: {
    getSize() {
      const e = document.createEvent("Event");
      e.initEvent("resize", true, true);
      window.dispatchEvent(e);
    },
  },
  mounted() {
    // console.log("///", this.$props.cid);
    this.getChange();
    // this.easyBar()
    // Bus.$off('changeTypeData').$on(this.easyBar('changeTypeData'), () => {
    //   this.easyBar()
    // })
  },
  props: {
    // 数据
    newdata: {
      type: Array,
      default: () => [{ type: "Sports", amount: 275 }],
    },
    // id的值
    cid: {
      type: String,
      default: "chart",
    },
    // 自定义宽高
  },
  computed: {
    getId() {
      return this.cid;
    },
    getMaxYAxis() {
      let max = this.newdata[0].amount
      this.newdata.forEach(item => {
        max < item.amount ? max = item.amount : ""
      })
      return max * 1.1
    },
  },
  methods: {
    getChange() {
      const e = document.createEvent("Event");
      e.initEvent("resize", true, true);
      // window.addEventListener("resize", (e) => {
      //   console.info("test");
      // });
      window.dispatchEvent(e);
    },
    easyBar() {
      const self = this;
      // console.info(this.chart)
      this.chart ? this.chart.destroy() : "";
      this.chart = new Chart({
        container: self.getId,
        width: 300,
        height: 200,
        padding: [30, 20, 60, 60],
      });
      self.chart.data(self.newdata);
      self.chart.scale("amount", {
        nice: true,
        max: self.getMaxYAxis,
        min: 0,
      });
      self.chart.tooltip(false);
      self.chart.interaction("active-region");
      self.chart.interval().position("type*amount");
      self.chart.render();
    },
  },
};
</script>

<style>
</style>
