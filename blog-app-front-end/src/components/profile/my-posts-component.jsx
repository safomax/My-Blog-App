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

    let date = new Date();

    console.log(date);

    for (var i = 0; i < this.state.articles.length; i++) {
      var obj = (this.state.articles[i][2] = this.state.articles[
        i
      ][2].substring(0, 10));
    }
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
                    {article[2]}
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
