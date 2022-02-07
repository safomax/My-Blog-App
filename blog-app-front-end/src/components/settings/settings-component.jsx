import React, { Component } from "react";

import NavigationComponent from "../navigation/navigation-component";
import ChangeUsernameComponent from "./change-username";
import ChangePasswordComponent from "./change-password";
import AccountService from "../../services/account-service";
import { withRouter } from "react-router";

class SettingsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      isLoading: true,
    };
  }

  componentDidMount() {
    AccountService.getCurrentUser()
      .then((res) => {
        if (res.data.username) {
          this.setState({
            loggedIn: true,
            isLoading: false,
          });
        } else {
          this.props.history.push("/sign-in");
        }
      })
      .catch(() => {
        this.props.history.push("/sign-in");
      });
  }

  render() {
    if (this.state.isLoading) {
      return <div className="loading-page"><h3 className="loading-page-text">loading</h3></div>;
    }
    return (
      <div>
        <ChangePasswordComponent />
        <ChangeUsernameComponent />
      </div>
    );
  }
}

export default withRouter(SettingsComponent);
