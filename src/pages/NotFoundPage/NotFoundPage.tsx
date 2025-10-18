import React, { Component } from "react";
import { NamedLink } from "@src/components";
import css from "./NotFoundPage.module.css";
import { routesName } from "@src/routeNames";

type Props = {
  staticContext?: Record<string, any>;

  //  staticContext.notFound = restRoute.notFound;
};

export class NoFoundPage extends Component<Props, any> {
  render() {
    const { staticContext } = this.props;
    if (staticContext) {
      staticContext.notFound = true;
    }

    return (
      <div className={css.root}>
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
