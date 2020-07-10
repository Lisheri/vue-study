<script>
export default {
    name: 'test-sync',
    data() {
        return {

        }
    },
    props: ['title'],
    watch: {
        title: {
            handler(newVal) {
                console.info(newVal)
                // this.$emit('update:title', newVal)
                this.$emit('title', newVal)
            }
        }
    },
    render(h) {
        return (
            <div>
                <a-input v-model={this.title} style="width: 200px; margin:0 auto;"/>
            </div>
        )
    }
}
</script>