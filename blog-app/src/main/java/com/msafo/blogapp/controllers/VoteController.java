package com.msafo.blogapp.controllers;


import com.msafo.blogapp.models.authentication.User;
import com.msafo.blogapp.models.posts.Post;
import com.msafo.blogapp.models.posts.Vote;
import com.msafo.blogapp.repository.PostRepository;
import com.msafo.blogapp.repository.UserRepository;
import com.msafo.blogapp.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class VoteController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private VoteRepository voteRepository;

    @GetMapping("/upvote/{pid}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_MODERATOR') or hasRole('ROLE_USER')")
    public ResponseEntity<?> upVote(@PathVariable("pid") Long pid) throws Exception {

        User user = getUser();

        System.out.println(user.getUsername());

        Post post = postRepository.findById(pid).orElseThrow(() -> new Exception("Post not found."));

        List<Vote> votes = post.getVotes();

        if (post.getVotes() != null) {
            for (Vote vote : votes) {
                if (vote.getUser().equals(user)) {
                    return ResponseEntity.badRequest().body("Can not upvote a post twice.");
                }
            }
        }

        Vote newVote = new Vote();

        newVote.setPost(post);

        newVote.setUser(user);

        voteRepository.save(newVote);

        return ResponseEntity.ok("Upvoted");
    }


    public User getUser() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        String email = auth.getName();

        return userRepository.findByUsername(email);
    }

}
