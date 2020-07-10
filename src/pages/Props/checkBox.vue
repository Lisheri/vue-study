<script>
export default {
    name: 'checkbox',
    data() {
        return {

        }
    },
    /* 一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件，
    但是像单选框、复选框等类型的输入控件可能会将 value attribute 用于不同的目的。
    model 选项可以用来避免这样的冲突： */
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checked: {
            type: Boolean,
            required: false
        }
    },
    methods: {
        handleCheck(e) {
            this.$emit('change', e.target.checked)
        }
    },
    render(h) {
        return (
            <div>
                <h1>checkbox冲</h1>
                <a-checkbox onChange={this.handleCheck}/>
            </div>
        )
    }
}
</script>