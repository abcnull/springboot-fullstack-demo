/**
 * router/index.js — Vue Router 路由配置文件
 *
 * 【知识点】什么是前端路由？
 * 前端路由实现了「不刷新页面的情况下切换页面内容」。
 * 通过监听 URL 的变化，动态加载和渲染对应的 Vue 组件。
 *
 * 【知识点】路由模式
 * Vue Router 有两种模式：
 * 1. Hash 模式（默认）：URL 带 # 号，如 http://localhost:8081/#/query
 *    原理：监听 hashchange 事件，# 后面的部分变化不会触发页面刷新
 * 2. History 模式：URL 不带 # 号，如 http://localhost:8081/query
 *    原理：使用 HTML5 的 History API（pushState/replaceState）
 *    注意：需要后端配置支持，否则刷新页面会 404
 *
 * 本项目使用默认的 Hash 模式。
 *
 * 【知识点】类比后端
 * 前端路由 ≈ 后端的路由映射（如 Spring MVC 的 @RequestMapping）
 * 前端：/query → 渲染 StudentQuery 组件
 * 后端：/api/students → 执行 StudentController.queryStudents() 方法
 */

// 引入 Vue 和 Vue Router
import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入页面组件（路由级别组件，也叫「视图组件」）
// 【知识点】路由级组件 vs 通用组件
// - 路由级组件（views/）：对应一个完整页面，由路由表管理
// - 通用组件（components/）：可复用的 UI 部件，由父组件引入使用
import StudentQuery from '@/views/StudentQuery.vue'
import StudentForm from '@/views/StudentForm.vue'

// 安装 Vue Router 插件
// 【知识点】Vue.use(VueRouter) 让 Vue 可以使用 <router-view>、<router-link> 等内置组件，
// 以及 this.$router（路由实例）和 this.$route（当前路由信息）。
Vue.use(VueRouter)

/**
 * 路由表：定义 URL 路径与组件的映射关系
 *
 * 【知识点】路由配置项说明
 * - path：URL 路径
 * - name：路由名称（命名路由），可用于编程式导航 this.$router.push({ name: 'xxx' })
 * - component：路径匹配时渲染的组件
 * - meta：路由元信息，自定义数据，可在路由守卫中访问 this.$route.meta
 * - redirect：重定向，访问该路径时自动跳转到另一个路径
 */
const routes = [
  {
    // 根路径 '/' 重定向到 '/query'
    // 【知识点】redirect 重定向
    // 用户访问 http://localhost:8081/ 时，自动跳转到 /query 页面，
    // 确保用户进入网站时看到的是查询页面。
    path: '/',
    redirect: '/query'
  },
  {
    // 学生信息查询页面
    // 完整路径：http://localhost:8081/#/query
    path: '/query',
    name: 'StudentQuery',
    component: StudentQuery,
    // 【知识点】meta 元信息
    // 可以存放任意自定义数据，常用于：
    // - 页面标题（配合路由守卫动态修改 document.title）
    // - 权限控制（如 meta: { requiresAuth: true }）
    // - 面包屑导航
    meta: { title: '学生信息查询' }
  },
  {
    // 新增学生页面
    // 完整路径：http://localhost:8081/#/form
    path: '/form',
    name: 'StudentFormAdd',
    component: StudentForm,
    meta: { title: '学生信息存储' }
  },
  {
    // 编辑学生页面（带动态参数 studentId）
    // 完整路径示例：http://localhost:8081/#/form/STU202605051200001
    //
    // 【知识点】动态路由参数（:studentId）
    // 冒号 :studentId 是动态路径参数的语法，
    // 表示这段 URL 是可变的。在组件中通过 this.$route.params.studentId 获取。
    //
    // 例如访问 /form/STU123：
    //   this.$route.params.studentId === 'STU123'
    //
    // 同一个路径可以匹配多个实际 URL：
    //   /form/STU001、/form/STU002、/form/STU003 ...
    //
    // 【知识点】新增和编辑使用同一个组件 StudentForm
    // 通过是否有 studentId 参数来区分当前是新增还是编辑模式。
    // 这是 Vue 中常见的「一个组件复用为多个路由页面」的技巧。
    path: '/form/:studentId',
    name: 'StudentFormEdit',
    component: StudentForm,
    meta: { title: '学生信息存储' }
  }
]

// 创建路由实例
const router = new VueRouter({
  routes
  // 【知识点】mode: 'hash'（默认值，可省略）
  // 如果要使用 History 模式，需要显式配置：
  // mode: 'history'
  // 但 History 模式需要后端配合（所有路径都返回 index.html），
  // 否则用户直接访问非根路径时会 404。
})

// 【知识点】路由守卫（可选扩展点）
// 可以在路由跳转前做一些逻辑处理，例如：
//
// router.beforeEach((to, from, next) => {
//   // 设置页面标题
//   document.title = to.meta.title || '学生管理系统'
//   // 权限检查
//   if (to.meta.requiresAuth && !isAuthenticated()) {
//     next('/login')
//   } else {
//     next()
//   }
// })
//
// 本项目暂未使用，但这是实际项目中非常常用的功能。

export default router
