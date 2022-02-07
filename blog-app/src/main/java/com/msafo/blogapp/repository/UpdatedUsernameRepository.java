package com.msafo.blogapp.repository;

import com.msafo.blogapp.models.authentication.UpdatedUsername;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpdatedUsernameRepository extends JpaRepository<UpdatedUsername, Long> {

    UpdatedUsername findByConfirmationToken(String confirmationToken);
}
