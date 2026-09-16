package com.ashu.Quiz_Service.Service;

import com.ashu.Quiz_Service.ImpleFeign;
import com.ashu.Quiz_Service.Model.DtoModel;
import com.ashu.Quiz_Service.Model.QuizModel;
import com.ashu.Quiz_Service.Model.ResponseModel;
import com.ashu.Quiz_Service.Model.SubmitModel;
import com.ashu.Quiz_Service.Repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepo;
    @Autowired
    private ImpleFeign questionInter;


    public ResponseEntity<String> create(DtoModel model) {
        List<Integer> ids= questionInter.createQuiz(model.getCategory(),model.getNoOfQuestion()).getBody();
        QuizModel mode= new QuizModel();
        mode.setIds(ids);
        mode.setTitle(model.getTitle());
        quizRepo.save(mode);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    public ResponseEntity<List<ResponseModel>> getQuestions(Integer id)
    {
        QuizModel mode= quizRepo.findById(id).get();
        return new ResponseEntity<>(questionInter.getQuestions(mode.getIds()).getBody(),HttpStatus.OK);
    }

    public ResponseEntity<Integer> getResult(List<SubmitModel> submitModels)
    {
        return new ResponseEntity<>(questionInter.result(submitModels).getBody(),HttpStatus.OK);
    }
}
