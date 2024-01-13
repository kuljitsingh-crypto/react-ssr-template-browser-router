import React, { Component } from "react";
import {
  addDataToHttpStaticContextInServer,
  httpContext,
} from "../../context/HttpContext";
import { NamedLink } from "../../components";
import { routesName } from "../../utill/routesHelperFunction";
import css from "./NoFoundPage.module.css";
import { isBrowser } from "../../utill/browserHelperFunction";

export class NoFoundPage extends Component {
  static contextType = httpContext;

  render() {
    if (!isBrowser()) {
      // The StaticRouter component used in server side rendering
      // provides the context object. We attach a `notfound` flag to
      // the context to tell the server to change the response status
      // code into a 404.
      // using in render() instead contructor ensures that context.staticContext is exist.
      const ctx: Record<string, any> = this.context || {};
      addDataToHttpStaticContextInServer(ctx, { nofound: true });
    }
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
