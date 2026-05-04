package org.example.student.service;

import org.example.student.exception.BusinessException;
import org.example.student.model.PageResult;
import org.example.student.model.Student;
import org.example.student.model.StudentQueryRequest;
import org.example.student.util.MockDataStore;
import org.example.student.util.StudentIdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentService.class);

    /**
     * 分页查询学生列表
     * 支持多条件过滤：学号精确匹配、姓名包含匹配、年龄精确匹配、性别精确匹配
     * 结果按更新时间倒序排列
     */
    public PageResult<Student> queryStudents(StudentQueryRequest request) {
        List<Student> allStudents = new ArrayList<>(MockDataStore.getStore().values());

        // 根据条件过滤
        List<Student> filtered = allStudents.stream()
                .filter(s -> filterByStudentId(s, request.getStudentId()))
                .filter(s -> filterByName(s, request.getName()))
                .filter(s -> filterByAge(s, request.getAge()))
                .filter(s -> filterByGender(s, request.getGender()))
                .sorted(Comparator.comparing(Student::getUpdateTime).reversed())
                .collect(Collectors.toList());

        // 分页计算
        int pageNum = request.getPageNum() == null || request.getPageNum() < 1 ? 1 : request.getPageNum();
        int pageSize = request.getPageSize() == null || request.getPageSize() < 1 ? 10 : request.getPageSize();
        long total = filtered.size();
        int fromIndex = (pageNum - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, filtered.size());

        List<Student> pageList = fromIndex < filtered.size()
                ? filtered.subList(fromIndex, toIndex)
                : new ArrayList<>();

        logger.info("查询学生列表: 条件={}, 总数={}, 当前页={}", request, total, pageNum);
        return new PageResult<>(pageList, total, pageNum, pageSize);
    }

    /**
     * 根据学号查询学生
     */
    public Student getStudent(String studentId) {
        Student student = MockDataStore.getStore().get(studentId);
        if (student == null) {
            throw new BusinessException(404, "学生不存在: " + studentId);
        }
        return student;
    }

    /**
     * 新增学生
     * 自动生成学号，设置创建时间和更新时间
     */
    public String addStudent(Student student) {
        validateStudent(student);
        String studentId = StudentIdGenerator.generate();
        student.setStudentId(studentId);
        Date now = new Date();
        student.setCreateTime(now);
        student.setUpdateTime(now);
        MockDataStore.getStore().put(studentId, student);
        logger.info("新增学生: studentId={}, name={}", studentId, student.getName());
        return studentId;
    }

    /**
     * 更新学生信息
     * 更新姓名、年龄、性别、描述，更新时间自动刷新
     */
    public void updateStudent(String studentId, Student student) {
        Student existing = MockDataStore.getStore().get(studentId);
        if (existing == null) {
            throw new BusinessException(404, "学生不存在: " + studentId);
        }
        validateStudent(student);
        existing.setName(student.getName());
        existing.setAge(student.getAge());
        existing.setGender(student.getGender());
        existing.setDescription(student.getDescription());
        existing.setUpdateTime(new Date());
        MockDataStore.getStore().put(studentId, existing);
        logger.info("更新学生: studentId={}", studentId);
    }

    /**
     * 删除学生
     */
    public void deleteStudent(String studentId) {
        Student removed = MockDataStore.getStore().remove(studentId);
        if (removed == null) {
            throw new BusinessException(404, "学生不存在: " + studentId);
        }
        logger.info("删除学生: studentId={}", studentId);
    }

    /**
     * 校验学生信息
     */
    private void validateStudent(Student student) {
        if (!StringUtils.hasText(student.getName())) {
            throw new BusinessException(400, "学生姓名不能为空");
        }
        if (student.getName().length() > 50) {
            throw new BusinessException(400, "学生姓名不能超过50个字符");
        }
        if (student.getAge() == null || student.getAge() < 0) {
            throw new BusinessException(400, "学生年龄不能为空且不能小于0");
        }
        if (student.getAge() > 150) {
            throw new BusinessException(400, "学生年龄不能超过150");
        }
        if (!StringUtils.hasText(student.getGender())) {
            throw new BusinessException(400, "学生性别不能为空");
        }
        if (!"男".equals(student.getGender()) && !"女".equals(student.getGender())) {
            throw new BusinessException(400, "学生性别只能为'男'或'女'");
        }
        if (student.getDescription() != null && student.getDescription().length() > 200) {
            throw new BusinessException(400, "描述不能超过200个字符");
        }
    }

    private boolean filterByStudentId(Student s, String studentId) {
        return !StringUtils.hasText(studentId) || studentId.equals(s.getStudentId());
    }

    private boolean filterByName(Student s, String name) {
        return !StringUtils.hasText(name) || s.getName().contains(name);
    }

    private boolean filterByAge(Student s, Integer age) {
        return age == null || age.equals(s.getAge());
    }

    private boolean filterByGender(Student s, String gender) {
        return !StringUtils.hasText(gender) || gender.equals(s.getGender());
    }
}
