package com.ashu.Quiz_Service.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DtoModel {

    private String title;
    private int noOfQuestion;
    private String category;
}
