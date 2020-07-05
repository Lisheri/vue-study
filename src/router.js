import Vue from 'vue'
import Router from 'vue-router'
// import Directive from '@/pages/directive/directive.vue'
const Directive = () => import("@/pages/directive/directive.vue")
const Render = () => import('@/pages/jsx/render.vue')
const InSlot = () => import('@/pages/slots/inSlot.vue')
const ReduceArray = () => import('@/pages/reduceArray/reduceArray.vue')
const Computed = () => import('@/pages/watchComputed/index.vue')
const eventHandler = () => import('@/pages/eventHandler/index.vue')
const formBind = () => import('@/pages/formInputBind/index.vue')

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router({
    mode: "hash", // 切换路由跳转为history模式
    routes: [
        {
            path: '/',
            redirect: '/discovery',
        },
        {
            path: '/directive',
            name: 'directive',
            component: Directive
        },
        {
            path: '/jsx',
            name: 'jsx',
            component: Render
        },
        {
            path: '/slot',
            name: 'slot',
            component: InSlot
        },
        {
            path: '/reduce',
            name: "ReduceArray",
            component: ReduceArray
        },
        {
            path: '/computed',
            name: 'computed',
            component: Computed
        },
        {
            path: '/eventHanding',
            name: 'eventHanding',
            component: eventHandler
        },
        {
            path: '/formBind',
            name: 'formBind',
            component: formBind
        }
    ]
})