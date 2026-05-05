/**
 * vue.config.js — Vue CLI 项目的配置文件
 *
 * 【知识点】什么是 Vue CLI？
 * Vue CLI 是 Vue.js 官方提供的脚手架工具，用于快速搭建 Vue 项目。
 * 它在底层封装了 Webpack（模块打包工具），让我们无需手动配置复杂的 Webpack，
 * 只需通过 vue.config.js 这个文件就能定制项目行为。
 *
 * 【知识点】该文件的作用
 * - 配置开发服务器（端口、代理等）
 * - 配置打包输出目录和资源路径
 * - 自定义 Webpack 配置（链式操作或直接覆盖）
 * - 配置 CSS 预处理器、别名等
 *
 * 【知识点】文件导出方式
 * 这里使用 CommonJS 的 module.exports（Node.js 的模块规范），
 * 而不是 ES Module 的 export default，因为 Vue CLI 在 Node.js 环境中读取此文件。
 */
module.exports = {

  /**
   * outputDir — 打包输出目录
   *
   * 【知识点】执行 npm run build 后，Webpack 会将所有源代码编译打包，
   * 产出的静态资源文件（HTML/CSS/JS/图片等）会输出到这个目录。
   * 默认值是 'dist'，所以打包产物通常在 frontend/dist/ 中。
   */
  outputDir: 'dist',

  /**
   * assetsDir — 静态资源子目录
   *
   * 【知识点】打包后的 JS、CSS、字体等静态资源会放在 outputDir 下的这个子目录中。
   * 设置为 'static' 后，产出结构为：
   *   dist/
   *   ├── index.html
   *   └── static/
   *       ├── css/
   *       ├── js/
   *       └── fonts/
   *
   * 这样做可以让项目根目录保持整洁，所有资源统一归类。
   */
  assetsDir: 'static',

  /**
   * devServer — 开发服务器配置
   *
   * 【知识点】什么是 devServer？
   * devServer 是 Webpack 内置的本地开发服务器（基于 Express）。
   * 执行 npm run serve 时，它会启动一个带热更新（HMR）的本地 HTTP 服务器，
   * 当你修改代码时，浏览器会自动刷新，无需手动重新构建。
   *
   * 【知识点】生产环境 vs 开发环境
   * - 开发环境：用 devServer 托管前端，改代码实时刷新
   * - 生产环境：用 npm run build 打包成静态文件，部署到 Nginx/Spring Boot 等
   */
  devServer: {

    /**
     * port — 开发服务器端口号
     *
     * 默认是 8080，这里改为 8081 以避免与后端 Spring Boot 的 8080 端口冲突。
     * 启动后访问 http://localhost:8081 即可看到前端页面。
     */
    port: 8081,

    /**
     * proxy — 代理配置（解决跨域问题）
     *
     * 【知识点】什么是跨域？
     * 浏览器的同源策略限制：前端 http://localhost:8081 直接请求后端 http://localhost:8080，
     * 因为端口不同（8081 ≠ 8080），浏览器会拦截并报 CORS 跨域错误。
     *
     * 【知识点】proxy 如何解决跨域？
     * devServer 的 proxy 会在本地启动一个代理服务器：
     * 1. 浏览器发出请求到 http://localhost:8081/api/students（同源，不跨域）
     * 2. devServer 代理拦截以 '/api' 开头的请求
     * 3. 代理转发到 http://localhost:8080/api/students（服务器间通信不受浏览器限制）
     * 4. 后端返回数据，代理再回传给浏览器
     *
     * 这样浏览器始终只和 localhost:8081 通信，不存在跨域问题。
     */
    proxy: {
      '/api': {
        /**
         * target — 代理目标地址，即后端服务的实际地址
         *
         * 所有以 '/api' 开头的请求都会被转发到这个地址。
         * 例如：/api/students → http://localhost:8080/api/students
         */
        target: 'http://localhost:8080',

        /**
         * changeOrigin — 修改请求头中的 Host 字段
         *
         * 设为 true 时，代理会将请求头中的 Host 改为目标地址的 Host。
         * 例如：请求头 Host 从 localhost:8081 改为 localhost:8080。
         *
         * 【知识点】为什么要改？
         * 某些后端服务器会校验请求头中的 Host 字段。
         * 如果 Host 不匹配，后端可能拒绝请求（如 Nginx 虚拟主机、Spring Security 等）。
         * 设为 true 可以让请求看起来像是直接发往后端的，避免这类问题。
         */
        changeOrigin: true
      }
    }
  }
}
