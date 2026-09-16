package com.ashu.Quiz_Service.Model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseModel
{
    @Id
    private int id;
    private String category;
    private String questionTitle;
    private String difficultyLevel;
    private String op1;
    private String op2;
    private String op3;
    private String op4;
}
