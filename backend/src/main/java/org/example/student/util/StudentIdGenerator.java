package org.example.student.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class StudentIdGenerator {

    private static final String PREFIX = "STU";
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyyMMddHHmmss");

    /**
     * 生成学号，格式：STU + 时间戳（如 STU20260505143052）
     * 使用同步锁保证唯一性
     */
    public static synchronized String generate() {
        return PREFIX + DATE_FORMAT.format(new Date());
    }
}
