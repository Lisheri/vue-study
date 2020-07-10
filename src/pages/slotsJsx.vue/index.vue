<script>
import Slots from './slots'
export default {
    data() {
        return {

        }
    },
    methods: {
        
    },
    components: {Slots},
    render(h) {
        return (
            <div>
                <h1>JSX的插槽</h1>
                {
                    /* <template slot="secondSlot">
                            <span>使用具名插槽</span>
                    </template> */
                    <Slots
                        {...{
                            // 作用域插槽写法，下面是声明的作用域插槽的名字
                            scopedSlots: {
                                thirdSlot: ({values}) => <span>{`使用作用域插槽${values.name}${values.value}`}</span>
                            }
                        }}
                    >
                        <template slot="secondSlot">
                            <span>使用具名插槽</span>
                        </template>
                        使用默认插槽
                    </Slots>
                }
            </div>
        )
    }
}
</script>