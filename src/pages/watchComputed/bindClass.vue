<script>
export default {
  data() {
    return {
      isActive: true,
      renderData: "jsx渲染",
      activeClass: "active",
      staticClass: "static",
      error: null,
      classObj: {
        active: true,
        static: true
      }
    };
  },
  computed: {
    classCpu: {
      get: function() {
        return {
          active: this.isActive && !this.error,
          "text-danger": this.error && this.error.type === "fatal"
        };
      }
    }
  },
  methods: {
    handleErrorChange() {
      if (this.isActive) {
        this.error = {
          type: "fatal"
        };
        this.isActive = false;
      } else {
        this.isActive = true;
        this.error = null;
      }
    }
  },
  render() {
    return (
      <div>
        <p
          // ? 单纯的动态class
          // class={{'active': this.isActive, 'static': true}}
          // ? 可以使用data中的
          // class={this.classObj}
          // ? 使用计算属性
          //   class={this.classCpu}
          // ? 数组语法
          class={[this.staticClass, this.activeClass]}
        >
          {this.renderData}
        </p>
        <a-button onClick={this.handleErrorChange} type="primary">
          点击切换
        </a-button>
      </div>
    );
  }
};
</script>
<style lang="scss" scoped>
.static {
  width: 300px;
  margin: 10px auto;
}
.active {
  color: yellowgreen;
}
.text-danger {
  color: red;
  text-align: center;
}
</style>