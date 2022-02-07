import React, { Component } from "react";
import AccountService from "../../services/account-service";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import ArticleService from "../../services/article-service";
import NavigationComponent from "../navigation/navigation-component";
import ArticlePostsComponent from "../post/article-posts-component";
import TopArticlesComponent from "./top-articles-component";
import MostCommentedArticlesComponent from "./most-commented-articles-component";
import { AiOutlineDelete } from "react-icons/ai";
import { GrUpdate } from "react-icons/gr";
import { MdOutlineSecurity } from "react-icons/md";
import { ArticleModal } from "../modal/article-modal";
import Textarea from "react-validation/build/textarea";
import Input from "react-validation/build/input";
import Form from "react-validation/build/form";
import { Modal } from "../modal/modal.jsx";

export default class ArticleComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params.id,
      title: "",
      text: "",
      created: "",
      user: "",
      role: [],
      message: "",
      deleteArticleMessage: "",
    };

    this.deleteCurrentArticle = this.deleteCurrentArticle.bind(this);
    this.updateCurrentArticle = this.updateCurrentArticle.bind(this);
    this.changeTitleHandler = this.changeTitleHandler.bind(this);
    this.changeTextHandler = this.changeTextHandler.bind(this);
  }

  changeTitleHandler = (e) => {
    this.setState({ title: e.target.value });
  };

  changeTextHandler = (e) => {
    this.setState({ text: e.target.value });
  };

  componentDidMount = () => {
    ArticleService.getArticleById(this.state.id).then((response) => {
      var date = new Date();

      this.setState({
        title: response.data.title,
        text: response.data.text,
        created: response.data.created.substring(0, 10),
      });
    });

    ArticleService.getArticleCreator(this.state.id).then((response) => {
      this.setState({
        user: response.data,
      });
    });

    AccountService.getCurrentUser().then((response) => {
      this.setState({ role: response.data.role[0].name });
    });
  };

  deleteCurrentArticle = (id) => {
    ArticleService.deleteArticle(id)
      .then(() => {
        this.props.history.push("/dashboard");
      })
      .catch(() => {
        this.showDeleteFail();
      });
  };

  updateCurrentArticle = (e) => {
    e.preventDefault();

    let article = {
      title: this.state.title,
      text: this.state.text,
    };

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
      ArticleService.updateArticle(this.state.id, article)
        .then(() => {
          this.setState({
            title: article.title,
            text: article.text,
          });

          this.hideModal();
        })
        .catch(() => {
          this.setState({ message: "Cannot update someone elses article." });
        });
    }

    ArticleService.getArticleById(this.state.id).then((response) => {
      var date = new Date();

      this.setState({
        title: response.data.title,
        text: response.data.text,
        created: response.data.created.substring(0, 10),
      });
    });
  };

  state = { show: false, showDeleteFail: false };

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false, showDeleteFail: false });
  };

  showDeleteFail = () => {
    this.setState({ showDeleteFail: true });
  };

  render() {
    return (
      <div className="articles-page">
        <NavigationComponent />

        <div className="col-8 col-s-11">
          <h1 className="article-text">{this.state.title}</h1>

          <p className="article-text">
            Created by{" "}
            <b style={{ color: "rgb(97, 97, 196)" }}>{this.state.user}</b> on{" "}
            {this.state.created}
          </p>
        </div>

        {this.state.role == "ROLE_ADMIN" ||
        this.state.role == "ROLE_MODERATOR" ? (
          <div className="col-3 col-s-11">
            <div className="mod-pane">
              <h2 className="blog-post-buttons">
                <MdOutlineSecurity /> Admin tools
              </h2>

              <div className="mod-admin-pane">
                <button
                  className="article-buttons mod-admin-button delete-article-btn"
                  onClick={() => this.deleteCurrentArticle(this.state.id)}
                >
                  <AiOutlineDelete /> Delete article
                  <div className="delete-article-message">
                    {this.state.deleteArticleMessage}
                  </div>
                </button>

                <button
                  className="article-buttons mod-admin-button update-article-btn"
                  onClick={() => this.showModal()}
                >
                  <GrUpdate /> Update article
                </button>
              </div>
            </div>
          </div>
        ) : (
          console.log("User cannot see this pane")
        )}

        <div className="article-portion col-8 col-s-11">
          <div className="article-area">
            <p className="article-text">{this.state.text}</p>
          </div>
        </div>

        <div className="col-3 col-s-11">
          <TopArticlesComponent />
        </div>

        <div className="most-commented-article col-11 col-s-11">
          <MostCommentedArticlesComponent />
        </div>

        <div className="col-8 col-s-11 ">
          <div className="conversations">
            <div className="above-article-comment">
              <h2>Conversations</h2>{" "}
              {this.state.role == "" ? (
                <Link className="sign-in-to-post" to="/sign-in">
                  Sign in to post
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>

          <ArticlePostsComponent id={this.state.id} />
        </div>

        <ArticleModal show={this.state.show} handleClose={this.hideModal}>
          <h3 className="create-article-modal-title">Update article</h3>
          <Form
            className=""
            onSubmit={this.updateCurrentArticle}
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

        <Modal show={this.state.showDeleteFail} handleClose={this.hideModal}>
          <p className="delete-fail">Can not delete someone else's article!</p>
        </Modal>
      </div>
    );
  }
}
