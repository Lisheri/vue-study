<script>
export default {
    props: ['value'],
    methods: {
        handleInput(e) {
            this.$emit('input', e.target.value)
        }
    },
    render(h) {
        return (
            <input value={this.value} onInput={this.handleInput}/>
            // <input value={this.value} onInput={this.$emit('input', this.$event.target.value)}/>
        )
    }
}
</script>