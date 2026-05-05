<!--
  StudentQuery.vue — 学生信息查询页面

  【知识点】页面组件（View Component）
  位于 views/ 目录下的组件通常对应一个完整页面，
  由路由表（router/index.js）管理，一个路由对应一个页面组件。
  当用户访问 /query 路径时，Vue Router 会将这个组件渲染到 <router-view /> 位置。

  【知识点】本页面功能概述
  1. 查询条件表单（学号、姓名、年龄、性别筛选）
  2. 数据表格展示（el-table 展示学生列表）
  3. 分页功能（el-pagination 实现翻页）
  4. 操作按钮（编辑、删除）
-->
<template>
  <div class="student-query">
    <h2 class="page-title">学生信息查询</h2>

    <!-- ============================================================ -->
    <!-- 查询条件表单                                                  -->
    <!-- ============================================================ -->

    <!--
      Element UI 表单组件 <el-form>

      【知识点】el-form 核心属性
      - :inline="true"：行内表单模式（表单项水平排列，而非垂直堆叠）
      - :model="queryForm"：绑定表单数据对象，表单项通过 v-model 读写该对象的属性
      - class="query-form"：自定义样式类

      【知识点】el-form 与普通 HTML form 的区别
      Element UI 的 el-form 提供了额外功能：
      - 统一的表单布局和样式
      - 表单验证（rules + prop）
      - 表单方法（validate、resetFields 等）
    -->
    <el-form :inline="true" :model="queryForm" class="query-form">

      <!--
        【知识点】v-model 双向数据绑定
        v-model 是 Vue 最核心的指令之一，实现了数据与视图的双向绑定：
        - 数据 → 视图：当 queryForm.studentId 变化时，输入框自动更新显示
        - 视图 → 数据：当用户在输入框中输入时，queryForm.studentId 自动更新

        v-model 的本质（语法糖）：
        <input v-model="queryForm.studentId">
        等价于：
        <input :value="queryForm.studentId" @input="queryForm.studentId = $event.target.value">

        【知识点】clearable 属性
        Element UI 输入框的 clearable 属性会在输入框右侧显示一个清除按钮（×），
        点击后清空输入框内容。
      -->
      <el-form-item label="学号">
        <el-input v-model="queryForm.studentId" placeholder="请输入学号" clearable></el-input>
      </el-form-item>

      <el-form-item label="姓名">
        <el-input v-model="queryForm.name" placeholder="请输入姓名（模糊匹配）" clearable></el-input>
      </el-form-item>

      <!--
        【知识点】v-model 修饰符 .number
        v-model.number 会将用户输入的字符串自动转换为数字类型。
        原生 HTML input 总是返回字符串，加 .number 修饰符后，
        Vue 会尝试使用 parseFloat() 转换，如果转换失败则返回原始字符串。
      -->
      <el-form-item label="年龄">
        <el-input v-model.number="queryForm.age" placeholder="请输入年龄" clearable></el-input>
      </el-form-item>

      <!--
        Element UI 下拉选择框 <el-select>

        【知识点】el-select 与 el-option
        - el-select：下拉选择框容器，v-model 绑定选中的值
        - el-option：下拉选项，label 是显示文字，value 是选中后的值

        选中"男"时，queryForm.gender 的值变为 "男"。
      -->
      <el-form-item label="性别">
        <el-select v-model="queryForm.gender" placeholder="请选择" clearable>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <!--
          Element UI 按钮组件 <el-button>

          【知识点】el-button 属性
          - type="primary"：主色调按钮（蓝色），用于主要操作
          - @click：绑定点击事件（Vue 事件绑定指令）

          【知识点】Vue 事件绑定 @click
          @click 是 v-on:click 的语法糖，用于监听 DOM 事件。
          <el-button @click="handleQuery">  等价于：
          <el-button v-on:click="handleQuery">
        -->
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- ============================================================ -->
    <!-- 数据表格                                                      -->
    <!-- ============================================================ -->

    <!--
      Element UI 表格组件 <el-table>

      【知识点】el-table 核心属性
      - :data="tableData"：绑定表格数据源（数组），每条数据渲染一行
      - border：显示表格边框
      - style="width: 100%"：表格宽度 100% 自适应
      - v-loading="loading"：加载状态指令

      【知识点】v-loading 指令
      v-loading 是 Element UI 提供的自定义指令，
      当 loading 为 true 时，表格上方会显示一个加载遮罩动画，
      为 false 时遮罩消失。用于异步数据加载时给用户反馈。
    -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <!--
        表格列 <el-table-column>

        【知识点】el-table-column 核心属性
        - prop：对应数据对象中的字段名（tableData 中每条数据的属性名）
        - label：表头显示的文字
        - width：列宽（像素值），不设则自动分配

        例如：<el-table-column prop="studentId" label="学号">
        会从每条数据中取 studentId 字段的值显示在该列中。
      -->
      <el-table-column prop="studentId" label="学号" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="age" label="年龄" width="80"></el-table-column>
      <el-table-column prop="gender" label="性别" width="80"></el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="180"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>

      <!--
        操作列（自定义内容）

        【知识点】作用域插槽（Scoped Slot）
        普通的 el-table-column 通过 prop 展示数据，
        但「操作列」需要自定义内容（编辑/删除按钮），不能用 prop。
        这里使用了作用域插槽（slot-scope）来获取当前行的数据。

        slot-scope="scope" 的含义：
        - scope 是 el-table-column 传出来的插槽作用域对象
        - scope.row 是当前行的数据对象（即 tableData 中的某一条数据）
        - 通过 scope.row 可以拿到当前行的所有字段

        例如点击编辑按钮时：handleEdit(scope.row) 传入了当前行的学生数据。
      -->
      <el-table-column label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <!--
            type="text"：文字按钮样式（无背景色，只有文字和下划线效果）
            size="small"：小号按钮

            【知识点】内联样式 :style
            :style="{ color: '#F56C6C' }" 动态绑定样式，将删除按钮文字设为红色。
            也可以写成 style="color: #F56C6C"（静态），但 Vue 推荐用 : 动态绑定。
          -->
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" style="color: #F56C6C" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ============================================================ -->
    <!-- 分页组件                                                      -->
    <!-- ============================================================ -->

    <!--
      Element UI 分页组件 <el-pagination>

      【知识点】el-pagination 核心属性和事件
      - @size-change：每页条数变化时触发的事件
      - @current-change：页码变化时触发的事件
      - :current-page：当前页码（双向绑定）
      - :page-sizes：可选的每页条数列表
      - :page-size：当前每页条数
      - :total：总记录数（用于计算总页数）
      - layout：分页组件的布局（显示哪些子组件）

      【知识点】layout 布局说明
      layout="total, sizes, prev, pager, next, jumper"
      - total：显示总记录数
      - sizes：每页条数下拉选择器
      - prev：上一页按钮
      - pager：页码按钮（1, 2, 3...）
      - next：下一页按钮
      - jumper：页码跳转输入框（输入页码直接跳转）
    -->
    <div class="pagination-wrapper">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.pageNum"
        :page-sizes="[10, 20, 50]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// 引入 API 接口函数
// 【知识点】按需引入 API 函数
// 只引入当前页面需要的接口函数（queryStudents 和 deleteStudent），
// 不需要的（如 addStudent、updateStudent）不引入，减小打包体积。
import { queryStudents, deleteStudent } from '@/api/student'

export default {
  // 组件名称，用于 Vue DevTools 调试
  name: 'StudentQuery',

  /**
   * 【知识点】data 函数
   * Vue 组件的 data 必须是一个函数（而非对象），返回一个新对象。
   * 原因：如果 data 是对象，多个同名组件实例会共享同一份数据（引用类型），
   * 导致一个组件修改数据会影响其他组件。
   * 使用函数返回新对象，每个实例都有独立的数据副本。
   */
  data() {
    return {
      // 查询条件表单数据
      queryForm: {
        studentId: '',
        name: '',
        age: null,
        gender: ''
      },
      // 表格数据（由后端返回）
      tableData: [],
      // 表格加载状态
      loading: false,
      // 分页信息
      pagination: {
        pageNum: 1,    // 当前页码
        pageSize: 10,  // 每页条数
        total: 0       // 总记录数
      }
    }
  },

  /**
   * 【知识点】created 生命周期钩子
   *
   * Vue 组件的生命周期：创建 → 挂载 → 更新 → 销毁
   *
   * 常用生命周期钩子：
   * - created：实例创建完成，data/computed 已初始化，但 DOM 尚未挂载
   *            适合：发起初始数据请求（如本页面的查询）
   * - mounted：DOM 挂载完成，可以访问 DOM 元素
   *            适合：需要操作 DOM 的场景（如初始化图表）
   * - beforeDestroy：实例销毁前
   *            适合：清理定时器、取消事件监听等
   *
   * created 中调用 fetchData()，页面加载时就自动查询第一页数据。
   */
  created() {
    this.fetchData()
  },

  methods: {
    /**
     * 查询数据（核心方法）
     *
     * 【知识点】async/await 异步编程
     * async/await 是 ES2017 引入的异步编程语法糖，
     * 让异步代码看起来像同步代码，更易阅读和维护。
     *
     * async 标记的函数自动返回 Promise
     * await 只能在 async 函数中使用，等待 Promise 完成并获取结果
     *
     * 等价的 Promise 写法：
     *   queryStudents(params).then(res => { ... }).catch(e => { ... })
     *
     * 【知识点】try-catch-finally 错误处理
     * - try：包含可能出错的代码
     * - catch：捕获错误并处理
     * - finally：无论成功失败都执行（通常用于清理 loading 状态）
     */
    async fetchData() {
      this.loading = true
      try {
        // 组装查询参数
        const params = {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize
        }
        // 只传递非空的查询条件（避免发送空参数给后端）
        if (this.queryForm.studentId) params.studentId = this.queryForm.studentId
        if (this.queryForm.name) params.name = this.queryForm.name
        if (this.queryForm.age !== null && this.queryForm.age !== '') params.age = this.queryForm.age
        if (this.queryForm.gender) params.gender = this.queryForm.gender

        // 调用 API 接口查询学生数据
        const res = await queryStudents(params)

        // 将后端返回的数据赋值给表格数据和分页信息
        this.tableData = res.data.list
        this.pagination.total = res.data.total
        this.pagination.pageNum = res.data.pageNum
        this.pagination.pageSize = res.data.pageSize
      } catch (e) {
        // 错误已在 request.js 的响应拦截器中统一处理（弹出提示）
        // 这里留空即可，不需要重复处理
      } finally {
        // 无论成功失败，都关闭 loading 状态
        this.loading = false
      }
    },

    /**
     * 查询按钮点击事件
     *
     * 【知识点】查询时重置页码为 1
     * 用户修改查询条件后点击查询，应该从第一页开始展示结果，
     * 否则可能停留在第 3 页但新的查询条件只有 1 页数据。
     */
    handleQuery() {
      this.pagination.pageNum = 1
      this.fetchData()
    },

    /**
     * 重置按钮点击事件
     * 清空所有查询条件并重新查询第一页
     */
    handleReset() {
      this.queryForm = {
        studentId: '',
        name: '',
        age: null,
        gender: ''
      }
      this.pagination.pageNum = 1
      this.fetchData()
    },

    /**
     * 编辑按钮点击事件
     *
     * 【知识点】编程式导航 this.$router.push()
     * 除了用 <router-link> 声明式导航，还可以用代码控制路由跳转。
     * push() 会向历史记录中添加一条新记录（浏览器可回退）。
     *
     * 常用的导航方式：
     * - 路径字符串：this.$router.push('/form/STU001')
     * - 对象形式：  this.$router.push({ name: 'StudentFormEdit', params: { studentId: 'STU001' } })
     */
    handleEdit(row) {
      this.$router.push(`/form/${row.studentId}`)
    },

    /**
     * 删除按钮点击事件
     *
     * 【知识点】$confirm 确认弹窗
     * this.$confirm 是 Element UI 注册在 Vue 原型上的方法，
     * 用于显示一个确认对话框，返回 Promise。
     * - 用户点击「确定」：执行 .then() 中的回调
     * - 用户点击「取消」：执行 .catch() 中的回调（catch 中留空即可）
     *
     * 【知识点】删除后自动翻页处理
     * 如果当前页只有 1 条数据且不是第一页，删除后应该回到上一页。
     * 否则会出现当前页无数据的尴尬情况。
     */
    handleDelete(row) {
      this.$confirm('确认删除该学生信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await deleteStudent(row.studentId)
          this.$message.success('删除成功')
          // 删除后如果当前页没有数据了，跳转到前一页
          if (this.tableData.length === 1 && this.pagination.pageNum > 1) {
            this.pagination.pageNum--
          }
          this.fetchData()
        } catch (e) {
          // 错误已在拦截器中处理
        }
      }).catch(() => {})
    },

    /**
     * 每页条数变化事件
     *
     * 【知识点】切换每页条数时重置页码为 1
     * 例如：从每页 10 条切换到每页 50 条，应从第 1 页开始展示，
     * 否则可能停留在第 5 页但总共只有 2 页数据。
     */
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.pageNum = 1
      this.fetchData()
    },

    /**
     * 页码变化事件
     * 用户点击页码或跳转到指定页时触发
     */
    handleCurrentChange(val) {
      this.pagination.pageNum = val
      this.fetchData()
    }
  }
}
</script>

<!--
  【知识点】scoped 样式的作用范围
  本组件的样式只在 StudentQuery.vue 的 template 中生效，不会传给子组件
  不会影响到其他组件，即使使用了相同的类名。
-->
<style scoped>
.student-query {
  padding: 20px;
}

.page-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #303133;
}

.query-form {
  margin-bottom: 20px;
}

.pagination-wrapper {
  margin-top: 20px;
  /* 分页组件右对齐 */
  text-align: right;
}
</style>
