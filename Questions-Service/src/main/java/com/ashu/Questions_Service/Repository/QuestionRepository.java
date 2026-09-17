package com.ashu.Questions_Service.Repository;

import com.ashu.Questions_Service.Model.QuestionModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionModel,Integer> {
    @Query(value = "SELECT q.id FROM question_data q WHERE q.category=:category ORDER BY RANDOM() LIMIT :noOfQue",nativeQuery = true)
    List<Integer> findByCategory(String category, int noOfQue);
}
