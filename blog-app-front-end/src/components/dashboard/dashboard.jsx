import React, { Component } from "react";
import NavigationComponent from "../navigation/navigation-component";
import MostCommentedArticlesComponent from "../article/most-commented-articles-component";
import NewestArticlesComponent from "../article/newest-articles-component";

export default class DashboardComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="">
        <NavigationComponent />

        <div className="list-articles col-8 col-s-11">
          <NewestArticlesComponent />
        </div>

        <div className="list-articles col-3 col-s-11">
          <MostCommentedArticlesComponent />
        </div>
      </div>
    );
  }
}
