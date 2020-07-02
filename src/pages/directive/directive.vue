<template>
    <div>
        <span>卧槽</span>
        <input type="text" v-focus @change="handleChange" :value="inputValue"/>
        <!-- 全局注册的copy指令 -->
        <button v-copy="copyText">复制</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            inputValue: "",
            copyText: "复制的内容"
        }
    },
    created() {
        console.info("开始自定义指令")
    },
    // 局部注册自定义指令
    directives: {
        // 指令的名字
        focus: {
            // 绑定时
            bind: () => {
                console.info("bind")
            },
            // 被绑定元素插入父节点时调用
            inserted: (el) => {
                console.info(el.innerText)
                el.focus()
            },
            update: (el) => {
                console.info("正在更新")
                console.info(el.value)
            }
        }
    },
    methods: {
        handleChange(e) {
            this.inputValue = e.target.value
            this.copyText = e.target.value
        }
    }
}

// ! 自定义指令的钩子函数
// * bind: 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
// * inserted 被绑定元素插入父节点时调用(仅保证父节点存在，但不一定已被插入文档中)
// * update 所在组件的vNode(虚拟节点)更新时调用，但是可能发生在其子vNode更新之前。指令的值可能发生了改变，也可能没有。
// * 但是可以通过比较更新前后的值来忽略不必要的模板更新(详细的钩子函数参数见下)

// * componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
// * unbind：只调用一次，指令与元素解绑时调用

/**
 * 指令钩子函数会被传入以下参数：
 *  ? el：指令所绑定的元素，可以用来直接操作 DOM。
 *  ? binding：一个对象，包含以下 property：
 *      * name：指令名，不包括 v- 前缀。
 *      * value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
 *      * oldValue：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
 *      * expression：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。
 *      * arg：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。
 *      * modifiers：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }。
 *  ? vnode：Vue 编译生成的虚拟节点。移步 VNode API 来了解更多详情。
 *  ? oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用。
 */
</script>

<style lang="scss" scoped>
    
</style>