import React, { Component } from "react";
import { withRouter } from "react-router";
import AccountService from "../../services/account-service";

class MyCommentsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      firstName: props.firstName,
      lastName: props.lastName,
      comments: [],
      posts: [],
    };
  }

  async componentDidMount() {
    // Then retrieve posts and articles created by the user
    await AccountService.getPostsWithArticles(this.state.id).then((res) => {
      this.setState({
        posts: res.data,
      });
    });

    let date = new Date();
    for (var i = 0; i < this.state.posts.length; i++) {
      this.state.posts[i][2] = this.state.posts[i][2].substring(0, 10);
    }
  }

  render() {
    return (
      <>
        <>
          <div className="col-6">
            <h3>Comments</h3>

            {this.state.posts.map((post) => (
              <div className="profile-pane">
                <div>
                  <h3>{post[0]}</h3> {post[2]}
                </div>
                <div className="comment-from-user">{post[1]}</div>
              </div>
            ))}
          </div>
        </>
      </>
    );
  }
}

export default withRouter(MyCommentsComponent);
