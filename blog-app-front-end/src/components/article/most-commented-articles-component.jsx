import React, { Component } from "react";
import ArticleService from "../../services/article-service";
import { withRouter } from "react-router-dom";
import AccountService from "../../services/account-service";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { BiComment } from "react-icons/bi";
import { AiOutlineComment } from "react-icons/ai";

class MostCommentedArticlesComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      role: "",
    };

    this.viewArticle = this.viewArticle.bind(this);
  }

  componentDidMount() {
    ArticleService.getMostCommentedArticles().then((response) => {
      this.setState({
        articles: response.data,
      });
    });

    AccountService.getCurrentUser().then((response) => {
      this.setState({
        role: this.state.role,
      });
    });
  }

  viewArticle = (aid, title) => {
    this.props.history.push(`/article/${aid}/${title}`);
    window.location.reload();
  };

  render() {
    return (
      <div className="" style={{}}>
        <Link to="/dashboard">
          <h2
            className="article-dashboard-text"
            style={{
              backgroundColor: "rgb(60, 61, 61)",
              padding: "5px",
              color: "white",
              textDecoration: "none",
            }}
          >
            <AiOutlineComment /> Most commented
          </h2>
        </Link>

        {this.state.articles.map((article) => (
          <div className="latest-blog-posts ">
            <div
              className="article-buttons"
              onClick={() => this.viewArticle(article[0], article[1])}
            >
              <div className="">
                <p className="most-commented-article-text">
                  <b>{article[1]}</b>
                </p>

                <div>
                  <p className="">{article[2].substring(0,10)}</p>
                </div>

                <p>
                  {" "}
                  By{" "}
                  <span style={{ color: "rgb(97, 97, 196)" }}>
                    {article[4]}
                  </span>
                </p>

                <p className="">
                  <BiComment />
                  <span style={{ color: "rgb(64, 91, 209)" }}>
                    {article[3]} comments
                  </span>
                </p>
              </div>
            </div>

            <div className="border" />
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(MostCommentedArticlesComponent);
