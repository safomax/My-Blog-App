import React, { Component } from "react";
import PostService from "../../services/post-service";
import Textarea from "react-validation/build/textarea";
import Form from "react-validation/build/form";
import AccountService from "../../services/account-service";
import { vpost } from "../utilities/utilities";
import CheckButton from "react-validation/build/button";

export default class CreatePostsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      post: "",
      created: "",
      role: [],
      commentError: "",
    };

    this.changePostHandler = this.changePostHandler.bind(this);
  }

  componentDidMount = () => {
    AccountService.getCurrentUser().then((response) => {
      this.setState({ role: response.data.role[0].name });
    });
  };

  changePostHandler = (e) => {
    this.setState({ post: e.target.value });
  };

  createPost = (e) => {
    e.preventDefault();

    let post = {
      post: this.state.post,
    };

    if (this.state.post.length > 0) {
      console.log("This.state.id = " + this.props.id);
      PostService.createPost(this.state.id, post).then(() => {
        this.props.rerenderParentCallback();

        this.setState({ post: "", commentError: "" });
      });
    } else {
      this.setState({ commentError: "Invalid comment!" });
    }
  };

  state = { show: false };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <div>
        {this.state.role != "" ? (
          <Form
            className=""
            onSubmit={this.createPost}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className="">
              <Textarea
                placeholder="What do you think?"
                name="comment"
                className="add-comment"
                value={this.state.post}
                onChange={this.changePostHandler}
              />
            </div>

            <button className="submit-comment">Submit</button>

            <div className="comment-error">{this.state.commentError}</div>

            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                this.checkBtn = c;
              }}
            />
          </Form>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
