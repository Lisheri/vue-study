<script>
export default {
    data() {
        return {
            row: {
                key: "1",
                value: "我是作用域插槽"
            }
        }
    },
    render(h) {
        return (
            <div>
                {this.$scopedSlots.testSlot()}
                {this.$slots.default}
                {this.$scopedSlots.sub({
                    injectProps: this.row
                })}
                <strong>Error!</strong>
                {
                    // 具名插槽
                }
                {this.$attrs.titleSlot}
            </div>
        )
    }
}
</script>