import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthenticationService from "../../services/authentication-service";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import NavigationComponent from "../navigation/navigation-component";
import AccountService from "../../services/account-service";

export default class SignInComponent extends Component {
  constructor(props) {
    super(props);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      isLoading: true,
      loggedIn: false,
      message: "",
    };
  }

  componentDidMount() {
    AccountService.getCurrentUser()
      .then((res) => {
        if (res.data) {
          this.props.history.push("/dashboard");
        } else {
          this.setState({ loggedIn: false, isLoading: false,  });
        }
      })
      .catch(() => {
        this.setState({ loggedIn: false, isLoading: false });
      });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleSignIn(e) {
    e.preventDefault();

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {




      AuthenticationService.signIn(this.state.username, this.state.password)
        .then(() => {
          this.props.history.push("/dashboard");
        })
        .catch(() => {
          this.setState({
            message: "Wrong username or password",
          });
        });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <div className="loading-page"><h3 className="loading-page-text">loading</h3></div>;
    }
    return (
      <div className="">
        <NavigationComponent />

        <div className="sign-in-form">
          <Form
            className=""
            onSubmit={this.handleSignIn}
            ref={(c) => {
              this.form = c;
            }}
          >
            <h1 className="auth-title">MYBLOGS</h1>

            <h3>
              <b>Write blogs to help people discover you and comment.</b>
            </h3>
            <div className="">
              <Input
                type="text"
                className=""
                name="username"
                placeholder="Email address"
                value={this.state.username}
                onChange={this.onChangeUsername}
              />
            </div>

            <div className="">
              <Input
                type="password"
                className=""
                placeholder="Password"
                name="password"
                value={this.state.password}
                onChange={this.onChangePassword}
              />
            </div>

            <div className="">
              <button className="auth-buttons">
                <span>Sign in</span>
              </button>
            </div>

            <div>{this.state.message}</div>

            <Link className="below-auth-buttons" to="/sign-up">
              Don't have an account? Sign up.
            </Link>

            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                this.checkBtn = c;
              }}
            />
          </Form>
        </div>
      </div>
    );
  }
}
