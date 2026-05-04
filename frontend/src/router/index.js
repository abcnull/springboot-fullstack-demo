import Vue from 'vue'
import VueRouter from 'vue-router'
import StudentQuery from '@/views/StudentQuery.vue'
import StudentForm from '@/views/StudentForm.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/query'
  },
  {
    path: '/query',
    name: 'StudentQuery',
    component: StudentQuery,
    meta: { title: '学生信息查询' }
  },
  {
    path: '/form',
    name: 'StudentFormAdd',
    component: StudentForm,
    meta: { title: '学生信息存储' }
  },
  {
    path: '/form/:studentId',
    name: 'StudentFormEdit',
    component: StudentForm,
    meta: { title: '学生信息存储' }
  }
]

const router = new VueRouter({
  routes
})

export default router
