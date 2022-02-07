import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";

import SignInComponent from "./components/authentication/sign-in-component";
import SignUpComponent from "./components/authentication/sign-up-component";

import ArticleComponent from "./components/article/article-component";
import DashboardComponent from "./components/dashboard/dashboard";
import ProfileComponent from "./components/profile/profile-component";
import VerifyAccountComponent from "./components/authentication/verify-account-component";
import UpdateEmailComponent from "./components/settings/update-email-component";
import OtherUsersComponent from "./components/post/other-users-component";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          {/* Authentication/Verification */}
          <Route path="/sign-in" component={SignInComponent} />
          <Route path="/sign-up" component={SignUpComponent} />
          <Route path="/verify-account" component={VerifyAccountComponent} />
          <Route path="/change-email" component={UpdateEmailComponent} />

          {/* Article */}
          <Route path="/article/:id/:title" component={ArticleComponent} />

          {/* Dashboard */}
          <Route path="/dashboard" component={DashboardComponent} />


          {/* Profile */}
          <Route path="/profile" component={ProfileComponent} />

          <Route path="/user/:id" component={OtherUsersComponent} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
