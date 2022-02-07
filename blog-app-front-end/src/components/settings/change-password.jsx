import React, { Component } from "react";
import { Modal } from "../modal/modal.jsx";
import validator from "validator";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AccountService from "../../services/account-service";
import axios from "axios";
import { required, vpassword } from "../utilities/utilities";
import { BsKey } from "react-icons/bs";

export default class ChangePasswordComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      loggedIn: false,
      newPassword: "",
      newPasswordConfirm: "",
      oldPassword: "",
      username: "",
    };

    this.changeNewPasswordConfirmHandler =
      this.changeNewPasswordConfirmHandler.bind(this);
    this.changeNewPasswordHandler = this.changeNewPasswordHandler.bind(this);
    this.changeOldPasswordHandler = this.changeOldPasswordHandler.bind(this);

    this.changePassword = this.changePassword.bind(this);
  }

  changeNewPasswordConfirmHandler = (event) => {
    this.setState({ newPasswordConfirm: event.target.value });
  };

  changeNewPasswordHandler = (event) => {
    this.setState({ newPassword: event.target.value });
  };

  changeOldPasswordHandler = (event) => {
    this.setState({ oldPassword: event.target.value });
  };

  state = { show: false };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({
      show: false,
      newPassword: "",
      newPasswordConfirm: "",
      oldPassword: "",
      message: "",
      required: "",
      oldPasswordIsCorrect: false,
    });
  };

  async changePassword(e) {
    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      let user = {
        password: this.state.oldPassword,
      };

      await axios
        .post("http://localhost:8080/api/check-old-password", user, {
          withCredentials: true,
        })
        .then(() => {
          this.setState({
            oldPasswordIsCorrect: true,
          });
        })
        .catch((error) => {
          console.log("......");
        });

      if (
        this.state.newPassword === this.state.newPasswordConfirm &&
        this.state.oldPassword !== this.state.newPassword &&
        this.state.oldPasswordIsCorrect === true
      ) {
        let userCurrent = {
          password: this.state.newPasswordConfirm,
        };

        AccountService.updatePassword(userCurrent).then(() => {
          this.hideModal();
        });
      } else {
        this.setState({
          message:
            "Please ensure both new password inputs are identical and old password is correct.",
        });
      }
    }
  }

  render() {
    return (
      <div className="container">
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <div className="settings-popup">
            <h3 className="text-center">Update your password</h3>

            <Form
              className="auth-forms"
              onSubmit={this.changePassword}
              ref={(c) => {
                this.form = c;
              }}
            >
              <div className="">
                <Input
                  type="password"
                  placeholder="Old password"
                  name="oldPassword"
                  className=""
                  value={this.state.oldPassword}
                  onChange={this.changeOldPasswordHandler}
                  validations={[required]}
                />
              </div>

              <div className="">
                <Input
                  type="password"
                  placeholder="New password"
                  name="newPassword"
                  className=""
                  value={this.state.newPassword}
                  onChange={this.changeNewPasswordHandler}
                  validations={[required, vpassword]}
                />
              </div>
              <div className="">
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  name="newPasswordConfirm"
                  className=""
                  value={this.state.newPasswordConfirm}
                  onChange={this.changeNewPasswordConfirmHandler}
                  validations={[required]}
                />
              </div>
              <div className="">
                <button className="save-form">Save</button>
              </div>
              <div>{this.state.message}</div>
              <CheckButton
                style={{ display: "none" }}
                ref={(c) => {
                  this.checkBtn = c;
                }}
              />
            </Form>
          </div>
        </Modal>

        <button
          className="settings-button"
          type="button"
          onClick={this.showModal}
        >
          <BsKey /> Update your password
        </button>
      </div>
    );
  }
}
