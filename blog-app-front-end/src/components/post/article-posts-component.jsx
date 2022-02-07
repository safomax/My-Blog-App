import React, { Component } from "react";
import PostService from "../../services/post-service";
import Textarea from "react-validation/build/textarea";
import Form from "react-validation/build/form";
import AccountService from "../../services/account-service";
import { withRouter } from "react-router";
import VoteService from "../../services/vote-service";
import { BsHandThumbsUp, BsHandThumbsDown, BsReply } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import CreatePostsComponent from "./create-posts-component";
import axios from "axios";

class ArticlePostsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      object: [],
      showReply: true,
      showComponent: false,
      reply: "",
      postToReply: -1,

      user_id: "",
      firstName: "",
      lastName: "",
      posts: "",
      articles: "",
      role: "",
      currentPost: "",
    };

    this.toggleReplyBox = this.toggleReplyBox.bind(this);
    this.postReply = this.postReply.bind(this);
    this.changeReplyHandler = this.changeReplyHandler.bind(this);
    this.viewUserProfile = this.viewUserProfile.bind(this);

    this.upvotePost = this.upvotePost.bind(this);

    this.deleteAnyPost = this.deleteAnyPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
  }

  componentDidMount() {
    PostService.getArticlePosts(this.state.id).then((response) => {
      this.setState({
        object: response.data,
      });

      let date = new Date();

      for (var i = 0; i < this.state.object.length; i++) {
        this.state.object[i][3] = this.state.object[i][3].substring(0, 10);
      }
    });

    AccountService.getCurrentUser().then((response) => {
      this.setState({
        role: response.data.role[0].name,
        user_id: response.data.id,
      });
    });
  }

  toggleReplyBox(pid) {
    this.setState({
      postToReply: pid,
      showComponent: !this.state.showComponent,
    });
  }

  postReply() {
    let post = {
      post: this.state.reply,
    };

    console.log(this.state.postToReply);

    PostService.createReply(this.state.id, post);
  }

  changeReplyHandler = (e) => {
    this.setState({ reply: e.target.value });
  };

  viewUserProfile(id) {
    AccountService.getUserByPostId(id);

    if (this.state.role === "") {
      this.props.history.push("/sign-in");
      window.location.reload();
    }

    this.props.history.push(`/user/${id}`);
    window.location.reload();
  }

  async upvotePost(id) {
    await VoteService.upvotePost(id);

    await PostService.getArticlePosts(this.state.id).then((response) => {
      this.setState({
        object: response.data,
      });

      let date = new Date();

      for (var i = 0; i < this.state.object.length; i++) {
        this.state.object[i][3] = this.state.object[i][3].substring(0, 10);
      }
    });
  }

  async deleteAnyPost(id) {
    await PostService.deleteAnyPost(id);

    await PostService.getArticlePosts(this.state.id).then((response) => {
      this.setState({
        object: response.data,
      });

      let date = new Date();

      for (var i = 0; i < this.state.object.length; i++) {
        var obj = (this.state.object[i][3] = this.state.object[i][3].substring(
          0,
          10
        ));
      }
    });
  }

  async deletePost(id) {
    await PostService.deletePost(id);

    await PostService.getArticlePosts(this.state.id).then((response) => {
      this.setState({
        object: response.data,
      });

      let date = new Date();

      for (var i = 0; i < this.state.object.length; i++) {
        var obj = (this.state.object[i][3] = this.state.object[i][3].substring(
          0,
          10
        ));
      }
    });
  }

  rerenderParentCallback() {
    this.forceUpdate();

    PostService.getArticlePosts(this.state.id).then((response) => {
      this.setState({
        object: response.data,
      });

      for (var i = 0; i < this.state.object.length; i++) {
        this.state.object[i][3] = this.state.object[i][3].substring(0, 10);
        console.log(this.state.object[i][3]);
      }
    });
  }

  render() {
    return (
      <div className="post-container">
        <CreatePostsComponent
          id={this.state.id}
          rerenderParentCallback={this.rerenderParentCallback}
        />
        <div>
          <h4>
            <BiComment />
            {this.state.object.length} comments
          </h4>
        </div>

        {this.state.object.map((post) => (
          <div className="individual-comment">
            <div>
              <div>
                <div>
                  <div>
                    <button
                      className="view-user-profile"
                      onClick={() => this.viewUserProfile(post[1])}
                    >
                      <span className="user-name-comment">{post[0]}</span>

                      {post[6] === 1 ? (
                        <span className="admin-privilege"> ADMIN</span>
                      ) : (
                        <></>
                      )}

                      {post[6] === 2 ? (
                        <span className="moderator-privilege"> MODERATOR</span>
                      ) : (
                        <></>
                      )}
                    </button>{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp; {post[3]}
                    {this.state.role == "ROLE_ADMIN" ||
                    this.state.role == "ROLE_MODERATOR" ? (
                      <div
                        className="delete-button"
                        onClick={() => this.deleteAnyPost(post[1])}
                      >
                        <AiOutlineDelete />
                      </div>
                    ) : (
                      <></>
                    )}
                    {this.state.role == "ROLE_USER" &&
                    this.state.user_id == post[4] ? (
                      <div
                        onClick={() => this.deletePost(post[1])}
                        className="delete-button"
                      >
                        <AiOutlineDelete />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>

                  <div className="comment-from-user">{post[2]}</div>
                </div>
              </div>
              {this.state.role !== "" ? (
                <button
                  className="reply-button"
                  onClick={() => this.toggleReplyBox(post[1])}
                >
                  <BsReply />
                </button>
              ) : (
                <></>
              )}

              <div className="reply-comment">
                {this.state.showComponent &&
                this.state.postToReply == post[1] ? (
                  <div>
                    <Form
                      className=""
                      onSubmit={this.postReply}
                      ref={(c) => {
                        this.form = c;
                      }}
                    >
                      <div className="">
                        <Textarea
                          placeholder="Comment"
                          name="reply"
                          className="add-comment"
                          value={this.state.reply}
                          onChange={this.changeReplyHandler}
                        />
                      </div>

                      {this.state.role != "" ? (
                        <div className="">
                          {" "}
                          <BsReply />
                        </div>
                      ) : (
                        <></>
                      )}
                    </Form>
                  </div>
                ) : null}
              </div>
            </div>

            {this.state.role !== "" ? (
              <>
                <span
                  className="upvote-buttons"
                  onClick={() => this.upvotePost(post[1])}
                >
                  <BsHandThumbsUp /> {post[5]}
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(ArticlePostsComponent);
