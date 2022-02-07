import { isEmail } from "validator";
import validator from "validator";
import React, { Component } from "react";


export const required = (value) => {
    if (!value) {
      return <div className="">This field is required.</div>;
    }
  };

export const vemail = (value) => {
    if (!isEmail(value)) {
      return <div className="">Invalid email.</div>;
    }
  };

  export const vtitle = (value) => {
    if(!/[0-9a-zA-Z]{1,}/.test(value)){
      return <div className="">Invalid title.</div>;
    }
  };

  export const vpost = (value) => {
    if(!/[0-9a-zA-Z]{1,}/.test(value)){
      return false;
    }
  };

  export const varticletext = (value) => {
    if(!/[0-9a-zA-Z]{5,}/.test(value)){
      return <div className="">Article must have at least 5 words.</div>;
    }
  };

  export const vpassword = (value) => {
    if (
      !validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return (
        <div className="">
          The password must contain..
          <br />
          Length of 8<br />
          At least one lowercase letter
          <br />
          At least one uppercase letter
          <br />
          At least one number
          <br />
          At least one symbol
          <br />
        </div>
      );
    }
  };

