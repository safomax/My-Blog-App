package com.msafo.blogapp.repository;

import com.msafo.blogapp.models.article.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query(value = "SELECT CONCAT(user.first_name,' ', user.last_name) from user INNER JOIN article ON user.id = article.user_id WHERE " +
            "article.id = ?1 ", nativeQuery = true)
    String findUserByArticleId(Long id);

    @Query(value = "SELECT CONCAT(user.first_name, ' ', user.last_name), post.id, post.post, post.created, user.id AS 'users_id', COUNT(vote.id) AS votes, user_roles.role_id as role, post.parent_id from post INNER JOIN user ON user.id = post.user_id INNER JOIN user_roles ON user_roles.user_id = user.id INNER JOIN article on post.article_id = article.id LEFT JOIN vote on post.id = vote.post_id WHERE article.id = ?1 GROUP BY post.id, CONCAT(user.first_name, ' ', user.last_name), post.post, post.created, user.id, user_roles.role_id order by post.created desc", nativeQuery = true)
    List<Object> findPostsByArticleId(Long aid);

    @Query(value = "SELECT CONCAT(user.first_name, ' ', user.last_name), post.id,\n" +
            "    post.post, post.created, user.id AS 'users_id', COUNT(vote.id)\n" +
            "    AS votes, user_roles.role_id as role from post INNER JOIN\n" +
            "    user ON user.id = post.user_id INNER JOIN user_roles ON\n" +
            "    user_roles.user_id = user.id INNER JOIN article on\n" +
            "    post.article_id = article.id LEFT JOIN vote on post.id\n" +
            "    = vote.post_id WHERE article.id = ?1 GROUP BY post.id,\n" +
            "    CONCAT(user.first_name, ' ', user.last_name), post.post,\n" +
            "    post.created, user.id, user_roles.role_id order by votes desc", nativeQuery = true)
    List<Object> findPostsByArticleIdCountSize(Long aid);

    @Query(value = "SELECT a.id, a.title, a.created, COUNT(p.id) as articlePostCount,  CONCAT(u.first_name, ' ', u.last_name) as name from article a LEFT JOIN post p on a.id = p.article_id INNER JOIN user u on u.id = a.user_id GROUP BY a.id, a.title, name, a.created ORDER BY articlePostCount desc LIMIT 6", nativeQuery = true)
    List<Object> findMostCommentedArticlesDesc();

    @Query(value = "SELECT a.id, a.title, a.created, CONCAT(u.first_name, ' ', u.last_name) as name, COUNT(p.id) as articlePostCount from article a LEFT JOIN post p on a.id = p.article_id INNER JOIN user u on a.user_id = u.id GROUP BY a.id, a.title, a.created, CONCAT(u.first_name, ' ', u.last_name) ORDER BY a.created desc LIMIT 10", nativeQuery = true)
    List<Object> findNewestArticlesDesc();

    @Query(value = "SELECT a.id, a.title, a.created, CONCAT(u.first_name, ' ', u.last_name) as name from article a INNER JOIN user u on a.user_id = u.id where a.user_id = ?1 ORDER BY a.created desc", nativeQuery = true)
    List<Object> getAllArticlesFromUser(Long uid);
}
