package com.gamage.studentmanagementbackend.controller;

import com.gamage.studentmanagementbackend.entity.Course;
import com.gamage.studentmanagementbackend.entity.LectureMaterial;
import com.gamage.studentmanagementbackend.repository.CourseRepository;
import com.gamage.studentmanagementbackend.repository.LectureMaterialRepository;
import com.gamage.studentmanagementbackend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/materials")
public class LectureMaterialController {

    @Autowired
    private LectureMaterialRepository materialRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // List materials for a specific course - anyone logged in can view
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<LectureMaterial>> getMaterialsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(materialRepository.findByCourseId(courseId));
    }

    // Upload a new material - ADMIN or TEACHER only (enforced in SecurityConfig)
    @PostMapping
    public ResponseEntity<?> uploadMaterial(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("courseId") Long courseId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Course not found");
        }

        String filePath = fileStorageService.storeFile(file);

        LectureMaterial material = new LectureMaterial();
        material.setTitle(title);
        material.setDescription(description);
        material.setFileName(file.getOriginalFilename());
        material.setFilePath(filePath);
        material.setCourse(courseOpt.get());
        material.setUploadedBy(authentication.getName());

        LectureMaterial saved = materialRepository.save(material);
        return ResponseEntity.ok(saved);
    }

    // Delete a material - ADMIN or TEACHER only (enforced in SecurityConfig)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        if (!materialRepository.existsById(id)) {
            return ResponseEntity.status(404).body("Material not found");
        }
        materialRepository.deleteById(id);
        return ResponseEntity.ok("Material deleted successfully");
    }
}
