package com.gamage.studentmanagementbackend.repository;

import com.gamage.studentmanagementbackend.entity.LectureMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureMaterialRepository extends JpaRepository<LectureMaterial, Long> {
    List<LectureMaterial> findByCourseId(Long courseId);
}
