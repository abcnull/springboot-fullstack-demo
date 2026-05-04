<template>
  <div class="student-form">
    <h2 class="page-title">学生信息存储</h2>

    <el-form :model="form" :rules="rules" ref="studentForm" label-width="100px" class="form-container">
      <!-- 编辑模式下显示学号（只读） -->
      <el-form-item v-if="isEdit" label="学号">
        <el-input v-model="form.studentId" disabled></el-input>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入姓名" maxlength="50"></el-input>
      </el-form-item>

      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="form.age" :min="0" :max="150" placeholder="请输入年龄"></el-input-number>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择性别">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入描述"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getStudent, addStudent, updateStudent } from '@/api/student'

export default {
  name: 'StudentForm',
  data() {
    return {
      form: {
        studentId: '',
        name: '',
        age: null,
        gender: '',
        description: ''
      },
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
      submitting: false
    }
  },
  computed: {
    isEdit() {
      return !!this.$route.params.studentId
    }
  },
  created() {
    if (this.isEdit) {
      this.loadStudentData()
    }
  },
  methods: {
    // 编辑模式下加载学生数据
    async loadStudentData() {
      try {
        const res = await getStudent(this.$route.params.studentId)
        const student = res.data
        this.form = {
          studentId: student.studentId,
          name: student.name,
          age: student.age,
          gender: student.gender,
          description: student.description || ''
        }
      } catch (e) {
        this.$message.error('加载学生信息失败')
        this.$router.push('/query')
      }
    },

    // 保存按钮
    handleSubmit() {
      this.$refs.studentForm.validate(async (valid) => {
        if (!valid) return

        this.submitting = true
        try {
          const data = {
            name: this.form.name,
            age: this.form.age,
            gender: this.form.gender,
            description: this.form.description
          }

          if (this.isEdit) {
            await updateStudent(this.form.studentId, data)
            this.$message.success('更新成功')
          } else {
            await addStudent(data)
            this.$message.success('新增成功')
          }
          this.$router.push('/query')
        } catch (e) {
          // 错误已在拦截器中处理
        } finally {
          this.submitting = false
        }
      })
    },

    // 取消按钮
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
.form-container {
  max-width: 600px;
}
</style>
