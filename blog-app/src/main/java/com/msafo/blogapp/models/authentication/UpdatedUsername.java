package com.msafo.blogapp.models.authentication;

import javax.persistence.*;

@Entity
public class UpdatedUsername {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name="updated_username", unique=true)
    private String newUsername;

    public UpdatedUsername() {
    }

    public String getNewUsername() {
        return newUsername;
    }

    public void setNewUsername(String newUsername) {
        this.newUsername = newUsername;
    }

    public UpdatedUsername(String newUsername, String confirmationToken) {
        this.newUsername = newUsername;
        this.confirmationToken = confirmationToken;
    }

    @Column(name="confirmation_token")
    private String confirmationToken;

    public String getConfirmationToken() {
        return confirmationToken;
    }

    public void setConfirmationToken(String confirmationToken) {
        this.confirmationToken = confirmationToken;
    }

    public UpdatedUsername(String newUsername) {
        this.newUsername = newUsername;
    }

}