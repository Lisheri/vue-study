<script>
export default {
    data() {
        return {
            inputVal: ''
        }
    },
    props: {
        value: {
            type: String,
            required: false
        }
    },
    watch: {
        value: {
            handler(newVal, oldVal) {
                console.info(newVal)
            }
        }
    },
    methods: {
        handleChange() {
            this.$emit("input", this.inputVal)
        }
    },
    render(h) {
        return (
            <div>
                <h1>兄弟组件</h1>
                <a-input v-model={this.inputVal} class="brother-input"></a-input>
                <a-button type="primary" 
                onClick={
                    this.handleChange
                }
                >点击改变val</a-button>
            </div>
        )
    }
}
</script>
<style lang="scss" scoped>
    .brother-input {
        width: 200px;
        margin: 0 auto;
    }
</style>