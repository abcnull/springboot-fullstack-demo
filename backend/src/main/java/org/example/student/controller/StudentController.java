package org.example.student.controller;

import org.example.student.model.PageResult;
import org.example.student.model.Result;
import org.example.student.model.Student;
import org.example.student.model.StudentQueryRequest;
import org.example.student.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    /**
     * 分页查询学生列表
     */
    @GetMapping
    public Result<PageResult<Student>> queryStudents(StudentQueryRequest request) {
        PageResult<Student> pageResult = studentService.queryStudents(request);
        return Result.success(pageResult);
    }

    /**
     * 根据学号查询学生详情
     */
    @GetMapping("/{studentId}")
    public Result<Student> getStudent(@PathVariable String studentId) {
        Student student = studentService.getStudent(studentId);
        return Result.success(student);
    }

    /**
     * 新增学生
     */
    @PostMapping
    public Result<String> addStudent(@RequestBody Student student) {
        String studentId = studentService.addStudent(student);
        return Result.success(studentId);
    }

    /**
     * 更新学生信息
     */
    @PutMapping("/{studentId}")
    public Result<Void> updateStudent(@PathVariable String studentId, @RequestBody Student student) {
        studentService.updateStudent(studentId, student);
        return Result.success();
    }

    /**
     * 删除学生
     */
    @DeleteMapping("/{studentId}")
    public Result<Void> deleteStudent(@PathVariable String studentId) {
        studentService.deleteStudent(studentId);
        return Result.success();
    }
}
