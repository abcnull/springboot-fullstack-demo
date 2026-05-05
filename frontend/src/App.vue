<!--
  App.vue — Vue 应用的根组件

  【知识点】Vue 单文件组件（SFC - Single File Component）
  每个 .vue 文件由三部分组成，实现了「模板 + 逻辑 + 样式」的关注点分离：
  ┌────────────────────────────────────┐
  │  <template>  → HTML 模板（页面结构）  │
  │  <script>    → JavaScript（交互逻辑）│
  │  <style>     → CSS（样式美化）       │
  └────────────────────────────────────┘

  【知识点】App.vue 的角色
  App.vue 是整个应用的根组件，所有其他页面组件都嵌套在它内部。
  通常在这里定义全局的布局结构（如侧边栏 + 内容区）。
-->
<template>
  <!--
    id="app" 的 div 是整个应用的根 DOM 元素。
    main.js 中 new Vue({ render: h => h(App) }).$mount('#app')
    会将这个组件渲染到 index.html 的 <div id="app"> 中。
  -->
  <!-- 
  这里写了 <div id="app"> ：Vue 会用 App 的根元素（ <div id="app"> ） 替换 掉 index.html 的 <div id="app"></div>
  不写 <div id="app"> ：Vue 会把 App 的根元素 塞进 index.html 的 <div id="app"></div> 里面（作为子元素）
   -->
  <div id="app">
    <!--
      .app-container 使用 Flex 布局实现左右分栏：
      左侧是固定宽度的侧边栏，右侧是自适应的内容区。
    -->
    <div class="app-container">
      <!--
        左侧菜单栏：引入并使用 Sidebar 子组件

        【知识点】组件的使用三步曲：
        1. import 引入组件文件
        2. 在 components 中注册组件
        3. 在模板中以标签形式使用 <Sidebar />

        Sidebar 是自定义组件名，首字母大写是 Vue 的命名惯例。
      -->
      <div class="sidebar-wrapper">
        <Sidebar />
      </div>

      <!--
        右侧内容区：<router-view /> 是路由出口

        【知识点】<router-view /> 的作用
        这是 vue-router 提供的内置组件，充当「路由出口」。
        当 URL 路径变化时，vue-router 会根据路由配置，
        将匹配到的组件渲染到 <router-view /> 所在的位置。
        例如：访问 /query 显示 StudentQuery，访问 /form 显示 StudentForm。

        类比理解：<router-view /> 就像一个「占位符」，
        告诉 Vue："这里放当前路由对应的组件"。
      -->
      <div class="main-wrapper">
        <!-- vue-router 监听 URL 路由变化，触发显示路由对应的组件展现在这里 -->
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
// 引入侧边栏组件
// 【知识点】@ 路径别名
// '@' 是 Vue CLI 默认配置的 Webpack 路径别名，指向 src/ 目录。
// 优势：无论当前文件在哪个层级，都可以用 '@/' 快速定位到 src/ 下的文件，
// 避免出现 '../../components/Sidebar.vue' 这种难以维护的相对路径。
import Sidebar from '@/components/Sidebar.vue'

export default {
  // 【知识点】name 属性
  // 组件名称，用于 Vue DevTools 调试工具中识别组件，
  // 递归组件和 keep-alive 缓存也会用到。
  name: 'App',

  // 【知识点】局部注册组件
  // components 选项用于局部注册子组件，
  // 只在当前组件的模板中可以使用 <Sidebar />。
  // 相比 Vue.use() 的全局注册，局部注册更精确，有利于 tree-shaking（按需打包）。
  components: {
    Sidebar
  }
}
</script>

<!--
  【知识点】<style> 标签与 scoped 属性

  1. 不加 scoped：样式是全局的，可能影响到子组件的样式
  2. 加了 scoped：样式只作用于当前组件的 DOM 元素（Vue 通过给元素加唯一属性实现）
     例如：App.vue 中的 .app-container 只影响 App 组件内的元素

  本文件的样式没有加 scoped，因为它是根组件的全局布局样式，
  需要对 html、body 等全局元素生效。
-->
<style>
/* 全局重置：清除浏览器默认的 margin 和 padding */
/* html 设置 height: 100%; 相当于 100% 占据浏览器视口高度 */
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

/* 设置全局字体栈：优先使用系统字体，提升加载速度和阅读体验 */
#app {
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

/*
 * Flex 弹性布局实现左右分栏
 * 【知识点】display: flex
 * Flex 布局是 CSS3 引入的一维布局模型，非常适合做水平/垂直排列。
 * - flex 容器的子元素成为「弹性项目」
 * - 可以方便地控制子元素的排列方向、对齐方式、尺寸分配
 */
.app-container {
  display: flex;
  height: 100%;
}

/* 左侧侧边栏：固定宽度 200px */
.sidebar-wrapper {
  width: 200px;
  /*
   * flex-shrink: 0 — 禁止侧边栏在空间不足时缩小
   * 默认值是 1，意味着空间不足时子元素会等比缩小，
   * 设为 0 可以保证侧边栏始终保持 200px 宽度。
   */
  flex-shrink: 0;
  height: 100%;
}

/* 右侧内容区：占据剩余所有空间 */
.main-wrapper {
  /*
   * flex: 1 是 flex-grow: 1 的简写
   * 表示该元素会填满主轴方向的剩余空间。
   * 侧边栏占 200px 后，内容区自动占满剩余宽度。
   */
  flex: 1;
  /* 内容超出时显示纵向滚动条 */
  overflow-y: auto;
  background-color: #f0f2f5;
}
</style>
