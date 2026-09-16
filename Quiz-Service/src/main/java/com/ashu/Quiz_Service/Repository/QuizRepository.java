package com.ashu.Quiz_Service.Repository;

import com.ashu.Quiz_Service.Model.QuizModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<QuizModel,Integer> {
}
