import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { required, vemail, vpassword } from "../utilities/utilities";
import AuthenticationService from "../../services/authentication-service";
import NavigationComponent from "../navigation/navigation-component";
import AccountService from "../../services/account-service";

export default class SignUpComponent extends Component {
  constructor(props) {
    super(props);

    this.handleSignUp = this.handleSignUp.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      isLoading: true,
      loggedIn: true,
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangeFirstName(e) {
    this.setState({
      firstName: e.target.value,
    });
  }

  onChangeLastName(e) {
    this.setState({
      lastName: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  componentDidMount() {
    AccountService.getCurrentUser()
      .then((res) => {
        if (res.data) {
          this.props.history.push("/dashboard");
        } else {
          this.setState({ loggedIn: false, isLoading: false });
        }
      })
      .catch(() => {
        this.setState({ loggedIn: false, isLoading: false });
      });
  }

  handleSignUp(e) {
    e.preventDefault();

    this.form.validateAll();

    let signUpRequest = {
      username: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      password: this.state.password,
    };

    if (this.checkBtn.context._errors.length === 0) {
      AuthenticationService.signUp(signUpRequest)
        .then(() => {
          this.props.history.push("/sign-in");
        })
        .catch(() => {
          this.setState({
            message: "Email address already exists",
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
        <div className="sign-up-form">
          <Form
            className=""
            onSubmit={this.handleSignUp}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div>
              <h1 className="auth-title">MYBLOGS</h1>

              <h3>
                <b>Write blogs to help people discover you and comment.</b>
              </h3>
            </div>

            <div>
              <div className="">
                <Input
                  type="text"
                  className=""
                  placeholder="Email address"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChangeEmail}
                  validations={[required, vemail]}
                />
              </div>

              <div className="">
                <Input
                  type="text"
                  className=""
                  placeholder="First name"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.onChangeFirstName}
                  validations={[required]}
                />
              </div>

              <div className="">
                <Input
                  type="text"
                  className=""
                  placeholder="Last name"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.onChangeLastName}
                  validations={[required]}
                />
              </div>

              <div className="">
                <Input
                  type="password"
                  className=""
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              <div className="">
                <button className="auth-buttons">Sign up</button>
              </div>

              <Link className="below-auth-buttons" to="/sign-in">
                Already have an account? Sign in.
              </Link>
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
      </div>
    );
  }
}
