import React, { Component } from "react";
import { withRouter } from "react-router";
import AccountService from "../../services/account-service";

class MyPostsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      firstName: props.firstName,
      lastName: props.lastName,
      posts: [],
      articles: [],
    };

    this.visitArticle = this.visitArticle.bind(this);
  }

  async componentDidMount() {
    await AccountService.getAllArticlesFromUser(this.state.id).then((res) => {
      this.setState({
        articles: res.data,
      });
    });
  }

  visitArticle = (id, title) => {
    this.props.history.push(`/article/${id}/${title}`);
  };

  render() {
    return (
      <>
        <>
          <div className="col-5">
            <h3> Blog posts </h3>
            {this.state.articles.map((article) => (
              <div className="profile-pane my-articles">
                <div>
                  <div
                    onClick={() => {
                      this.visitArticle(article[0], article[1]);
                    }}
                  >
                    <p className="profile-pane-text">
                      <b>{article[1]}</b>
                    </p>
                    {article[2].substring(0,10)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </>
    );
  }
}

export default withRouter(MyPostsComponent);
