import request from '@/utils/request'

// 查询学生列表
export function queryStudents(params) {
  return request({
    url: '/students',
    method: 'get',
    params
  })
}

// 查询学生详情
export function getStudent(studentId) {
  return request({
    url: `/students/${studentId}`,
    method: 'get'
  })
}

// 新增学生
export function addStudent(data) {
  return request({
    url: '/students',
    method: 'post',
    data
  })
}

// 更新学生
export function updateStudent(studentId, data) {
  return request({
    url: `/students/${studentId}`,
    method: 'put',
    data
  })
}

// 删除学生
export function deleteStudent(studentId) {
  return request({
    url: `/students/${studentId}`,
    method: 'delete'
  })
}
