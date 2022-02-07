import React, { Component } from "react";
import AccountService from "../../services/account-service";
import NavigationComponent from "../navigation/navigation-component";
import MyCommentsComponent from "../profile/my-comments-component";
import MyPostsComponent from "../profile/my-posts-component";

import { BiComment } from "react-icons/bi";
import { MdOutlineArticle } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

export default class OtherUsersComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      firstName: "",
      lastName: "",
      posts: [],
      user_id: "",
      role: "",
      email_address: "",

      aboutUserComponent: true,
      blogPostsComponent: false,
      commentsComponent: false,
    };
  }

  componentDidMount = () => {
    // Retrieve first name and last name
    AccountService.getUserByPostId(this.state.id).then((res) => {
      this.setState({
        firstName: res.data[1],
        lastName: res.data[2],
        user_id: res.data[0],
        email_address: res.data[3],
        role: res.data[4],
      });
    });

    // Then retrieve posts and articles created by the user
    AccountService.getPostsWithArticles(this.state.user_id).then((res) => {
      this.setState({
        posts: res.data,
      });
    });
  };

  showAboutUserComponent = () => {
    this.setState({
      commentsComponent: false,
      blogPostsComponent: false,
      aboutUserComponent: true,
    });
  };

  showBlogPostsComponent = () => {
    this.setState({
      commentsComponent: false,
      blogPostsComponent: true,
      aboutUserComponent: false,
    });
  };

  showCommentsComponent = () => {
    this.setState({
      commentsComponent: true,
      blogPostsComponent: false,
      aboutUserComponent: false,
    });
  };

  render() {
    return (
      <div>
        <NavigationComponent />

        <div>
          <h3>User:</h3> {this.state.firstName} {this.state.lastName}
        </div>

        <div className="" id="">
          <ul className="profile-component-nav">
            <>
              <li className="">
                <button
                  className="profile-component-buttons"
                  onClick={this.showAboutUserComponent}
                >
                  <CgProfile /> About
                </button>
              </li>

              {this.state.role !== 3 ? (
                <li>
                  <button
                    className="profile-component-buttons"
                    onClick={this.showBlogPostsComponent}
                  >
                    <MdOutlineArticle /> Blog posts
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
                  <BiComment /> Comments
                </button>
              </li>
            </>
          </ul>
        </div>

        {this.state.aboutUserComponent === true ? (
          <div>
            <h3>About user</h3>

            <div className="profile-pane col-8 col-s-11">
              <div className="profile-user-info">
                <b>Email address:</b> {this.state.email_address}
              </div>
              <div className="profile-user-info">
                <b>Name:</b> {this.state.firstName} {this.state.lastName}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {this.state.commentsComponent === true ? (
          <MyCommentsComponent id={this.state.user_id} />
        ) : (
          <></>
        )}

        {this.state.blogPostsComponent === true ? (
          <div>
            <MyPostsComponent
              id={this.state.user_id}
              firstName={this.state.firstName}
              lastName={this.state.lastName}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
