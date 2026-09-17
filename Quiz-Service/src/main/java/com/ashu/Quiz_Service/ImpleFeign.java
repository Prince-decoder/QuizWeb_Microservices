package com.ashu.Quiz_Service;


import com.ashu.Quiz_Service.Model.ResponseModel;
import com.ashu.Quiz_Service.Model.SubmitModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient("QUESTIONS-SERVICE")
public interface ImpleFeign {

    @PostMapping("question/createQuiz")
    public ResponseEntity<List<Integer>> createQuiz(@RequestParam String type, @RequestParam Integer noOfQues);

    @PostMapping("question/getques")
    public ResponseEntity<List<ResponseModel>> getQuestions(@RequestBody List<Integer> ids);

    @PostMapping("question/getResult")
    public ResponseEntity<Integer> result(@RequestBody List<SubmitModel> que);

}
