import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import AccountService from "../../services/account-service";
import NavigationComponent from "../navigation/navigation-component";

class VerifyAccountComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      message: "",
      verified: false,
    };
  }

  componentDidMount() {
    const confirmationToken = window.location.href.substring(43);

    AccountService.verifyAccount(confirmationToken)
      .then(() => {
        this.setState({
          verified: true,
          message: "Successfully verified account!",
        });
      })
      .catch((e) => {});
  }

  render() {
    return (
      <div>
        <NavigationComponent />

        {this.state.verified ? (
          <div>
            <h1>{this.state.message}</h1>

            <Link to="/sign-in">
              <button type="button">Sign in</button>
            </Link>
          </div>
        ) : (
          <div>
            <h1>Something went wrong...</h1>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(VerifyAccountComponent);
