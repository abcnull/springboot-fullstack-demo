# Spring Boot + Vue2 简单的学生管理系统 Demo

一个基于 **Spring Boot + Vue 2 + Element UI** 的功能超简单的前后端分离学生管理系统教学项目，采用 Maven 多模块结构，演示了从后端 API 开发到前端页面构建的完整全栈开发流程

虽然逻辑上是前后端分离（未用模版引擎），但其实开发时候前端和后端代码都在同一个项目中，只不过是构建时能自动将前端资源打包到后端项目 resources 中

此项目的目的是作为 demo 进行演示：前后端分离下，Spring Boot 开发的后端逻辑和 Vue2 开发的前端代码在同一个项目中时，项目是如何开发的

<center>
<img src="https://github.com/abcnull/Image-Resources/blob/master/springboot-fullstack-demo/student_management.jpg" alt="student_management.jpg" />
</center>

## 快速开始

### 环境要求

| 环境      | 版本要求         | 说明                       |
| ------- | ------------ | ------------------------ |
| JDK     | 1.8+         | 后端运行环境                   |
| Maven   | 3.6+         | 项目构建工具                   |
| Node.js | 16+          | 前端运行环境（可选，Maven 插件会自动安装） |
| npm     | 随 Node.js 自带 | 前端包管理工具，用于安装前端依赖         |

### 方式一：一键构建运行（适合部署服务器进行构建，当然本地也适合）

```bash
# 在项目路径下执行。Maven 一键构建（其中包含自动安装 Node.js、构建前端、打包后端）
# 可以在根目录执行，对应根目录的 pom.xml
mvn clean package

# 等待上一步完成后，执行如下命令来启动 SpringBoot 项目
java -jar backend/target/backend-0.0.1-SNAPSHOT.jar
```

启动后访问：`http://localhost:8080`

因为以上命令已经将前端资源全部打包到后端的 resources 中了，因此直接访问 application.yml 中配置的端口 8080 即可

###  方式二：前后端分离开发模式（本地开发时可使用）

```bash
# 终端 1：启动后端
cd backend
mvn spring-boot:run

# 终端 2：启动前端（需要本地已安装 Node.js）
cd frontend
npm install
npm run serve
```

前端开发服务器：`http://localhost:8081`（自动代理 `/api` 请求到后端 8080 端口）

因为以上命令是后端、前端分别启动，所以访问 8081 其实访问 vue.config.js 中配置端口 8081，然后 vue.config.js 中配置有 `http://localhost:8081 打到 http://localhost:8080，因此本质还是访问到了 http://localhost:8080`

## 技术栈

### 后端技术

| 技术          | 版本     | 说明             |
| ----------- | ------ | -------------- |
| Spring Boot | 2.6.13 | 后端框架，内嵌 Tomcat |
| Fastjson    | 1.2.83 | JSON 序列化       |
| Maven       | -      | 项目构建与依赖管理      |

### 前端技术

| 技术         | 版本      | 说明                 |
| ---------- | ------- | ------------------ |
| Vue        | 2.6.14  | 前端框架               |
| Element UI | 2.15.13 | UI 组件库（饿了么出品）      |
| Vue Router | 3.5.3   | 前端路由               |
| Axios      | 0.27.2  | HTTP 请求库           |
| Vue CLI    | 5.0.0   | 前端构建工具（基于 Webpack） |

### 构建工具链

| 工具                       | 说明            |
| ------------------------ | ------------- |
| Maven                    | 后端构建          |
| frontend-maven-plugin    | Maven 中集成前端构建 |
| maven-resources-plugin   | 复制前端产物到后端     |
| spring-boot-maven-plugin | 打包可执行 JAR     |

## 项目结构

```
springboot-fullstack-demo/
├── pom.xml                          # 父 POM（Maven 多模块管理）
├── backend/                         # 后端模块
│   ├── pom.xml                      # 后端依赖与插件配置
│   └── src/main/
│       ├── java/org/example/student/
│       │   ├── StudentApplication.java    # Spring Boot 启动类
│       │   ├── controller/               # 控制器层
│       │   │   └── StudentController.java
│       │   ├── service/                  # 业务逻辑层
│       │   │   └── StudentService.java
│       │   ├── model/                    # 数据模型层
│       │   │   ├── Student.java          # 学生实体
│       │   │   ├── Result.java           # 统一响应封装
│       │   │   ├── PageResult.java       # 分页结果封装
│       │   │   └── StudentQueryRequest.java # 查询请求参数
│       │   ├── exception/                # 异常处理
│       │   │   ├── BusinessException.java
│       │   │   └── GlobalExceptionHandler.java
│       │   └── util/                     # 工具类
│       │       ├── MockDataStore.java    # 模拟数据存储
│       │       └── StudentIdGenerator.java # 学号生成器
│       └── resources/
│           └── application.yml           # Spring Boot 配置
└── frontend/                        # 前端模块
    ├── package.json                 # npm 依赖配置
    ├── vue.config.js                # Vue CLI 配置
    ├── public/
    │   └── index.html               # HTML 模板
    └── src/
        ├── main.js                  # 前端入口文件
        ├── App.vue                  # 根组件
        ├── router/                  # 路由配置
        │   └── index.js
        ├── views/                   # 页面组件
        │   ├── StudentQuery.vue     # 学生查询页
        │   └── StudentForm.vue      # 学生表单页
        ├── components/              # 公共组件
        │   └── Sidebar.vue          # 侧边栏
        ├── api/                     # API 接口
        │   └── student.js
        └── utils/                   # 工具函数
            └── request.js           # axios 封装
```

## 构建与部署

### Maven 构建流程详解

执行 `mvn clean package` 时，按以下顺序执行：

```
阶段 1：generate-resources
├── frontend-maven-plugin
│   ├── 安装 Node.js v16.20.0 和 npm
│   ├── 执行 npm install（安装前端依赖）
│   └── 执行 npm run build（构建前端产物到 dist/）
└── maven-resources-plugin
    └── 复制 frontend/dist/ → backend/src/main/resources/public/

阶段 2：package
└── spring-boot-maven-plugin
    └── 打包为可执行 JAR（包含内嵌 Tomcat 和前端静态资源）
```

### 三个插件的作用

#### 1. frontend-maven-plugin

```xml
<plugin>
    <groupId>com.github.eirslett</groupId>
    <artifactId>frontend-maven-plugin</artifactId>
    <version>1.12.1</version>
</plugin>
```

作用：在 Maven 构建中集成前端构建流程

- 安装 Node.js 和 npm 到项目本地（不影响系统环境）
- 执行 `npm install` 安装前端依赖
- 执行 `npm run build` 构建前端产物

#### 2. maven-resources-plugin

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-resources-plugin</artifactId>
</plugin>
```

作用：将前端构建产物（`frontend/dist/`）复制到后端静态资源目录（`src/main/resources/public/`）

#### 3. spring-boot-maven-plugin

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
</plugin>
```

作用：打包为可执行的 fat JAR

- 包含所有依赖
- 内嵌 Tomcat 服务器
- 可直接通过 `java -jar` 运行

### 最终产物

构建完成后生成 `backend-0.0.1-SNAPSHOT.jar`，内部结构：

```
backend-0.0.1-SNAPSHOT.jar
├── BOOT-INF/
│   ├── classes/           # 编译后的 Java 类
│   │   └── public/        # 前端静态资源（HTML/CSS/JS）
│   └── lib/               # 依赖 JAR 包
├── META-INF/
└── org/springframework/boot/loader/  # Spring Boot 启动器
```

## 后端架构

### 分层架构

```
Controller（控制器层）→ Service（业务层）→ Model（数据层）
     ↓                      ↓                    ↓
  接收请求              业务逻辑处理          数据存储
  参数校验              事务管理              数据访问
  返回响应              异常处理              实体定义
```

### 核心功能

#### 学生管理 CRUD

| 接口   | 方法     | 路径                   | 说明          |
| ---- | ------ | -------------------- | ----------- |
| 查询列表 | GET    | `/api/students`      | 分页查询，支持条件筛选 |
| 查询详情 | GET    | `/api/students/{id}` | 根据学号查询      |
| 新增   | POST   | `/api/students`      | 创建学生记录      |
| 更新   | PUT    | `/api/students/{id}` | 更新学生信息      |
| 删除   | DELETE | `/api/students/{id}` | 删除学生记录      |

#### 统一响应格式

```java
{
  "code": 200,          // 状态码：200 成功，其他失败
  "message": "操作成功", // 提示信息
  "data": { ... }       // 响应数据
}
```

#### 全局异常处理

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        return Result.error(e.getCode(), e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        return Result.error(500, "服务器内部错误");
    }
}
```

### Spring Boot 核心注解

| 注解                       | 作用                |
| ------------------------ | ----------------- |
| `@SpringBootApplication` | 启动类注解，包含自动配置和组件扫描 |
| `@RestController`        | 声明 RESTful 控制器    |
| `@RequestMapping`        | 映射请求路径            |
| `@Service`               | 声明业务层组件           |
| `@Autowired`             | 依赖注入              |
| `@PathVariable`          | 路径参数绑定            |
| `@RequestBody`           | 请求体参数绑定           |
| `@RestControllerAdvice`  | 全局异常处理            |

### 模拟数据存储

项目使用 `ConcurrentHashMap` 模拟数据库，预置了 5 条测试数据：

```java
public class MockDataStore {
    private static final ConcurrentHashMap<String, Student> STORE = new ConcurrentHashMap<>();
    
    static {
        // 初始化测试数据
        STORE.put("STU20260101000001", new Student("张三", 20, "男"));
        STORE.put("STU20260101000002", new Student("李四", 21, "女"));
        // ...
    }
}
```

## 前端架构

### 核心功能模块

#### 1. 路由配置

```javascript
const routes = [
  { path: '/', redirect: '/query' },
  { path: '/query', component: StudentQuery },
  { path: '/form', component: StudentForm },
  { path: '/form/:studentId', component: StudentForm }
]
```

#### 2. API 封装

```javascript
// utils/request.js - axios 封装
import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 响应拦截器
service.interceptors.response.use(
  response => response.data,
  error => {
    Message.error(error.message)  // Element UI 的消息提示
    return Promise.reject(error)
  }
)
```

#### 3. 学生查询页面

- 分页表格展示
- 条件筛选（学号、姓名、年龄、性别）
- 编辑/删除操作
- 加载状态管理

#### 4. 学生表单页面

- 新增/编辑模式复用
- 表单验证
- 动态路由参数（`:studentId`）

### Vue 核心概念示例

#### 响应式数据（Vue 2 Options API）

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <input v-model="form.name" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // data 中的数据自动具有响应式
      // 数据变化时，视图自动更新
      count: 0,
      form: {
        name: '',
        age: null
      }
    }
  }
}
</script>
```

#### 组件通信（Props + $emit）

```vue
<!-- 父组件 -->
<template>
  <!-- 通过 props 向子组件传递数据，通过事件接收子组件消息 -->
  <ChildComponent :data="list" @update="handleUpdate" />
</template>

<!-- 子组件 -->
<script>
export default {
  props: ['data'],          // 声明接收的 props
  methods: {
    notifyParent() {
      this.$emit('update', newValue)  // 向父组件发送事件
    }
  }
}
</script>
```

#### 生命周期钩子

```javascript
export default {
  created() {
    // 组件实例创建完成后调用（data 和 methods 已初始化，DOM 尚未挂载）
    // 适合：发起初始数据请求
    this.fetchData()
  },
  mounted() {
    // DOM 挂载完成后调用
    // 适合：操作 DOM 元素、初始化第三方库
  },
  beforeDestroy() {
    // 实例销毁前调用
    // 适合：清理定时器、取消事件监听
  }
}
```

## API 文档

### 学生管理接口

#### 查询学生列表

```http
GET /api/students?pageNum=1&pageSize=10&name=张
```

响应：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "list": [
      {
        "studentId": "STU20260101000001",
        "name": "张三",
        "age": 20,
        "gender": "男",
        "description": "计算机科学专业学生",
        "createTime": "2026-01-01 00:00:00",
        "updateTime": "2026-01-01 00:00:00"
      }
    ],
    "total": 1,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

#### 新增学生

```http
POST /api/students
Content-Type: application/json

{
  "name": "新同学",
  "age": 20,
  "gender": "男",
  "description": "测试学生"
}
```

#### 更新学生

```http
PUT /api/students/STU20260101000001
Content-Type: application/json

{
  "name": "张三（已更新）",
  "age": 21,
  "gender": "男",
  "description": "已更新描述"
}
```

#### 删除学生

```http
DELETE /api/students/STU20260101000001
```

## 常见问题

### Q: 为什么选择前端内嵌到后端的方式？

A: 这种方式适合教学演示和小型项目：

- 部署简单，只需一个 JAR 文件
- 无需配置 Nginx 反向代理
- 前后端同源，避免跨域问题

### Q: 如何切换为前后端分离部署？

A:

1. 前端构建：`cd frontend && npm run build`
2. 将 `dist/` 目录部署到 Nginx
3. 配置 Nginx 反向代理 `/api` 到后端服务

### Q: 如何接入真实数据库？

A:

1. 添加数据库依赖（MySQL、MyBatis 等）
2. 创建实体类和 Mapper
3. 修改 Service 层，替换 MockDataStore
4. 配置数据源（application.yml）

### Q: Node.js 安装失败怎么办？

A:

- 检查网络连接
- 使用国内镜像：在 `frontend/` 目录下创建 `.npmrc` 文件
  ```
  registry=https://registry.npmmirror.com
  ```

## 总结

本项目通过一个学生管理系统的完整实现，串联了全栈开发的核心知识链路：

### 整体知识脉络

```
当项目构建部署后，
用户浏览器访问 localhost:8080
        │
        ▼
┌─── Spring Boot 内嵌 Tomcat ────────────────────────────┐
│   Tomcat 监听 8080 端口，托管静态资源和 REST API          │
│                                                       │
│   resources/public/index.html  ← 前端构建产物           │
│        │                                              │
│        ▼ （浏览器加载 JS，Vue 应用启动）                  │
│   Vue Router 匹配路由 → 渲染对应页面组件                  │
│        │                                              │
│        ▼ （页面发起 HTTP 请求）                          │
│   axios 封装 → 发送 /api/xxx 请求                       │
│        │                                              │
│        ▼ （请求到达后端）                                │
│   Controller 接收请求 → Service 处理业务 → 返回 Result    │
└────────────────────────────────────────────────────────┘
```

### 关键知识点回顾

| 层面              | 核心知识点                                                            |
| --------------- | ---------------------------------------------------------------- |
| **项目构建**        | Maven 多模块、父 POM 管理、三个插件协作、fat JAR 结构、内嵌 Tomcat                   |
| **后端分层**        | Controller → Service → Model 三层架构、@Autowired 依赖注入                |
| **RESTful API** | GET/POST/PUT/DELETE 语义、@PathVariable 路径参数、@RequestBody 请求体       |
| **统一规范**        | Result 统一响应、@RestControllerAdvice 全局异常处理、BusinessException 自定义异常 |
| **前端工程化**       | npm 依赖管理、vue.config.js 构建配置、Webpack 打包原理                         |
| **Vue 核心**      | Options API、data/methods/computed/created、组件注册与通信                |
| **Vue Router**  | 路由表配置、动态路由参数（:id）、router-view 路由出口、编程式导航                         |
| **Element UI**  | el-table 表格、el-form 表单校验、el-pagination 分页、el-menu 导航             |
| **axios**       | 请求封装、请求/响应拦截器、async/await 异步编程                                   |
| **前后端协作**       | proxy 代理跨域、JSON 数据交互、统一请求/响应格式                                   |

### 架构设计思想

- **关注点分离**：后端只负责数据和逻辑，前端只负责展示和交互
- **统一规范**：响应格式统一（Result）、异常处理统一（GlobalExceptionHandler）、API 封装统一（request.js）
- **分层解耦**：Controller 不直接操作数据，Service 不关心 HTTP 协议，各层职责单一
- **构建自动化**：Maven 插件链自动完成 Node.js 安装 → 前端构建 → 资源复制 → JAR 打包，一条命令完成全流程

