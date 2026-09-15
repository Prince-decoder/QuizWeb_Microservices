package com.ashu.Questions_Service.Model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "questionData")
public class QuestionModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String category;
    private String questionTitle;
    private String difficultyLevel;
    private String op1;
    private String op2;
    private String op3;
    private String op4;
    private String rightAnswer;
}
