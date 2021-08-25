import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
const User = () => import('../pages/User.vue')
const Rights = () => import('../pages/Power/Roles.vue')
const Roles = () => import('../pages/Power/Rights.vue')
const Categories = () => import('../pages/Goods/Categories.vue')
const Params = () => import('../pages/Goods/Params.vue')
const Goods = () => import('../pages/Goods/Goods.vue')
const addGoods = () => import('../pages//Goods/addGoods.vue')
const Orders = () => import('../pages/Orders.vue')
const Reports = () => import('../pages/Reports.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: addGoods },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }

]

const router = new VueRouter({
  base: '/',
  mode: 'hash',
  routes
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  /*
  to : 将要访问的路径
  from: 从那个路径跳转而来
  next : 表示放行 使用方式：1、next() 直接放行 2、next('路径') 强制跳转的路径
  */
  // 判断当前路径是否是 登录页面 是直接放行
  if (to.path === '/login') {
    next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) { // 获取toke如果没有强制跳转到 登录页面 反之放行
    next('/login')
  } else {
    next()
  }
})

export default router
