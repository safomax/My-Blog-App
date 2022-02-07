package com.msafo.blogapp.models.authentication;

import javax.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleName name;

    public Role(){

    }

    public Role(RoleName name) {
        this.name = name;
    }

    public String getName() {
        return name.toString();
    }

    public void setName(RoleName name) {
        this.name = name;
    }
}
