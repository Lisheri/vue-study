<script>
export default {
    data() {
        return {

        }
    },
    props: {
        testObj: {
            type: Object,
            required: false
        }
    },
    created() {
        // console.info(this.testObj)
    },
    methods: {
        implementGrand() {
            this.$emit('grandFather', "孙子执行爷爷的事件")
        }
    },
    render(h) {
        return (
            <div>
                <h1>孙子组件</h1>
                <span>{this.testObj.a}</span>
                <a-button onClick={this.implementGrand}>执行爷爷的事件</a-button>
            </div>
        )
    }
}
</script>