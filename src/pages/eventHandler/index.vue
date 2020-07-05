<script>
export default {
    data() {
        return {
            isActive: true
        }
    },
    methods: {
        stop(event) {
            // 阻止冒泡，事件冒泡，触发由内向外
            event.stopPropagation();
            // 阻止默认事件
            event.preventDefault();
            console.info("阻止单机事件继续传播")
        }
    },
    render(h) {
        // 事件修饰符
        // 在
        return (
            <div>
                <h1>事件修饰符</h1>
                {
                    // 一般使用都是直接@click.xxx来使用事件修饰符
                    // 但是在jsx中，这些官方封装的都无法使用，因此需要自己来写事件修饰符
                    // .stop: 阻止冒泡, 在template中直接就是@click.stop="stop", 但是在jsx中，需要在方法中使用event.stopPropagation()来阻止事件冒泡
                    // .prevent 阻止默认事件 template中的用法同上，在jsx中，需要在方法中使用event.preventDefault()
                    // .capture 使用事件捕获, 也就是只触发捕获的事件，template用法同上，在jsx中，需要这样使用： on{!click: }
                    // .self 只监听直接触发该元素的事件，不是自身则不触发该元素 if (event.target !== event.currentTarget) return
                    // .once 事件只触发一次
                    // .passive 该事件修饰符会忽略event.preventDefault， 会立即触发默认事件
                    // .left, .right, .middle点击鼠标左右中键
                    // @keyup.keyCode可以控制按下键盘上哪一个键
                    // .enter, .tab, .delete(捕获删除和退格键), .esc, .space, .up, .down, .left, .right .ctrl, .alt, .shift, .meta jsx: event.ctrlKey
                    // .exact修饰符，精确控制点击如 @click.ctrl.exact有且只有ctrl被按下才会执行， @click.exact没有任何系统修饰符被按下
                    // .native事件， 本身写一个组件，在组件上绑定一个@click并不会出发点击，但是加上该修饰符，可以将该组件渲染成一个html标签，可以触发点击
                    // .native修饰符对原始html标签没有效果
                }
                <a-button onClick={this.stop}>阻止单击事件继续传播</a-button>

            </div>
        )
    }
}
</script>

<style lang="scss" scoped>

</style>