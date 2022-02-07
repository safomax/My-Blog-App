import React, { Component } from "react";
import ArticleService from "../../services/article-service";
import { withRouter } from "react-router-dom";
import AccountService from "../../services/account-service";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

class ListArticlesComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      role: "",
    };

    this.viewArticle = this.viewArticle.bind(this);
  }

  componentDidMount() {
    ArticleService.getArticles().then((response) => {
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
    const receivedArticleName = encodeURIComponent(title);

    this.props.history.push(`/article/${aid}/${receivedArticleName}`);
    window.location.reload();
  };

  render() {
    return (
      <div className="">
        <Link to="/dashboard">
          <h2 className=" ">Blog posts</h2>
        </Link>

        {this.state.articles.map((article) => (
          <div className="latest-blog-posts">
            <div
              className="article-buttons"
              onClick={() => this.viewArticle(article.id, article.title)}
            >
              <div className="">
                <p className="">{article.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default withRouter(ListArticlesComponent);
