<!--
  Sidebar.vue — 侧边栏导航菜单组件

  【知识点】通用组件 vs 页面组件
  本项目中的组件分为两类：
  - src/views/     → 页面组件（路由级别，一个路由对应一个页面）
  - src/components/ → 通用组件（可复用的 UI 部件，由父组件引入）

  Sidebar 属于通用组件，放在 App.vue（根组件）中，
  它在整个应用的生命周期内一直存在，不会随路由切换而销毁。
-->
<template>
  <div class="sidebar">
    <!-- 侧边栏顶部标题 -->
    <div class="sidebar-title">学生管理系统</div>

    <!--
      Element UI 导航菜单组件 <el-menu>

      【知识点】el-menu 组件核心属性：
      - :default-active：当前激活菜单项的 index 值（动态绑定）
      - background-color：菜单背景色
      - text-color：菜单文字默认颜色
      - active-text-color：激活状态的文字颜色
      - router：开启路由模式（点击菜单项时自动进行路由跳转）

      【知识点】router 属性的魔力
      当 <el-menu> 设置了 router 属性后：
      1. 点击 <el-menu-item index="/query"> 时
      2. 自动触发 this.$router.push('/query')
      3. URL 变为 /query，Vue Router 匹配到 StudentQuery 组件并渲染

      如果没有 router 属性，菜单点击只改变激活状态，不会跳转路由。
    -->
    <el-menu :default-active="activeMenu" class="sidebar-menu" background-color="#304156" text-color="#bfcbd9"
      active-text-color="#409EFF" router>
      <!--
        菜单项 1：学生信息查询

        【知识点】el-menu-item 的 index 属性
        - index 用于标识菜单项，配合 default-active 实现高亮
        - 当 el-menu 开启 router 模式时，index 同时作为路由路径
        - 点击后会自动跳转到 index 指定的路径

        【知识点】图标类名
        el-icon-search 是 Element UI 内置的图标类名，
        Element UI 提供了丰富的图标库，直接用 <i class="el-icon-xxx"> 使用。
        常用图标：el-icon-search（搜索）、el-icon-edit（编辑）、
        el-icon-delete（删除）、el-icon-setting（设置）等。
      -->
      <el-menu-item index="/query">
        <i class="el-icon-search"></i>
        <!--
          【知识点】具名插槽 slot="title"
          el-menu-item 的文字内容需要放在 slot="title" 的插槽中。
          Element UI 的菜单组件使用插槽来区分「图标」和「标题文字」的位置。
          插槽（Slot）是 Vue 组件间内容分发的机制，允许父组件向子组件传递 HTML 内容。
        -->
        <span slot="title">学生信息查询</span>
      </el-menu-item>

      <!-- 菜单项 2：学生信息存储（新增学生） -->
      <el-menu-item index="/form">
        <i class="el-icon-edit"></i>
        <span slot="title">学生信息存储</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',

  /**
   * 【知识点】computed 计算属性
   *
   * 计算属性是基于依赖进行缓存的属性，当依赖不变时不会重新计算。
   * 与 methods 的区别：
   * - methods：每次调用都会重新执行函数体
   * - computed：只有依赖（this.$route.path）变化时才重新计算，否则返回缓存值
   *
   * 这里用 computed 而不是 methods，是因为 activeMenu 在模板中被绑定，
   * Vue 会在每次渲染时调用它，computed 的缓存机制可以避免不必要的计算。
   *
   * 适用场景：
   * - 需要根据其他数据动态计算的值
   * - 依赖变化频率低于使用频率时（缓存收益高）
   */
  computed: {
    activeMenu() {
      // this.$route 是 Vue Router 注入的当前路由信息对象
      // this.$route.path 获取当前 URL 的路径部分
      const path = this.$route.path

      // 处理编辑页面（/form/:studentId）的高亮逻辑
      // 访问 /form/STU001 时，path 是 '/form/STU001'
      // 但菜单项 index 是 '/form'，不匹配会导致菜单不高亮
      // 所以需要手动判断：如果路径以 '/form' 开头，就返回 '/form'
      if (path.startsWith('/form')) {
        return '/form'
      }
      return path
    }
  }
}
</script>

<!--
  【知识点】scoped 样式隔离
  加上 scoped 后，该组件的 CSS 只对当前组件的 DOM 元素生效，
  不会影响到其他组件（即使类名相同也不会冲突）。

  Vue 的实现原理：给当前组件的每个 DOM 元素添加一个唯一的 data 属性
  （如 data-v-7ba5bd90），CSS 选择器也会加上这个属性作为限定条件。
  例如：.sidebar[data-v-7ba5bd90] { ... }

  什么时候不用 scoped？
  - 根组件 App.vue（需要定义全局样式）
  - 需要覆盖第三方组件库样式的场景（如修改 Element UI 内部样式）
-->
<style scoped>
.sidebar {
  height: 100%;
  background-color: #304156;
}

.sidebar-title {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #3a4a5b;
}

/*
 * 【知识点】去除菜单右侧边框
 * Element UI 的 el-menu 默认有右边框，
 * 这里设为 none 是为了让侧边栏视觉效果更整洁。
 */
.sidebar-menu {
  border-right: none;
}
</style>
