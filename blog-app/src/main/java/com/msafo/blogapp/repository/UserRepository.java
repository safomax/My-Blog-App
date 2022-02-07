package com.msafo.blogapp.repository;

import com.msafo.blogapp.models.authentication.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String username);

    User findByUsername(String username);

    @Query(value="SELECT user.id, user.first_name, user.last_name, user.username, user_roles.role_id from user INNER JOIN post on user.id = post.user_id INNER JOIN user_roles on post.user_id = user_roles.user_id where post.id = ?1", nativeQuery = true)
    Object getUserByPost(Long pid);

    @Query(value="SELECT article.title, post.post, post.created, user.first_name, user.last_name from article INNER JOIN post on article.id = post.article_id  INNER JOIN" +
           " user on post.user_id = user.id where user.id = ?1 order by post.created desc", nativeQuery=true)
    List<Object> getPostsWithArticle(Long uid);
}
