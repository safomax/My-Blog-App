import React, { Component } from "react";

import NavigationComponent from "../navigation/navigation-component";
import AccountService from "../../services/account-service";
import { withRouter } from "react-router";
import MyPostsComponent from "./my-posts-component";
import SettingsComponent from "../settings/settings-component";
import MyCommentsComponent from "./my-comments-component";
import { BiComment } from "react-icons/bi";
import { MdOutlineArticle } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

class ProfileComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      isLoading: true,
      id: "",
      aboutMeComponent: true,
      blogPostsComponent: false,
      commentsComponent: false,
      firstName: "",
      lastName: "",
      role: "",
    };

    this.showAboutMeComponent = this.showAboutMeComponent.bind(this);
    this.showBlogPostsComponent = this.showBlogPostsComponent.bind(this);
    this.showCommentsComponent = this.showCommentsComponent.bind(this);
  }

  componentDidMount() {
    AccountService.getCurrentUser()
      .then((res) => {
        if (res.data.username) {
          this.setState({
            loggedIn: true,
            isLoading: false,
            username: res.data.username,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            role: res.data.role[0].name.substring(5),
            id: res.data.id,
          });
        } else {
          this.props.history.push("/sign-in");
        }
      })
      .catch(() => {
        this.props.history.push("/sign-in");
      });
  }

  showAboutMeComponent = () => {
    this.setState({
      commentsComponent: false,
      blogPostsComponent: false,
      aboutMeComponent: true,
    });
  };

  showBlogPostsComponent = () => {
    this.setState({
      commentsComponent: false,
      blogPostsComponent: true,
      aboutMeComponent: false,
    });
  };

  showCommentsComponent = () => {
    this.setState({
      commentsComponent: true,
      blogPostsComponent: false,
      aboutMeComponent: false,
    });
  };

  render() {
    if (this.state.isLoading) {
      return <div className="loading-page"><h3 className="loading-page-text">loading</h3></div>;
    }
    return (
      <>
        <NavigationComponent />

        <div className="col-11 col-s-11">
          <h1 className="profile-title">My Profile</h1>
        </div>

        <SettingsComponent />

        <div className="" id="">
          <ul className="profile-component-nav">
            <>
              <li className="">
                <button
                  className="profile-component-buttons"
                  onClick={this.showAboutMeComponent}
                  
                >
                  <CgProfile /> About me
                </button>
              </li>

              {this.state.role != "USER" ? (
                <li>
                  <button
                    className="profile-component-buttons"
                    onClick={this.showBlogPostsComponent}
                  >
                    <MdOutlineArticle /> My blog posts
                  </button>
                </li>
              ) : (
                <></>
              )}
              <li>
                <button
                  className="profile-component-buttons"
                  onClick={this.showCommentsComponent}
                >
                  <BiComment /> My comments
                </button>
              </li>
            </>
          </ul>
        </div>

        {this.state.aboutMeComponent === true ? (
          <div>
            <h3 style={{marginLeft: "20px"}}>About me</h3>

            <div className="profile-pane col-8 col-s-11">
              <div className="profile-user-info">
                <b>Email address:</b> {this.state.username}
              </div>
              <div className="profile-user-info">
                <b>Name:</b> {this.state.firstName} {this.state.lastName}
              </div>

              <div className="profile-user-info">
                {" "}
                <b>Role:</b> {this.state.role}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {this.state.commentsComponent === true ? (
          <MyCommentsComponent id={this.state.id} />
        ) : (
          <></>
        )}

        {this.state.blogPostsComponent === true ? (
          <div>
            <MyPostsComponent
              id={this.state.id}
              firstName={this.state.firstName}
              lastName={this.state.lastName}
            />
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}

export default withRouter(ProfileComponent);
