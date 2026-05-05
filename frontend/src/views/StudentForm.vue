<!--
  StudentForm.vue — 学生信息表单页面（新增/编辑复用）

  【知识点】一个组件复用为多个路由页面
  本组件同时服务于两个路由：
  - /form             → 新增学生模式
  - /form/:studentId  → 编辑学生模式

  通过判断路由参数中是否有 studentId 来区分当前模式，
  这是 Vue 中非常常见的「组件复用」技巧，避免为新增和编辑写两个几乎相同的页面。

  【知识点】本页面功能概述
  1. 表单输入（姓名、年龄、性别、描述）
  2. 表单校验（必填校验、长度校验、范围校验）
  3. 编辑模式下加载已有数据
  4. 提交保存（新增用 POST，编辑用 PUT）
  5. 取消返回查询页面
-->
<template>
  <div class="student-form">
    <h2 class="page-title">学生信息存储</h2>

    <!--
      Element UI 表单组件 <el-form>（带校验功能）

      【知识点】el-form 表单校验机制
      Element UI 的表单校验由三者协作完成：
      1. :model="form"     → 绑定表单数据对象
      2. :rules="rules"    → 绑定校验规则对象
      3. prop="name"       → el-form-item 上声明该字段对应 rules 中的哪个规则

      校验流程：
      1. 用户输入 → 触发对应 trigger（blur/change）
      2. Vue 根据 prop 找到 rules 中的规则数组
      3. 依次校验每条规则（required → max → ...）
      4. 校验失败则显示 message 提示
      5. 手动调用 this.$refs.studentForm.validate() 触发全部校验

      【知识点】ref 属性与 $refs
      ref 是 Vue 提供的 DOM/组件引用机制：
      - 模板中：ref="studentForm" 给元素/组件命名
      - JS 中：this.$refs.studentForm 访问该元素/组件实例
      常用于：获取表单实例调用 validate()、获取 DOM 元素等。
    -->
    <el-form :model="form" :rules="rules" ref="studentForm" label-width="100px" class="form-container">

      <!--
        编辑模式下显示学号（只读）

        【知识点】v-if 条件渲染
        v-if 根据表达式的真假来决定是否渲染该 DOM 元素。
        - v-if="true"：元素存在于 DOM 中
        - v-if="false"：元素从 DOM 中完全移除（不仅仅是隐藏）

        与 v-show 的区别：
        - v-if：条件为 false 时，元素完全不渲染（有更高的切换开销）
        - v-show：条件为 false 时，元素仍渲染但设为 display:none（有更高的初始渲染开销）
        选择建议：频繁切换用 v-show，条件不常变用 v-if

        【知识点】disabled 属性
        表单控件的 disabled 属性使其变为只读状态，用户无法修改。
        编辑模式下学号不允许修改，所以设为 disabled。
      -->
      <el-form-item v-if="isEdit" label="学号">
        <el-input v-model="form.studentId" disabled></el-input>
      </el-form-item>

      <!--
        【知识点】prop 属性的作用
        prop="name" 用于两个目的：
        1. 表单校验：将该 el-form-item 与 rules.name 中的校验规则关联
        2. 重置表单：this.$refs.studentForm.resetFields() 时，根据 prop 重置对应字段

        【知识点】maxlength 和 show-word-limit
        maxlength="50"：限制最大输入 50 个字符
        配合 show-word-limit 可以显示「已输入字符数 / 最大字符数」
      -->
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" maxlength="50"></el-input>
      </el-form-item>

      <!--
        Element UI 数字输入框 <el-input-number>

        【知识点】el-input-number 属性
        - :min / :max：限制数值范围（超过范围时会自动修正）
        - 有 +/- 按钮方便调整数值
        - 自动校验输入是否为合法数字
      -->
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="0" :max="150" placeholder="请输入年龄"></el-input-number>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择性别">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>

      <!--
        Element UI 文本域 <el-input type="textarea">

        【知识点】textarea 多行文本输入
        - type="textarea"：将输入框变为多行文本域
        - :rows="4"：默认显示 4 行高度
        - show-word-limit：显示字数统计
      -->
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入描述" maxlength="200"
          show-word-limit></el-input>
      </el-form-item>

      <el-form-item>
        <!--
          【知识点】:loading 绑定
          el-button 的 :loading 属性设为 true 时：
          - 按钮文字前会显示一个 loading 动画图标
          - 按钮变为不可点击状态
          防止用户在提交过程中重复点击（防重复提交）。
        -->
        <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入 API 接口函数
import { getStudent, addStudent, updateStudent } from '@/api/student'

export default {
  name: 'StudentForm',

  data() {
    return {
      // 表单数据对象
      form: {
        studentId: '',
        name: '',
        age: null,
        gender: '',
        description: ''
      },

      /**
       * 【知识点】表单校验规则（rules）
       *
       * rules 是一个对象，key 对应表单字段名（与 el-form-item 的 prop 一致），
       * value 是一个数组，包含该字段的所有校验规则。
       *
       * 每条规则对象的属性：
       * - required：是否必填（布尔值）
       * - type：数据类型校验（string/number/array/...）
       * - min / max：长度或值的范围
       * - message：校验失败时的提示文字
       * - trigger：触发校验的时机
       *   - 'blur'：输入框失去焦点时触发（适合输入类控件）
       *   - 'change'：值变化时触发（适合选择类控件）
       *
       * 校验规则按数组顺序依次执行，前一条失败后，后续规则仍会继续校验。
       */
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { max: 50, message: '姓名不能超过50个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { type: 'number', min: 0, max: 150, message: '年龄范围为0-150', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        description: [
          { max: 200, message: '描述不能超过200个字符', trigger: 'blur' }
        ]
      },

      // 提交状态标记（防止重复提交）
      submitting: false
    }
  },

  /**
   * 【知识点】computed 计算属性：判断新增/编辑模式
   *
   * isEdit 的计算逻辑：
   * - this.$route.params.studentId 从 URL 中获取动态参数
   * - 如果 URL 是 /form            → params.studentId 为 undefined → !!undefined = false
   * - 如果 URL 是 /form/STU001     → params.studentId 为 'STU001'  → !!'STU001' = true
   *
   * !! 双重取反的技巧：
   * 将任意值转换为布尔类型（truthy → true，falsy → false）
   *
   * isEdit 在模板中用于 v-if 显示学号，在 methods 中用于判断调用哪个 API。
   */
  computed: {
    isEdit() {
      return !!this.$route.params.studentId
    }
  },

  /**
   * 【知识点】created 生命周期钩子
   *
   * 组件创建后立即执行。
   * 如果是编辑模式（isEdit 为 true），自动加载已有学生数据填充表单。
   * 如果是新增模式（isEdit 为 false），表单保持空白状态。
   */
  created() {
    if (this.isEdit) {
      this.loadStudentData()
    }
  },

  methods: {
    /**
     * 加载学生数据（编辑模式）
     *
     * 【知识点】this.$route.params
     * Vue Router 将 URL 中的动态参数保存在 this.$route.params 对象中。
     * 例如 URL 为 /form/STU001 时：
     *   this.$route.params.studentId === 'STU001'
     *
     * 这与路由配置中的 path: '/form/:studentId' 对应。
     */
    // async 的意思是： "这个方法里面有需要等待的异步操作，请用 await 来等它" 。没有 async ，就不能在方法内用 await
    async loadStudentData() {
      try {
        const res = await getStudent(this.$route.params.studentId)
        const student = res.data
        // 将后端返回的学生数据填充到表单中
        this.form = {
          studentId: student.studentId,
          name: student.name,
          age: student.age,
          gender: student.gender,
          description: student.description || ''
        }
      } catch (e) {
        this.$message.error('加载学生信息失败')
        // 加载失败时跳转回查询页面
        this.$router.push('/query')
      }
    },

    /**
     * 保存按钮点击事件
     *
     * 【知识点】表单提交最佳实践流程
     * 1. 调用 validate() 校验所有字段
     * 2. 校验失败 → 直接 return，不做任何操作
     * 3. 校验通过 → 设置 submitting = true（按钮显示 loading）
     * 4. 调用 API 提交数据
     * 5. 成功 → 弹出成功提示 → 跳转到查询页面
     * 6. 失败 → 拦截器已处理错误提示
     * 7. finally → 设置 submitting = false（恢复按钮状态）
     */
    handleSubmit() {
      // 调用 el-form 的 validate 方法触发全部字段校验
      // callback 参数 valid 为 true 表示全部校验通过
      this.$refs.studentForm.validate(async (valid) => {
        if (!valid) return

        this.submitting = true
        try {
          // 组装提交数据（不包含 studentId，后端自动生成或不需修改）
          const data = {
            name: this.form.name,
            age: this.form.age,
            gender: this.form.gender,
            description: this.form.description
          }

          // 根据模式调用不同的 API
          if (this.isEdit) {
            // 编辑模式：调用 PUT 接口更新学生信息
            await updateStudent(this.form.studentId, data)
            // Vue.use(ElementUI) 配置后，this.$message 是 Element UI 提供的消息提示组件
            // 可以直接调用 this.$message.success('更新成功') 显示成功提示
            // 也可以调用 this.$message.error('更新失败') 显示错误提示
            this.$message.success('更新成功')
          } else {
            // 新增模式：调用 POST 接口创建学生
            await addStudent(data)
            this.$message.success('新增成功')
          }

          // 【知识点】编程式导航跳转回查询页面
          // 提交成功后自动跳转，让用户立即看到新增/修改后的数据
          this.$router.push('/query')
        } catch (e) {
          // 错误已在拦截器中处理
        } finally {
          this.submitting = false
        }
      })
    },

    /**
     * 取消按钮点击事件
     * 直接跳转回查询页面，不保存任何修改
     */
    handleCancel() {
      this.$router.push('/query')
    }
  }
}
</script>

<style scoped>
.student-form {
  padding: 20px;
}

.page-title {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #303133;
}

/* 限制表单最大宽度，避免在宽屏上表单拉伸过长 */
.form-container {
  max-width: 600px;
}
</style>
