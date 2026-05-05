/**
 * request.js — 基于 axios 封装的 HTTP 请求工具
 *
 * 【知识点】为什么要封装 axios？
 * 直接使用 axios 虽然可行，但存在以下问题：
 * 1. 每个请求都要写完整的 URL（如 http://localhost:8080/api/students）
 * 2. 错误处理逻辑要重复写在每个请求中
 * 3. 统一配置（超时、请求头）要重复设置
 *
 * 封装后的好处：
 * - 统一配置 baseURL、timeout 等公共参数
 * - 通过拦截器统一处理请求和响应
 * - 业务代码只关注 URL 路径和参数，无需关心底层细节
 *
 * 【知识点】axios 是什么？
 * axios 是一个基于 Promise 的 HTTP 客户端库，用于浏览器和 Node.js。
 * 它是目前前端最流行的 HTTP 请求库，支持：
 * - Promise API（async/await 友好）
 * - 请求/响应拦截器
 * - 自动转换 JSON 数据
 * - 取消请求
 * - 错误处理
 *
 * 本项目中 axios 在 package.json 的 dependencies 中声明：
 * "axios": "^0.27.2"
 */

// 引入 axios 库
import axios from 'axios'

// 引入 Element UI 的消息提示组件
// 【知识点】按需引入 vs 全局引入
// 虽然 main.js 中已经全局注册了 Element UI，但 Message 是一个方法（非组件），
// 通常建议通过 import 按需引入，确保代码的明确性。
// 通过 this.$message 也可以访问（全局注册后的效果），
// 但在这个独立的工具文件中，没有 Vue 实例上下文，所以需要显式 import。
import { Message } from 'element-ui'

/**
 * 创建 axios 实例
 *
 * 【知识点】为什么不直接用 axios 全局对象？
 * axios.create() 创建的是一个独立的 axios 实例，
 * 每个实例可以有自己的配置（baseURL、timeout、headers 等），
 * 不会影响其他实例或全局 axios。
 *
 * 在大型项目中可能有多个 axios 实例，例如：
 * - 实例A：baseURL 指向用户服务（/user-api）
 * - 实例B：baseURL 指向支付服务（/pay-api）
 */
const service = axios.create({
  /**
   * baseURL — 请求的基础路径前缀
   *
   * 所有请求的 URL 前面会自动拼接这个前缀。
   * 例如：请求 url: '/students'，实际发出 → '/api/students'
   *
   * 开发环境下：devServer 的 proxy 会将 /api/xxx 代理到 http://localhost:8080/api/xxx
   * 生产环境下：前端和后端部署在同一域名下，/api/xxx 直接访问后端
   */
  baseURL: '/api',

  /**
   * timeout — 请求超时时间（毫秒）
   *
   * 如果请求在 10 秒内没有得到响应，axios 会自动取消请求并报错。
   * 设为 0 表示永不超时（不推荐）。
   * 10000ms = 10秒，对于大部分 API 请求来说足够了。
   */
  timeout: 10000
})

// ============================================================
// 请求拦截器（Request Interceptor）
// ============================================================

/**
 * 【知识点】什么是拦截器？
 * 拦截器就像流水线上的「检查站」：
 * - 请求拦截器：请求发出前，对请求配置做统一处理
 * - 响应拦截器：响应到达后，对响应数据做统一处理
 *
 * 请求拦截器的典型用途：
 * 1. 在请求头中添加 Token（身份认证令牌）
 * 2. 统一添加公共参数
 * 3. 请求 loading 状态管理
 * 4. 请求取消处理
 *
 * 下面的示例展示了添加 Token 的写法（本项目暂未启用认证，仅保留结构）：
 */
service.interceptors.request.use(
  config => {
    // 【示例】如果需要携带 Token，可以在这里统一设置：
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = 'Bearer ' + token
    // }
    return config
  },
  error => {
    // 请求配置出错时（如网络不通）触发
    // 将错误继续传递下去，让调用方可以 catch 到
    return Promise.reject(error)
  }
)

// ============================================================
// 响应拦截器（Response Interceptor）
// ============================================================

/**
 * 【知识点】axios 的响应结构
 * axios 返回的完整响应（response）结构如下：
 * {
 *   data: { code: 200, data: {...}, message: "success" },  ← 后端返回的业务数据
 *   status: 200,            ← HTTP 状态码
 *   statusText: 'OK',       ← HTTP 状态描述
 *   headers: {...},         ← 响应头
 *   config: {...},          ← 请求配置
 *   request: XMLHttpRequest  ← 底层请求对象
 * }
 *
 * 本项目的后端统一返回格式为 { code: 200, data: {...}, message: "success" }，
 * 所以响应拦截器只需要关心 response.data（后端的业务数据）。
 */
service.interceptors.response.use(
  /**
   * 响应成功（HTTP 状态码 2xx）时执行
   */
  response => {
    // 取出后端返回的业务数据（跳过 axios 包装层）
    const res = response.data

    // 【知识点】前后端约定的响应格式
    // 后端统一返回 { code, data, message } 格式
    // code !== 200 表示业务逻辑失败（如参数校验不通过、数据不存在等）
    // 这种情况 HTTP 状态码仍然是 200，但业务上是失败的
    if (res.code != 200 && res.code != 0) {
      // 使用 Element UI 的 Message 组件弹出错误提示
      Message.error(res.message || '请求失败')
      // 返回 rejected Promise，让调用方可以 catch 到错误
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    // 业务成功，返回解包后的数据（调用方直接拿到 { code, data, message }）
    return res
  },
  /**
   * 响应失败（HTTP 状态码非 2xx，如 404、500）或网络错误时执行
   */
  error => {
    // 【知识点】常见的 HTTP 错误码
    // 400: Bad Request（请求参数错误）
    // 401: Unauthorized（未认证，需要登录）
    // 403: Forbidden（无权限）
    // 404: Not Found（接口不存在）
    // 500: Internal Server Error（服务器内部错误）

    Message.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

// 导出配置好的 axios 实例
// 业务代码中通过 import request from '@/utils/request' 引入使用（这是默认导出的特点——导出时的名字和导入时的名字 不需要一致，因为一个文件只能有一个 export default ，所以 JS 不需要通过名字来匹配）
export default service
