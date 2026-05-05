/**
 * main.js — Vue 应用的入口文件
 *
 * 【知识点】什么是入口文件？
 * 类比后端：Spring Boot 有 main() 方法作为程序入口，前端也有类似的入口文件。
 * 当执行 npm run serve 或 npm run build 时，Webpack 从这个文件开始，
 * 递归分析所有 import 依赖，将整个应用打包。
 *
 * 【知识点】执行流程
 * 1. 浏览器加载 index.html
 * 2. Webpack 打包的 JS 文件被加载执行
 * 3. main.js 作为入口，初始化 Vue 实例
 * 4. Vue 实例挂载到 index.html 中的 <div id="app"> 上
 * 5. 整个前端应用开始运行
 */

// ============================================================
// 一、引入 Vue 核心库和插件
// ============================================================

// 引入 Vue 核心库
// 【知识点】Vue 是一个渐进式 JavaScript 框架，核心功能包括：
// - 响应式数据绑定（数据变了，视图自动更新）
// - 组件化开发（将 UI 拆分为独立可复用的组件）
// - 虚拟 DOM（高效的 DOM 更新机制）
import Vue from 'vue'

// 引入 Element UI 组件库
// 【知识点】Element UI 是饿了么团队开发的 Vue 2.x UI 组件库，
// 提供了按钮、表单、表格、对话框等大量现成的 UI 组件，
// 开发者无需从零编写样式和交互逻辑。
import ElementUI from 'element-ui'

// 引入 Element UI 的默认主题样式
// 【知识点】UI 组件库通常包含「组件逻辑」和「样式」两部分，
// 需要分别引入。theme-chalk 是 Element UI 的默认 CSS 主题。
// 不引入这个 CSS，组件功能正常但没有样式（会很难看）。
import 'element-ui/lib/theme-chalk/index.css'

// 引入根组件 App.vue
// 【知识点】每个 Vue 项目都有一个根组件（App.vue），
// 它是所有其他组件的「祖先」，整个组件树从这里开始。
// '@' 是 Webpack 配置的路径别名，代表 src/ 目录，
// 这样引入时就不需要写 '../../../src/App.vue' 这种相对路径了。
import App from './App.vue'

// 引入路由配置
// 【知识点】vue-router 实现了页面路由功能，
// 让用户在不刷新页面的情况下切换不同「页面」（其实是切换组件）。
// 类比后端：后端通过 URL 路径映射到不同的 Controller 方法，
// 前端通过 vue-router 将 URL 路径映射到不同的 Vue 组件。
import router from './router'

// ============================================================
// 二、注册全局插件
// ============================================================

// 全局注册 Element UI 插件
// 【知识点】Vue.use() 是 Vue 的插件安装机制。
// 调用 Vue.use(ElementUI) 后，Element UI 的所有组件
// （如 <el-button>、<el-input>、<el-table> 等）都可在任意组件中直接使用，
// 无需在每个组件中单独 import 和注册。
//
// 【知识点】Vue.use() 内部做了什么？
// 会调用 ElementUI 的 install(Vue) 方法，
// 该方法内部执行了 Vue.component('el-button', ...) 等全局注册操作。
Vue.use(ElementUI)

// 关闭生产环境提示
// 【知识点】Vue 在生产环境下会在控制台显示一条提示：
// "You are running Vue in development mode."
// 设为 false 可以关闭这个提示，让控制台更干净。
// Vue CLI 在 build 时会自动设为 true，这里手动关闭是开发阶段的习惯。
Vue.config.productionTip = false

// ============================================================
// 三、创建并挂载 Vue 根实例
// ============================================================

/**
 * new Vue({...}) — 创建 Vue 根实例
 *
 * 【知识点】每个 Vue 应用都是通过 new Vue() 创建的「根实例」启动的。
 * 这个根实例是整个组件树的顶端，所有子组件都挂在它下面。
 *
 * 【知识点】render 函数
 * - render: h => h(App) 是 App 组件的渲染函数
 * - h 是 createElement 的简写（Hyperscript 的缩写）
 * - 这行代码等价于：把 App 组件渲染为 DOM 元素，替换到挂载点中
 *
 * 为什么不直接写 template: '<App/>' ？
 * 因为 Vue CLI 默认使用「运行时版」Vue（不含模板编译器，体积更小），
 * 所以必须用 render 函数而不是 template 字符串。
 *
 * 【知识点】router
 * 将路由实例注入到 Vue 根实例中，
 * 这样所有子组件都能通过 this.$router 和 this.$route 访问路由功能。
 *
 * 【知识点】$mount('#app')
 * 将 Vue 实例挂载到 index.html 中 id="app" 的 DOM 元素上。
 * 等价于在 new Vue 中配置 el: '#app'。
 * 使用 $mount() 的好处是可以延迟挂载，在挂载前做一些其他操作。
 */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app') // 只认 public/index.html 中的 '#app' 作为模板
