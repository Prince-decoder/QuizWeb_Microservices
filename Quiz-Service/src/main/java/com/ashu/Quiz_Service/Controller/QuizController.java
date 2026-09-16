package com.ashu.Quiz_Service.Controller;

import com.ashu.Quiz_Service.Model.DtoModel;
import com.ashu.Quiz_Service.Model.ResponseModel;
import com.ashu.Quiz_Service.Model.SubmitModel;
import com.ashu.Quiz_Service.Service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("quiz")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("create")
    public ResponseEntity<String> createQuiz(@RequestBody DtoModel model)
    {
        return quizService.create(model);
    }

    @GetMapping("questions")
    public ResponseEntity<List<ResponseModel>> getQuestions(@RequestParam Integer id)
    {
        return quizService.getQuestions(id);
    }

    @GetMapping("result")
    public ResponseEntity<Integer> getResult(@RequestBody List<SubmitModel> model)
    {
        return quizService.getResult(model);
    }
}
