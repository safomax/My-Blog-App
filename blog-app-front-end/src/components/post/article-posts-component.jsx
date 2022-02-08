import React, { Component } from "react";
import PostService from "../../services/post-service";
import Textarea from "react-validation/build/textarea";
import Form from "react-validation/build/form";
import AccountService from "../../services/account-service";
import { withRouter } from "react-router";
import VoteService from "../../services/vote-service";
import { BsHandThumbsUp, BsReply } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import CreatePostsComponent from "./create-posts-component";
import { FiEdit } from "react-icons/fi";
import CheckButton from "react-validation/build/button";

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
      postToUpdate: -1,
      user_id: "",
      firstName: "",
      lastName: "",
      posts: "",
      articles: "",
      role: "",
      currentPost: "",
      currentPostToUpdate: false,
      updatedPost: "",
    };

    this.toggleReplyBox = this.toggleReplyBox.bind(this);
    this.toggleUpdateBox = this.toggleUpdateBox.bind(this);
    this.postReply = this.postReply.bind(this);
    this.changeReplyHandler = this.changeReplyHandler.bind(this);
    this.changeUpdatedPostHandler = this.changeUpdatedPostHandler.bind(this);
    this.viewUserProfile = this.viewUserProfile.bind(this);
    this.upvotePost = this.upvotePost.bind(this);
    this.deleteAnyPost = this.deleteAnyPost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.updateAnyPost = this.updateAnyPost.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    PostService.getArticlePosts(this.state.id).then((response) => {
      this.setState({
        object: response.data,
      });
    });

    AccountService.getCurrentUser().then((response) => {
      this.setState({
        role: response.data.role[0].name,
        user_id: response.data.id,
      });
    });
  }

  changeUpdatedPostHandler = (e) => {
    this.setState({ updatedPost: e.target.value });
  };

  toggleReplyBox(pid) {
    this.setState({
      postToReply: pid,
      showComponent: !this.state.showComponent,
    });
  }

  async postReply(id) {
    let post = {
      post: this.state.reply,
    };

    await PostService.createReply(id, post);

    this.setState({
      showComponent: !this.state.showComponent,
      reply: "",
    });

    await PostService.getArticlePosts(this.state.id).then((response) => {
      this.setState({
        object: response.data,
      });
    });
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

    this.refresh();
  }

  async deleteAnyPost(id) {
    await PostService.deleteAnyPost(id);

    this.refresh();
  }

  async deletePost(id) {
    await PostService.deletePost(id);

    this.refresh();
  }

  async updateAnyPost(id) {
    let updatedPost = {
      post: this.state.updatedPost,
    };
    await PostService.updateAnyPost(id, updatedPost)
      .then(() => {
        this.setState({ updatedPost: "" });
      })
      .catch(() => {});

    this.setState({
      currentPostToUpdate: !this.state.currentPostToUpdate,
    });

    this.refresh();
  }

  async updatePost(id) {
    let updatedPost = {
      post: this.state.updatedPost,
    };

    await PostService.updatePost(id, updatedPost)
      .then(() => {
        this.setState({ updatedPost: "" });
      })
      .catch(() => {});

    this.setState({
      currentPostToUpdate: !this.state.currentPostToUpdate,
    });

    this.refresh();
  }

  async refresh() {
    await PostService.getArticlePosts(this.state.id).then((response) => {
      this.setState({
        object: response.data,
      });

      let date = new Date();

      for (var i = 0; i < this.state.object.length; i++) {
        this.setState({});
        this.state.object[i][3] = this.state.object[i][3].substring(0, 10);
      }
    });
  }

  toggleUpdateBox = (pid, post) => {
    this.setState({
      postToUpdate: pid,
      currentPostToUpdate: !this.state.currentPostToUpdate,
      updatedPost: post,
    });
  };

  rerenderParentCallback() {
    this.forceUpdate();

    PostService.getArticlePosts(this.state.id).then((response) => {
      this.setState({
        object: response.data,
      });

      for (var i = 0; i < this.state.object.length; i++) {
        this.state.object[i][3] = this.state.object[i][3].substring(0, 10);
      }
    });
  }

  getCurrent = (post) =>
    this.state.object
      .filter((cPost) => cPost[7] == post)
      .map((cPost) => (
        <ul key={`${cPost[1]}`}>
          <ol key={`${cPost[1]}`}>
            <div style={{ color: "black" }}>
              <div className="individual-comment">
                <div>
                  <div>
                    <div>
                      <div>
                        <button
                          className="view-user-profile"
                          onClick={() => this.viewUserProfile(cPost[1])}
                        >
                          <span className="user-name-comment">
                            <b>{cPost[0]}</b>
                          </span>
                          <span> {""} |</span>
                          {cPost[6] === 1 ? (
                            <span className="admin-privilege"> ADMIN</span>
                          ) : (
                            <></>
                          )}

                          {cPost[6] === 2 ? (
                            <span className="moderator-privilege">
                              {" "}
                              MODERATOR
                            </span>
                          ) : (
                            <></>
                          )}
                        </button>{" "}
                        &nbsp;&nbsp;&nbsp;&nbsp; {cPost[3].substring(0, 10)}
                        {this.state.role == "ROLE_ADMIN" ||
                        this.state.role == "ROLE_MODERATOR" ? (
                          <div>
                            <div
                              className="delete-button"
                              onClick={() => this.deleteAnyPost(cPost[1])}
                            >
                              <AiOutlineDelete />
                            </div>

                            <div
                              className="update-button"
                              onClick={() =>
                                this.toggleUpdateBox(cPost[1], cPost[2])
                              }
                            >
                              <FiEdit />
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                        {this.state.role == "ROLE_USER" &&
                        this.state.user_id == cPost[4] ? (
                          <div>
                            <div
                              onClick={() => this.deletePost(cPost[1])}
                              className="delete-button"
                            >
                              <AiOutlineDelete />
                            </div>

                            <div
                              onClick={() =>
                                this.toggleUpdateBox(cPost[1], cPost[2])
                              }
                              className="update-button"
                            >
                              <FiEdit />
                            </div>
                          </div>
                        ) : (
                          <div></div>
                        )}
                        {this.state.currentPostToUpdate == true &&
                        this.state.postToUpdate === cPost[1] &&
                        this.state.role === "ROLE_USER" ? (
                          <div className="reply-comment">
                            <div className="">
                              <textarea
                                placeholder="Edit"
                                name="text"
                                className="add-comment"
                                value={this.state.updatedPost}
                                onChange={this.changeUpdatedPostHandler}
                              />
                            </div>
                            <button
                              onClick={() => this.updatePost(cPost[1])}
                              className="submit-comment"
                            >
                              Update
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                        {(this.state.currentPostToUpdate &&
                          this.state.postToUpdate === cPost[1] &&
                          this.state.role === "ROLE_ADMIN") ||
                        this.state.role === "ROLE_MODERATOR" ? (
                          <div className="reply-comment">
                            <div className="">
                              <textarea
                                placeholder="Edit"
                                name="text"
                                className="add-comment"
                                value={this.state.updatedPost}
                                onChange={this.changeUpdatedPostHandler}
                              />
                            </div>

                            <button
                              onClick={() => this.updateAnyPost(cPost[1])}
                              className="submit-comment"
                            >
                              Update
                            </button>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className="comment-from-user">{cPost[2]}</div>
                    </div>
                  </div>
                  {this.state.role !== "" ? (
                    <button
                      className="reply-button"
                      onClick={() => this.toggleReplyBox(cPost[1])}
                    >
                      <BsReply />
                    </button>
                  ) : (
                    <></>
                  )}

                  <div className="reply-comment">
                    {this.state.showComponent &&
                    this.state.postToReply == cPost[1] ? (
                      <div>
                        <div className="">
                          <textarea
                            placeholder="Comment"
                            name="reply"
                            className="add-comment"
                            value={this.state.reply}
                            onChange={this.changeReplyHandler}
                          />
                        </div>

                        <button
                          onClick={() => this.postReply(cPost[1])}
                          className="submit-comment"
                        >
                          Reply
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {this.state.role !== "" ? (
                  <>
                    <span
                      className="upvote-buttons"
                      onClick={() => this.upvotePost(cPost[1])}
                    >
                      <BsHandThumbsUp /> {cPost[5]}
                    </span>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {this.getCurrent(cPost[1])}
          </ol>
        </ul>
      ));

  render() {
    return (
      <div
        className="post-container"
        style={{
          backgroundColor: "white",
          padding: "18px 3px 8px 8px",
          justifyContent: "center",
          marginBottom: "15px",
        }}
      >
        <CreatePostsComponent
          id={this.state.id}
          rerenderParentCallback={this.rerenderParentCallback}
        />
        <div>
          <h4>
            <BiComment />
            {this.state.object.length} {"  "} comments
          </h4>
        </div>

        {this.getCurrent(null)}
      </div>
    );
  }
}

export default withRouter(ArticlePostsComponent);
