import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import login from '../components/Login.vue'
import Home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'
import user from '../components/user/Users.vue'
import rights from '../components/power/Rights.vue'
import roles from '../components/power/Roles.vue'
import cate from '../components/Goods/cate.vue'
import params from '../components/Goods/Params.vue'
import goodList from '../components/Goods/List.vue'
import add from '../components/Goods/Add.vue'
import orders from '../components/Order/orders.vue'
import reports from '../components/repot/repots.vue'
const  routes=[
    {   
        path:'/',
        redirect:'/login' },
    {
        path:"/login",
        component:login
    },{
        path:"/home",
        component:Home,
        redirect:"/welcome",
        children:[{
            path:"/welcome",
            component:welcome   
        },{
            path:'/users',
            component:user
        },{
            path:"/rights",
            component:rights
         },{
            path:"/roles",
            component:roles
         },{
             path:'/categories',
             component:cate
         },{
            path:'/params',
            component:params
        },{
            path:'/goods',
            component:goodList
        },{
            path:'/goods/add',
            component:add
        },{
            path:'/orders',
            component:orders
        },
        {
            path:'/reports',
            component:reports
        }]
    }
]   


 const router=new VueRouter({
    routes
 })

 router.beforeEach((to,from,next)=>{

    if(to.path=="/login"){
        next()
    }
    const token=sessionStorage.getItem("token")

    if(!token){
        return next('/login')
    }
     next()

 })


 export default router 