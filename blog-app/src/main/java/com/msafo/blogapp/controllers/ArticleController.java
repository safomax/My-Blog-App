package com.msafo.blogapp.controllers;

import com.msafo.blogapp.models.article.Article;
import com.msafo.blogapp.models.authentication.User;
import com.msafo.blogapp.repository.ArticleRepository;
import com.msafo.blogapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class ArticleController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @PostMapping("/article")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    public Article createArticle(@RequestBody Article article) throws Exception {

        User user = getUser();

        article.setUser(user);

        Date date = new java.sql.Date(System.currentTimeMillis());

        article.setCreated(date);

        return articleRepository.save(article);
    }

    @GetMapping("/article/{id}/creator")
    public ResponseEntity<String> getArticleCreator(@PathVariable("id") Long id) {

        String name = articleRepository.findUserByArticleId(id);

        return ResponseEntity.ok(name);
    }

    @GetMapping("/article/{aid}")
    public Article getArticleById(@PathVariable("aid") Long aid) throws Exception {

        return articleRepository.findById(aid).orElseThrow(()-> new Exception("Article not found."));
    }

    @GetMapping("/articles")
    public ResponseEntity<List<Article>> getArticles() {

        List<Article> articles = articleRepository.findAll();

        return ResponseEntity.ok(articles);
    }

    @GetMapping("/articles/most-commented")
    public ResponseEntity<List<Object>> getMostCommentedArticles() {

        List<Object> articles = articleRepository.findMostCommentedArticlesDesc();

        return ResponseEntity.ok(articles);
    }

    @GetMapping("/articles/newest")
    public ResponseEntity<List<Object>> getNewestArticles() {

        List<Object> articles = articleRepository.findNewestArticlesDesc();

        return ResponseEntity.ok(articles);
    }

    @GetMapping("/user/articles/{uid}")
    public ResponseEntity<List<Object>> getAllArticlesFromUser(@PathVariable("uid") Long uid) throws Exception {

        User user = userRepository.findById(uid).orElseThrow(()-> new Exception("User not found exception"));

        // sort by date desc
        List<Object> articles = articleRepository.getAllArticlesFromUser(uid);

        return ResponseEntity.ok(articles);
    }

    @PutMapping("/article/{aid}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<Article> updateArticle(@RequestBody Article updatedArticle, @PathVariable("aid") Long aid) throws Exception {

        User user = getUser();

        Article currentArticle = articleRepository.findById(aid).orElseThrow(()-> new Exception("Article not found."));

        if (!user.getId().equals(currentArticle.getUser().getId())){
            return ResponseEntity.badRequest().body(currentArticle);
        }

        currentArticle.setText(updatedArticle.getText());

        currentArticle.setTitle(updatedArticle.getTitle());

        articleRepository.save(currentArticle);

        Article _updatedArticle = articleRepository.save(currentArticle);


        return ResponseEntity.ok(_updatedArticle);
    }

    @DeleteMapping("/article/{aid}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<?> deleteArticle(@PathVariable("aid") Long aid) throws Exception {

        User user = getUser();

        Article article = articleRepository.findById(aid).orElseThrow(()-> new Exception("Article not found."));

        if (!user.getId().equals(article.getUser().getId())){
            return ResponseEntity.badRequest().body("Can not delete someone else's article.");
        }

        articleRepository.deleteById(aid);

        return ResponseEntity.ok("Article successfully deleted.");
    }

    public User getUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        System.out.println(email);

        return userRepository.findByUsername(email);
    }

}
