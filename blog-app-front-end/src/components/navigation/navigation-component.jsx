import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import AuthenticationService from "../../services/authentication-service";
import AccountService from "../../services/account-service";
import { withRouter } from "react-router-dom";
import { MdOutlineArticle } from "react-icons/md";
import { BiUser } from "react-icons/bi";

class NavigationComponent extends Component {
  constructor(props) {
    super(props);

    this.signOut = this.signOut.bind(this);

    this.state = {
      name: "",
      password: "",
      role: "",
      loggedIn: false,
      message: "",
    };
  }

  signOut = () => {
    AuthenticationService.signOut();
    this.setState({ loggedIn: false });
    this.props.history.push("/sign-in");
    window.location.reload();
  };

  componentDidMount() {
    AccountService.getCurrentUser()
      .then((res) => {
        if (res.data.username) {
          this.setState({
            loggedIn: true,
            name: res.data.firstName + " " + res.data.lastName,
            role: res.data.role[0].name.substring(5),
          });
        }
      })
      .catch(() => {
        this.setState({
          loggedIn: false,
        });
      });
  }

  render() {
    return (
      <div className="">
        <div className="header" id="">
          <ul>
            <div className="my-blogs-title">
              <li>
                <Link className="title" to="/dashboard">
                  MYBLOGS
                </Link>
              </li>
            </div>
          </ul>
        </div>

        <nav>
          <div className="nav-top" id="">
            <ul>
              {this.state.loggedIn ? (
                <>
                  <li>
                    <Link className="a" to="/dashboard">
                      <MdOutlineArticle /> Blog posts
                    </Link>
                  </li>

                  <li>
                    <Link className="a" to="/profile">
                      <BiUser /> {this.state.name}, {this.state.role}
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="a sign-in-out-button"
                      to="/sign-in"
                      onClick={this.signOut}
                    >
                      <> Sign out</>
                    </Link>
                  </li>
                </>
              ) : (
                <div>
                  <li>
                    <Link className="a" to="/dashboard">
                      Blog posts
                    </Link>
                  </li>
                  <li>
                    <Link className="a sign-in-out-button" to="/sign-in">
                      Sign in
                    </Link>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default withRouter(NavigationComponent);
