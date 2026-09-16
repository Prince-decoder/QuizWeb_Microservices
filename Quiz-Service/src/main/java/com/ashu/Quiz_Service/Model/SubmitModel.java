package com.ashu.Quiz_Service.Model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmitModel {
    @Id
    private Integer id;
    private String ansSub;
}
