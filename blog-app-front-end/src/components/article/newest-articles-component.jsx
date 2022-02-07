import React, { Component } from "react";
import ArticleService from "../../services/article-service";
import { withRouter } from "react-router-dom";
import AccountService from "../../services/account-service";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { BiComment } from "react-icons/bi";
import CreateArticleComponent from "./create-articles-component";

class NewestArticlesComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      role: "",
    };
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);

    this.viewArticle = this.viewArticle.bind(this);
  }

  async componentDidMount() {
    await ArticleService.getNewestArticles().then((response) => {
      this.setState({
        articles: response.data,
      });

      for (var i = 0; i < this.state.articles.length; i++) {
        var obj = (this.state.articles[i][2] = this.state.articles[
          i
        ][2].substring(0, 10));
      }
    });

    await AccountService.getCurrentUser().then((response) => {
      this.setState({
        role: this.state.role,
      });
    });
  }

  viewArticle = (aid, title) => {
    this.props.history.push(`/article/${aid}/${title}`);
    window.location.reload();
  };

  rerenderParentCallback() {
    console.log("Parent component should update now...");

    ArticleService.getNewestArticles().then((response) => {
      this.setState({
        articles: response.data,
      });

      for (var i = 0; i < this.state.articles.length; i++) {
        var obj = (this.state.articles[i][2] = this.state.articles[
          i
        ][2].substring(0, 10));
      }
    });
    this.forceUpdate();
  }

  render() {
    return (
      <div className="">
        <CreateArticleComponent
          rerenderParentCallback={this.rerenderParentCallback}
        />

        <div
          style={{
            backgroundColor: "#f2f2f2",
            padding: "15px",
            borderRadius: "10px",
          }}
        >
          <Link to="/dashboard">
            <h2
              className="article-dashboard-text latest-blog-posts"
              style={{
                backgroundColor: "#666699",
                padding: 5,
                color: "white",
                textDecoration: "none",
              }}
            >
              Latest blog posts
            </h2>
          </Link>

          {this.state.articles.map((article) => (
            <div className="article-color-div">
              <div className="latest-blog-posts">
                <div
                  className="article-buttons"
                  onClick={() => this.viewArticle(article[0], article[1])}
                >
                  <div className="">
                    <p className="most-commented-article-text">
                      <b>{article[1]}</b>
                    </p>
                    <p className="">{article[2]}</p>
                    <p className="">
                      By{" "}
                      <span style={{ color: "rgb(97, 97, 196)" }}>
                        {" "}
                        {article[3]}
                      </span>
                    </p>
                    <p className="">
                      <BiComment />
                      <span style={{ color: "rgb(64, 91, 209)" }}>
                        {article[4]} comments
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(NewestArticlesComponent);
