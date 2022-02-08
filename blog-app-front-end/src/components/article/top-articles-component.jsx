import React, { Component } from "react";
import ArticleService from "../../services/article-service";
import { withRouter } from "react-router-dom";
import AccountService from "../../services/account-service";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import { RiArticleLine } from "react-icons/ri";

class TopArticlesComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      articles: [],
      role: "",
      i: 0,
    };

    this.viewArticle = this.viewArticle.bind(this);
    this.incrementI = this.incrementI.bind(this);
  }

  async componentDidMount() {
    await ArticleService.getNewestArticles().then((response) => {
      this.setState({
        articles: response.data,
      });
    });

    for (var i = 0; i < this.state.articles.length; i++) {

      this.state.articles[i][2] = this.state.articles[i][2].substring(0, 10);
    }

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

  incrementI = () => {
    this.setState({ i: this.state.i + 1 });
  };

  render() {
    return (
      <div className="articles-pane right">
        <Link to="/dashboard">
          <h2 className="blog-post-buttons">
            <RiArticleLine />
            Latest blog posts
          </h2>
        </Link>
        {this.state.articles.map((article, i) => (
          <h3
            className=""
            onClick={() => this.viewArticle(article[0], article[1])}
          >
            <div className="article-buttons-2">
              <span className="top-article-counter">{i + 1}</span> {article[1]}{" "}
            </div>
          </h3>
        ))}
      </div>
    );
  }
}

export default withRouter(TopArticlesComponent);
