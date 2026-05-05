package org.example.student.util;

import org.example.student.model.Student;

import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

// 模拟数据库中的数据
public class MockDataStore {

    private static final ConcurrentHashMap<String, Student> STORE = new ConcurrentHashMap<>();

    static {
        initMockData();
    }

    /**
     * 初始化 5 条测试数据
     */
    private static void initMockData() {
        Date now = new Date();
        String[] ids = {
            "STU20260101000001", "STU20260101000002", "STU20260101000003",
            "STU20260101000004", "STU20260101000005"
        };
        String[][] data = {
            {"张三", "20", "男", "计算机科学专业学生"},
            {"李四", "21", "女", "数学专业学生"},
            {"王五", "19", "男", "物理专业学生"},
            {"赵六", "22", "女", "化学专业学生"},
            {"钱七", "20", "男", "生物专业学生"}
        };
        for (int i = 0; i < ids.length; i++) {
            Student student = new Student();
            student.setStudentId(ids[i]);
            student.setName(data[i][0]);
            student.setAge(Integer.parseInt(data[i][1]));
            student.setGender(data[i][2]);
            student.setDescription(data[i][3]);
            student.setCreateTime(now);
            student.setUpdateTime(now);
            STORE.put(ids[i], student);
        }
    }

    /**
     * 获取存储实例
     */
    public static ConcurrentHashMap<String, Student> getStore() {
        return STORE;
    }
}
