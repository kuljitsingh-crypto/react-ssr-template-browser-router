import React, { Component } from "react";
import { NamedLink } from "../../components";
import { routesName } from "../../utill/routesHelperFunction";
import css from "./NoFoundPage.module.css";

export class NoFoundPage extends Component {
  render() {
    return (
      <div className={css.root}>
        {" "}
        <h1>Oops!</h1>
        <p>Sorry, looks like this url doest not exist!</p>
        <p>
          <NamedLink name={routesName.Homepage}>Redirect To Home</NamedLink>
        </p>
      </div>
    );
  }
}

export default NoFoundPage;
