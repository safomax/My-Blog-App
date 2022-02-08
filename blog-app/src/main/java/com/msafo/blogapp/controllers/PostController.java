package com.msafo.blogapp.controllers;

import com.msafo.blogapp.models.article.Article;
import com.msafo.blogapp.models.authentication.User;
import com.msafo.blogapp.models.posts.Post;
import com.msafo.blogapp.repository.ArticleRepository;
import com.msafo.blogapp.repository.PostRepository;
import com.msafo.blogapp.repository.UserRepository;
import com.msafo.blogapp.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class PostController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private VoteRepository voteRepository;

    @PostMapping("/post/article/{aid}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_USER')")
    public Article createPost(@RequestBody Post post, @PathVariable("aid") Long aid) throws Exception {

        User user = getUser();

        Article article = articleRepository.findById(aid).orElseThrow(()-> new Exception("Article not found."));

        post.setArticle(article);

        post.setUser(user);

        Date date = new java.sql.Date(System.currentTimeMillis());

        post.setCreated(date);

        postRepository.save(post);

        return articleRepository.save(article);
    }

    @DeleteMapping("/post/{pid}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<?> deletePost(@PathVariable("pid") Long pid) throws Exception {

        User user = getUser();

        Post post = postRepository.findById(pid).orElseThrow(()-> new Exception ("Post not found."));

        if (!user.getId().equals(post.getUser().getId())){
            return ResponseEntity.badRequest().body("Can not delete someone else's posts.");
        }

        postRepository.deleteById(pid);

        return ResponseEntity.ok("Post successfully deleted.");
    }

    @DeleteMapping("/post/{pid}/any")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<?> deleteAnyPost(@PathVariable("pid") Long pid) throws Exception {

        postRepository.deleteById(pid);

        return ResponseEntity.ok("Post successfully deleted.");
    }

    @PutMapping("/post/update/{pid}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Post> updatePost(@RequestBody Post updatedPost, @PathVariable("pid") Long pid) throws Exception {

        Post currentPost = postRepository.findById(pid).orElseThrow(()-> new Exception("Post not found."));

        currentPost.setPost(updatedPost.getPost());

        Post post = postRepository.save(currentPost);

        return ResponseEntity.ok(post);
    }

    @PutMapping("/post/{pid}/any")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR')")
    public ResponseEntity<Post> updateAnyPost(@RequestBody Post updatedPost, @PathVariable("pid") Long pid) throws Exception {


        System.out.println(updatedPost.getPost());
        Post currentPost = postRepository.findById(pid).orElseThrow(()-> new Exception("Post not found."));

        currentPost.setPost(updatedPost.getPost());

        Post post = postRepository.save(currentPost);

        return ResponseEntity.ok(post);
    }

    @GetMapping("/posts/article/{aid}")
    public ResponseEntity<List<Object>> getArticlePosts(@PathVariable("aid") Long aid) throws Exception {

        List<Object> posts = articleRepository.findPostsByArticleId(aid);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/posts/article/{aid}/count")
    public ResponseEntity<List<Object>> getArticlePostsByCount(@PathVariable("aid") Long aid) throws Exception {

        List<Object> posts = articleRepository.findPostsByArticleIdCountSize(aid);

        return ResponseEntity.ok(posts);
    }

    @GetMapping("/post/{pid}")
    public Post getPostById(@PathVariable("pid") Long pid) throws Exception {

        return postRepository.findById(pid).orElseThrow(()-> new Exception("Post not found"));
    }

    @GetMapping("/user/post/{pid}")
    public Object getUserByPostId(@PathVariable("pid") Long pid) throws Exception {

        User user = getUser();

        System.out.println(user.getId());

        return userRepository.getUserByPost(pid);
    }

    @GetMapping("/user/posts-with-articles/{uid}")
    public ResponseEntity<List<Object>> getPostsWithArticle(@PathVariable("uid") Long uid) {

        User user = getUser();

        System.out.println(user.getId());

        List<Object> getPostsWithArticle = userRepository.getPostsWithArticle(uid);

        return ResponseEntity.ok(getPostsWithArticle);
    }

    @PostMapping("/reply-to-post/{pid}")
    public ResponseEntity<List<Object>> replyToPost(@PathVariable("pid") Long pid) {

        List<Object> getPostsWithArticle = userRepository.getPostsWithArticle(pid);

        return ResponseEntity.ok(getPostsWithArticle);
    }

    public User getUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        return userRepository.findByUsername(email);
    }

}
