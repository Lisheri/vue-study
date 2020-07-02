<template>
    <div>
        <h1>render函数</h1>
        <anchored-heading1 :level="level">我的天，渲染成功{{level}}</anchored-heading1>
        <anchoredHeading  :level="level">render-test</anchoredHeading>
        <Twenty :level="level">卧槽</Twenty>
        <input-plus :value="value" @input="input"/>
        <span>{{value}}</span>
        <!-- <slot-test>
            <template v-slot="{ testarr }">
                <span>{{testarr.text}}</span>
            </template>
        </slot-test> -->
    </div>
</template>

<script>
import Vue from 'vue';
import anchoredHeading from './anchoredHeading'
import Twenty from './twenty'

Vue.component('anchored-heading1', {
    render: function(createElement) {
        console.info(this.$slots) // 内部只有一个default表示在h标签内部放入一个默认的插槽
        return createElement(
            `h${this.level}`, // 标签名称
            this.$slots.default // 子节点数组
        )
    },
    props: {
        level: {
            type: Number,
            required: true
        }
    }
})

// 自定义双向数据绑定v-model
Vue.component('input-plus', {
    props: ['value'],
    render: function(createElement) {
        let self = this
        return createElement(
            'input',
            {
                domProps: { // 标签的原生属性
                    value: self.value
                },
                on: {
                    input: (event) => {
                        // console.info("输入")
                        self.$emit('input', event.target.value)
                    }
                }
            }
        )
    }
})

// 一个作用域插槽的jsx写法
// Vue.component('slot-test', {
//     render: function(createElement) {
//         return createElement(
//             'div',
//             [
//                 createElement(
//                     'div',
//                     {
//                         scopedSlots: {
//                             default: testarr => createElement('span', testarr.text)
//                         }
//                     }
//                 )
//             ]
//         )
//     },
//     data() {
//         return {
//             testarr: {
//                 text: "子组件的数据"
//             }
//         }
//     }
// })
export default {
    data() {
        return {
            level: 2,
            blogTitle: "渲染函数渲染出来的一个东西",
            value: "我正在输入",
            testarr: {
                text: "测试作用域插槽"
            }
        }
    },
    methods: {
        input(val) {
            this.value = val
        }
    },
    components: {anchoredHeading, Twenty},
    render(createElement) {
        // debugger
        console.info("render执行了")
        return createElement('h1',{}, this.blogTitle)
    }
}

/**
 * TODO createElement参数
 * * {String | Object | Function}
 * * 一个HTML标签名、组件选项对象或者是一个resolve了上述任何一种的async函数
 * * 比如说 'div'
 * 
 * * {Object}
 * * 一个模块中attribute对应的数据对象。可选。
 * * {
 *      
 * * }
 * 
 * * {String | Array}
 * * 子级虚拟节点(VNodes)，由 'createElemet()' 构建而成
 * * 也可以使用字符串来生成 "文本虚拟节点"。可选。
 * * [
 *      '先写一些文字'
 *       createElement('h1', '一则一级标题')
 *       createElement(MyComponent, {
 *          props: {
 *              someProp: 'foobar'
 *           }
 *        })
 * * ]
 */

/* 
    其中第二个参数为attribute对应的数据对象，有如下参数:
    {
        ? 与 'v-bind:class' 的API相同
        ? 接受一个字符串、对象或字符串对象组成的数组
        class: {
            foo: true,
            bar: false
        },
        ? 与 'v-bind:style' 的API相同
        ? 和class接受的参数一样
        style: {
            color: 'red',
            fontSize: '14px'
        },
        ? 普通的 HTML attribute
        attrs: {
            id: 'foo'
        },
        ? 组件的prop
        props: {
            myData: 'bar'
        },
        ? DOM节点的属性(DOm property)
        domProps: {
            innerTEXT: 'baz'
        },
        ? 事件监听器在 ‘on’ 内
        ? 但不再支持如 'v-on:keyup.enter' 这样的修饰器，需要在处理函数中手动检查keyCode
        on: {
            click: this.clickHandler
        },
        ? 仅用于组件，用于监听原生事件，而不是组件内部使用
        ? 'vm.$emit' 触发的事件(也就是给组件传递一个实例，组件内部使用this.$("emit")触发)
        nativeOn: {
            click: this.nativeClickHandler
        },
        ? 自定义指令
        ! 注意，无法对binding中的oldValue赋值，因为Vue已经对此做了同步
        directives: [
            {
                name: "my-custom-directive",
                value: '2', // 指令的绑定值
                expression: '1+1', // 字符串形式的指令表达式
                arg: 'foo', // 传给指令的参数
                modifiers: { // 一个包含修饰符的对象
                    bar: true
                }
            }
        ],
        ? 作用域插槽的格式为
        ? { name: props => VNode | Array<VNode> }
        scopedSlots: {
            default: props => createElement('span', props.text)
        },
        ? 如果组件是其他组件的子组件，需为插槽指定名称
        slot: 'name-of-slot',
        ? 其他特殊顶层 property
        key: 'myKey',
        refs: 'myRef'
        ? 如果在渲染函数中给多个子元素都应用了相同的ref名,
        ? 那么 '$refs.myRef' 会变成一个数组
        refInFor: true
    }
*/

/* 
    ? 对于事件修饰符，Vue提供了相应的前缀可以用于 on:
    ? 修饰符                        前缀
    * .passive                      &   绑定的事件立即执行
    * .capture                      !   内部元素触发的事件先在这里处理，然后才交给内部元素进行处理
    * .onec                         ~   事件只触发一次
    * .capture.once或.once.capture  ~!  内部元素触发的事件先处理，且仅处理一次
    
    ? 例如
    on: {
        '!click': this.doThisCapturingMode,
        '~keyup': this.doThisOnce,
        '~!mouseover': this.doThisOnceInCapturingMode
    }
    修饰符	    处理函数中的等价操作
    .stop	    event.stopPropagation()
    .prevent	event.preventDefault()
    .self	    if (event.target !== event.currentTarget) return
按键：
    .enter, .13	if (event.keyCode !== 13) return (对于别的按键修饰符来说，可将 13 改为另一个按键码)
修饰键：
    .ctrl, .alt, .shift, .meta	if (!event.ctrlKey) return (将 ctrlKey 分别修改为 altKey、shiftKey 或者 metaKey)

    on: {
        keyup: function (event) {
    ? 如果触发事件的元素不是事件绑定的元素
    ? 则返回
        if (event.target !== event.currentTarget) return
    ? 如果按下去的不是 enter 键或者
    ? 没有同时按下 shift 键
    ? 则返回
        if (!event.shiftKey || event.keyCode !== 13) return
    ? 阻止 事件冒泡
        event.stopPropagation()
    ? 阻止该元素默认的 keyup 事件
        event.preventDefault()
  }
}
*/

/*
    可以通过 this.$slots访问静态插槽的内容，每个插槽都是一个VNode数组:
    render: function(createElement) {
        return createElement(
            'div',
            this.$slots.default
            ? 这种写法代表将子组件标签包含的部分赋值给默认插槽
            ? 换成标签写法就是<div><slot></slot></div>
        )
    }

    ! 作用域插槽允许我们将子组件的数据传递给父组件
    允许我们使用this.$scopedSlots访问作用域插槽，每个作用域插槽都是一个返回若干VNode的函数:
    props:['message'],
    render: function(createElement) {
        return createElement(
            'div',
            this.$scopedSlots.default({
                text: this.message
            })
            ? 这种写法相当于再div中创建了一个作用域插槽，将message的数据以text为键名传给父组件
            ? 换成标签形式就是<div><slot :text="message"></slot></div>
        )
    }

    如果要用渲染函数向子组件中传递作用域插槽，可以利用 VNode 数据对象中的 scopedSlots 字段
    <div><child v-slot="props"><span>{{props.text}}</span></child></div>
    render: function(createElement) {
        return createElement(
            'div',
            [
                createElement(
                    'child',
                    {
                        ? 在数据对象中传递 `scopedSlots`
                        ? 格式为 { name: props => VNode | Array<VNode> }
                        scopedSlots: {
                            default: props => createElement('span', props.text)
                        }
                    }
                )
            ]
        )
    }
*/

</script>

<style lang="scss" scoped>
    
</style>