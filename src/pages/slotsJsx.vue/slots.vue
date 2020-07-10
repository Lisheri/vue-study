<script>
export default {
    data() {
        return {

        }
    },
    props: {

    },
    render(h) {
        return (
            <div>
                <h1>插槽使用</h1>
                <div class="grid-box">
                    <a-card hoverable style="width: 240px; height: 400px">
                        <h2>默认插槽</h2>
                        {
                            // * 使用this.$slots.default定义默认插槽
                            this.$slots.default
                        }
                    </a-card>
                    <a-card hoverable style="width: 240px; height: 400px">
                        <h2>具名插槽</h2>
                        {
                            // * 使用this.$slots.default定义默认插槽
                            this.$slots.secondSlot
                        }
                    </a-card>
                    <a-card hoverable style="width: 240px; height: 400px">
                        <h2>作用域插槽</h2>
                        {
                            // * 使用this.$slots.default定义默认插槽
                            this.$scopedSlots.thirdSlot({values: {name: "我是作用域插槽", value: 666}})
                        }
                    </a-card>
                </div>
            </div>
        )
    }
}
</script>
<style lang="scss" scoped>
    .grid-box {
        display: grid;
        grid-template-rows: repeat(3, 350px);
        grid-template-columns: 250px 250px 250px;
        gap: 50px;
        margin: 0 auto;
        width: 900px;
        height: 1200px;
    }
</style>