<template>
  <div class="sidebar">
    <div class="sidebar-title">学生管理系统</div>
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      router
    >
      <el-menu-item index="/query">
        <i class="el-icon-search"></i>
        <span slot="title">学生信息查询</span>
      </el-menu-item>
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
  computed: {
    activeMenu() {
      const path = this.$route.path
      // 编辑页面时，高亮查询菜单
      if (path.startsWith('/form')) {
        return '/form'
      }
      return path
    }
  }
}
</script>

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
.sidebar-menu {
  border-right: none;
}
</style>
