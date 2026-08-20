package com.gamage.studentmanagementbackend.repository;

import com.gamage.studentmanagementbackend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
}
