<script>
import GrandChild from './grandChild'
export default {
    data() {
        return {

        }
    },
    props: {
        testString: {
            type: String,
            required: false
        },
        testNumber: {
            type: Number,
            required: false
        },
        testBoolean: {
            type: Boolean,
            required: false
        },
        testArray: {
            type: Array,
            required: false,
            // 对象或数组默认值必须从一个工厂函数获取
            default: function () {
                return [1,2,3,4,5]
            }
        },
        propsE: {
            // 自定义检测函数
            type: String,
            required: false,
            validator: function(val) {
                debugger
                // 这个值必须匹配下列字符串中的一个
                return ['success', 'warning', 'danger'].indexOf(val) !== -1
            }
        },
        value: {
            type: String,
            required: false
        }
    },
    created() {
        console.info(this.propsE)
    },
    watch: {
        value: {
            handler(newVal, oldVal) {
                console.info(newVal)
            }
        }
    },
    // inheritAttrs没有接收的元素也不会渲染在根元素上
    inheritAttrs: false,
    methods: {
        handleClickFather() {
            // this.$emit('grandFather', "执行父亲的方法")
            // debugger
            this.$emit('toChild', "执行父亲的方法")
        }
    },
    render(h) {
        const attrs = {
            'v-bind': this.$attrs,
            'v-on': this.$listeners
        }
        let that = this
        return (
            <div>
                <h1>props的儿子</h1>
                <div>
                    <span>{this.testNumber}</span>
                </div>
                {   
                    // <span>{this.propsE}</span>
                    // $attrs可以让孙子组件接收没有被儿子组件接收的父亲传递的props，$listeners可以让孙子组件触发父亲的方法
                    <GrandChild 
                        attrs={this.$attrs}
                        // $listeners包含了作用在这个组件上的所有监听器，这里的this指向child组件，也就是说将child组件上的所有监听器都传给了他的儿子
                        // 也就是此处的grandChild
                        on={{...this.$listeners}}
                    />
                }
                <span>{this.value}</span>
                <a-button onClick={this.handleClickFather}>执行父亲的方法</a-button>
            </div>
        )
    }
}
</script>