package com.msafo.blogapp.utilities;

public class NewEmailRequest {

    private String newEmail;

    public NewEmailRequest() {

    }

    public NewEmailRequest(String newEmail) {
        this.newEmail = newEmail;
    }

    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }
}