package com.msafo.blogapp.models.authentication;

public class NewUsernameRequest {

    private String newUsername;

    public NewUsernameRequest() {}

    public NewUsernameRequest(String newUsername) {
        this.newUsername = newUsername;
    }

    public String getNewUsername() {
        return newUsername;
    }

    public void setNewUsername(String newUsername) {
        this.newUsername = newUsername;
    }
}
