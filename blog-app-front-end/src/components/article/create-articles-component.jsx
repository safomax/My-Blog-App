import React, { Component } from "react";
import ArticleService from "../../services/article-service";
import { ArticleModal } from "../modal/article-modal";
import Textarea from "react-validation/build/textarea";
import Input from "react-validation/build/input";
import AccountService from "../../services/account-service";

import Form from "react-validation/build/form";
import { HiDocumentAdd } from "react-icons/hi";

export default class CreateArticleComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      text: "",
      role: "",
      message: "",
    };

    this.changeTitleHandler = this.changeTitleHandler.bind(this);
    this.changeTextHandler = this.changeTextHandler.bind(this);
  }

  componentDidMount = () => {
    AccountService.getCurrentUser().then((response) => {
      this.setState({ role: response.data.role[0].name });
    });
  };

  changeTitleHandler = (e) => {
    this.setState({ title: e.target.value });
  };

  changeTextHandler = (e) => {
    this.setState({ text: e.target.value });
  };

  createArticle = (e) => {
    e.preventDefault();

    let article = {
      title: this.state.title,
      text: this.state.text,
    };

    console.log(article);

    if (this.state.title.length < 4 && this.state.text.length < 50) {
      this.setState({
        message:
          "Please ensure title and article are greater than 4 and 50 characters respectively.",
      });
    } else if (this.state.title.length < 4) {
      this.setState({
        message: "Please ensure title length is greater than 4 characters.",
      });
    } else if (this.state.text.length < 50) {
      this.setState({
        message: "Please ensure article length is greater 50 characters.",
      });
    } else {
      ArticleService.createArticle(article).then(() => {
        this.hideModal();

        this.setState({
          title: "",
          text: "",
        });

        this.props.rerenderParentCallback();
      });
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
        <ArticleModal show={this.state.show} handleClose={this.hideModal}>
          <h3 className="create-article-modal-title">Create article</h3>
          <Form
            className=""
            onSubmit={this.createArticle}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className="">
              <Input
                placeholder="Title"
                name="title"
                className=""
                value={this.state.title}
                onChange={this.changeTitleHandler}
              />
            </div>

            <div className="">
              <Textarea
                placeholder="Article text goes here..."
                name="text"
                className="text-box"
                value={this.state.text}
                onChange={this.changeTextHandler}
              />
            </div>

            <div>{this.state.message}</div>

            <button className="submit-comment">Create</button>
          </Form>
        </ArticleModal>

        {this.state.role == "ROLE_ADMIN" ||
        this.state.role == "ROLE_MODERATOR" ? (
          <button
            className="settings-button"
            type="button"
            onClick={this.showModal}
          >
            <HiDocumentAdd /> Add an article
          </button>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
