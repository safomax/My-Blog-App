import React, { Component } from "react";
import { Modal } from "../modal/modal.jsx";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import axios from "axios";
import { isEmail } from "validator";
import {AiOutlineMail} from "react-icons/ai"

const required = (value) => {
  if (!value) {
    return (
      <div className="" role="alert">
        This field is required.
      </div>
    );
  }
};

const email = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="" role="alert">
        Invalid email.
      </div>
    );
  }
};

export default class ChangeUsernameComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      loggedIn: false,
      currentPassword: "",
      newUsername: "",
      username: "",
      passwordIsCorrect: false,
    };

    this.changeCurrentPasswordHandler =
      this.changeCurrentPasswordHandler.bind(this);
    this.changeNewUsernameHandler = this.changeNewUsernameHandler.bind(this);
    this.modifyNewUsername = this.modifyNewUsername.bind(this);
  }

  componentDidMount() {}

  changeCurrentPasswordHandler = (event) => {
    this.setState({ currentPassword: event.target.value });
  };

  changeNewUsernameHandler = (event) => {
    this.setState({ newUsername: event.target.value });
  };

  state = { show: false };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({
      show: false,
      currentPassword: "",
      newUsername: "",
      message: "",
      required: "",
      
    });
  };

  async modifyNewUsername(e) {
    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {

    await axios
      .get("http://localhost:8080/api/current-user", {
        withCredentials: true,
      })
      .then((res) => {
        this.setState({
          username: res.data.username,
        });
      })
      .catch((error) => {
        console.log("user doesn't exist");
      });

    let user = {
      username: this.state.username,
      password: this.state.currentPassword,
    };

    await axios
      .post("http://localhost:8080/api/check-old-password", user, {
        withCredentials: true,
      })
      .then(() => {
        this.setState({
          passwordIsCorrect: true,
        });
      })
      .catch((error) => {
        console.log("user doesn't exist");
      });

    if (this.state.passwordIsCorrect == true) {
      let newUsernameRequest = {
        newUsername: this.state.newUsername,
      };

      await axios
        .put(
          "http://localhost:8080/api/user/update-username",
          newUsernameRequest,
          {
            withCredentials: true,
          }
        )
        .then(() => {
          this.hideModal();
        });
    } else {
      this.setState({
        message: "Please ensure password is correct.",
      });
    }
  }
}

  render() {
    return (
      <div className="">
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <div className="settings-popup">
          <h3 className="text-center">Update your email</h3>

            <Form
              className=""
              onSubmit={this.modifyNewUsername}
              ref={(c) => {
                this.form = c;
              }}
            >
              <p>
                Update email below. A new verification email will be sent that
                you will need to use to verify this new email.
              </p>

              <div className="">
                <Input
                  type="password"
                  placeholder="Current password"
                  name="currentPassword"
                  className=""
                  value={this.state.currentPassword}
                  onChange={this.changeCurrentPasswordHandler}
                  validations={[required]}
                />
              </div>
              <div className="">
                <Input
                  type="text"
                  placeholder="New email"
                  name="newUsername"
                  className=""
                  value={this.state.newUsername}
                  onChange={this.changeNewUsernameHandler}
                  validations={[required, email]}
                />
              </div>

              <div className="">
                <button className="save-form">Save email</button>
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

        <button className="settings-button" type="button" onClick={this.showModal}>
          <AiOutlineMail/> {" "}Update your email
        </button>
      </div>
    );
  }
}
