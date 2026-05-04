<template>
  <div class="student-query">
    <h2 class="page-title">学生信息查询</h2>

    <!-- 查询条件 -->
    <el-form :inline="true" :model="queryForm" class="query-form">
      <el-form-item label="学号">
        <el-input v-model="queryForm.studentId" placeholder="请输入学号" clearable></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="queryForm.name" placeholder="请输入姓名（模糊匹配）" clearable></el-input>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model.number="queryForm.age" placeholder="请输入年龄" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="queryForm.gender" placeholder="请选择" clearable>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据列表 -->
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="studentId" label="学号" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="age" label="年龄" width="80"></el-table-column>
      <el-table-column prop="gender" label="性别" width="80"></el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="180"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" style="color: #F56C6C" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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
import { queryStudents, deleteStudent } from '@/api/student'

export default {
  name: 'StudentQuery',
  data() {
    return {
      queryForm: {
        studentId: '',
        name: '',
        age: null,
        gender: ''
      },
      tableData: [],
      loading: false,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 查询数据
    async fetchData() {
      this.loading = true
      try {
        const params = {
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize
        }
        if (this.queryForm.studentId) params.studentId = this.queryForm.studentId
        if (this.queryForm.name) params.name = this.queryForm.name
        if (this.queryForm.age !== null && this.queryForm.age !== '') params.age = this.queryForm.age
        if (this.queryForm.gender) params.gender = this.queryForm.gender

        const res = await queryStudents(params)
        this.tableData = res.data.list
        this.pagination.total = res.data.total
        this.pagination.pageNum = res.data.pageNum
        this.pagination.pageSize = res.data.pageSize
      } catch (e) {
        // 错误已在拦截器中处理
      } finally {
        this.loading = false
      }
    },

    // 查询按钮
    handleQuery() {
      this.pagination.pageNum = 1
      this.fetchData()
    },

    // 重置按钮
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

    // 编辑按钮
    handleEdit(row) {
      this.$router.push(`/form/${row.studentId}`)
    },

    // 删除按钮
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

    // 每页条数变化
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.pageNum = 1
      this.fetchData()
    },

    // 页码变化
    handleCurrentChange(val) {
      this.pagination.pageNum = val
      this.fetchData()
    }
  }
}
</script>

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
  text-align: right;
}
</style>
