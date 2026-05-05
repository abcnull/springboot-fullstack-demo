/**
 * api/student.js — 学生管理相关的 API 接口模块
 *
 * 【知识点】为什么要把 API 抽成独立模块？
 * 这是「关注点分离」（Separation of Concerns）原则的体现：
 *
 * 项目分层架构：
 *   views/StudentQuery.vue   → 页面展示层（用户看到什么）
 *   api/student.js           → 网络请求层（向后端要数据）
 *   utils/request.js         → HTTP 工具层（如何发送请求）
 *
 * 好处：
 * 1. 页面组件不直接依赖 axios，只调用语义化的函数名（如 queryStudents）
 * 2. 如果后端接口地址变了，只需修改 api/ 层，不影响页面组件
 * 3. 多个页面可以复用同一个 API 函数
 * 4. 方便做接口 Mock（测试时替换 api/ 层的实现即可）
 *
 * 【知识点】RESTful API 设计规范
 * 本项目遵循 RESTful 风格的接口设计：
 *   GET    /students         → 查询学生列表
 *   GET    /students/{id}    → 查询单个学生详情
 *   POST   /students         → 新增学生
 *   PUT    /students/{id}    → 更新学生信息
 *   DELETE /students/{id}    → 删除学生
 *
 * HTTP 方法与 CRUD 操作的对应关系：
 *   Create  → POST
 *   Read    → GET
 *   Update  → PUT
 *   Delete  → DELETE
 */

// 引入封装好的 axios 实例
// 路径解析：从 api/student.js 回到 src/，再进入 utils/request.js
import request from '@/utils/request'

/**
 * 查询学生列表（支持分页和条件筛选）
 *
 * @param {Object} params - 查询参数
 * @param {number} [params.pageNum]   - 当前页码
 * @param {number} [params.pageSize]  - 每页条数
 * @param {string} [params.studentId] - 学号（精确匹配）
 * @param {string} [params.name]      - 姓名（模糊匹配）
 * @param {number} [params.age]       - 年龄
 * @param {string} [params.gender]    - 性别
 * @returns {Promise} 返回 Promise 对象，resolve 时拿到 { code, data, message }
 *
 * 【知识点】params vs data 的区别
 * - params：查询参数，会拼接到 URL 后面（?key=value）
 *   例：request({ url: '/students', params: { pageNum: 1 } })
 *   实际请求：GET /api/students?pageNum=1
 *
 * - data：请求体，放在 HTTP Body 中（常用于 POST/PUT）
 *   例：request({ url: '/students', method: 'post', data: { name: '张三' } })
 *   实际请求：POST /api/students，Body: { "name": "张三" }
 */
export function queryStudents(params) {
  return request({
    url: '/students',
    method: 'get',
    params
  })
}

/**
 * 查询单个学生详情
 *
 * @param {string} studentId - 学生 ID
 * @returns {Promise}
 *
 * 【知识点】模板字符串（Template Literals）
 * 使用反引号 ` 包裹字符串，${} 中可以嵌入变量或表达式。
 * 例如：studentId 为 'STU001' 时，url 变为 '/students/STU001'。
 */
export function getStudent(studentId) {
  return request({
    url: `/students/${studentId}`,
    method: 'get'
  })
}

/**
 * 新增学生
 *
 * @param {Object} data - 学生信息
 * @param {string} data.name        - 姓名
 * @param {number} data.age         - 年龄
 * @param {string} data.gender      - 性别
 * @param {string} [data.description] - 描述（可选）
 * @returns {Promise}
 *
 * 【知识点】POST 请求与请求体
 * POST 请求通常携带请求体（data），用于向服务器提交数据。
 * axios 会自动将 JavaScript 对象序列化为 JSON 字符串，
 * 并设置请求头 Content-Type: application/json。
 */
export function addStudent(data) {
  return request({
    url: '/students',
    method: 'post',
    data
  })
}

/**
 * 更新学生信息
 *
 * @param {string} studentId - 学生 ID（标识要更新哪个学生）
 * @param {Object} data      - 更新后的学生信息
 * @returns {Promise}
 *
 * 【知识点】RESTful 中 PUT 与 PATCH 的区别
 * - PUT：整体替换资源（所有字段都要传，未传的字段会被置空）
 * - PATCH：部分更新（只传需要修改的字段）
 * 本项目使用 PUT，代表整体更新。
 */
export function updateStudent(studentId, data) {
  return request({
    // 固定的写法，不用写一堆 +
    url: `/students/${studentId}`,
    method: 'put',
    data
  })
}

/**
 * 删除学生
 *
 * @param {string} studentId - 学生 ID
 * @returns {Promise}
 *
 * 【知识点】DELETE 请求
 * DELETE 请求通常不携带请求体，只需要通过 URL 指定要删除的资源标识。
 */
export function deleteStudent(studentId) {
  return request({
    url: `/students/${studentId}`,
    method: 'delete'
  })
}
