<script>
export default {
  name: "base-input",
  data() {
    return {};
  },
  inheritAttrs: false,
  props: ["value", "label"],
  computed: {
    inputListeners() {
      let vm = this;
      return Object.assign(
        {},
        // 从父级添加所有的监听
        // Vue 提供了一个 $listeners property，它是一个对象，里面包含了作用在这个组件上的所有监听器。
        // this指向base-input这个子组件，也就是说将base-input上的监听器，给了<input />>，input可以触发base-input上绑定的事件
        this.$listeners,
        // 然后我们添加自定义监听器
        // 或覆写一些监听器的行为
        // 此处是覆写监听器的行为
        {
          input: event => {
            vm.$emit("input", event.target.value);
          }
        }
      );
    }
  },
  render(h) {
    return (
      <label>
        <input
          value={this.value}
          attrs={this.$attrs}
          on={{ ...this.inputListeners }}
        />
      </label>
    );
  }
};
</script>