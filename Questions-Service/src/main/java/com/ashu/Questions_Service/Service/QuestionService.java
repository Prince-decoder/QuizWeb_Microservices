package com.ashu.Questions_Service.Service;

import com.ashu.Questions_Service.Model.QuestionModel;
import com.ashu.Questions_Service.Model.ResponseModel;
import com.ashu.Questions_Service.Model.SubmitModel;
import com.ashu.Questions_Service.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository repo;

    public ResponseEntity<List<QuestionModel>> getAll()
    {
        return new ResponseEntity<>(repo.findAll(), HttpStatus.OK);
    }

    public ResponseEntity<HttpStatus> addQuestion(QuestionModel model)
    {
        repo.save(model);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    public ResponseEntity<List<Integer>> createQuiz(String category,int noOfQue)
    {
        List<Integer> x= repo.findByCategory(category,noOfQue);
        return new ResponseEntity<>(x,HttpStatus.OK);
    }

    public ResponseEntity<List<ResponseModel>> getQuestions(List<Integer> ids)
    {
        List<ResponseModel> responseModel=new ArrayList<>();
        QuestionModel temp;
        for(int a:ids)
        {
            temp= repo.findById(a).get();
            ResponseModel responseModel1=new ResponseModel();
            responseModel1.setId(temp.getId());
            responseModel1.setQuestionTitle(temp.getQuestionTitle());
            responseModel1.setCategory(temp.getCategory());
            responseModel1.setDifficultyLevel(temp.getDifficultyLevel());
            responseModel1.setOp1(temp.getOp1());
            responseModel1.setOp2(temp.getOp2());
            responseModel1.setOp3(temp.getOp3());
            responseModel1.setOp4(temp.getOp4());
            responseModel.add(responseModel1);
        }
        return new ResponseEntity<>(responseModel,HttpStatus.OK);
    }

    public ResponseEntity<Integer> result(List<SubmitModel> que)
    {
        int result=0;
        for(SubmitModel s:que)
        {
            if(Objects.equals(s.getAnsSub(), repo.findById(s.getId()).get().getRightAnswer()))
            {
                result++;
            }
        }
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
