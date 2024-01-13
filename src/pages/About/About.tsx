import React from "react";
import Page from "../../components/helperComponents/Page";
import { useIntl } from "react-intl";

function About() {
  const intl = useIntl();
  const title = intl.formatMessage({ id: "About.title" });
  const description = intl.formatMessage({ id: "Homepage.description" });
  return (
    <Page description={description} metaTitle={title}>
      <div>About</div>
    </Page>
  );
}

export default About;
