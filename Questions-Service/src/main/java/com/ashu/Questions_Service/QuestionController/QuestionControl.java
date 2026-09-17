package com.ashu.Questions_Service.QuestionController;

import com.ashu.Questions_Service.Model.QuestionModel;
import com.ashu.Questions_Service.Model.ResponseModel;
import com.ashu.Questions_Service.Model.SubmitModel;
import com.ashu.Questions_Service.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("question")
public class QuestionControl {
    @Autowired
    private QuestionService questionService;

    @PostMapping("addques")
    public ResponseEntity<HttpStatus> addQuestion(@RequestBody QuestionModel model)
    {
        return questionService.addQuestion(model);
    }

    @GetMapping("allquestion")
    public ResponseEntity<List<QuestionModel>> getAll()
    {
        return questionService.getAll();
    }

    @PostMapping("createQuiz")
    public ResponseEntity<List<Integer>> createQuiz(@RequestParam String type,@RequestParam Integer noOfQues)
    {
        return questionService.createQuiz(type, noOfQues);
    }

    @PostMapping("getques")
    public ResponseEntity<List<ResponseModel>> getQuestions(@RequestBody List<Integer> ids)
    {
        return questionService.getQuestions(ids);
    }

    @PostMapping("getResult")
    public ResponseEntity<Integer> getResult(@RequestBody List<SubmitModel> submitModels)
    {
        return  questionService.result(submitModels);
    }
}
