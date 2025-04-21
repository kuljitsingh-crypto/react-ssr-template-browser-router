import React from "react";
import Page from "@src/components/Page/Page";
import { useIntl } from "react-intl";
import RightChild from "@src/components/RIghtChild/RightChild";

function About() {
  const intl = useIntl();
  const title = intl.formatMessage({ id: "About.title" });
  const description = intl.formatMessage({ id: "Homepage.description" });
  return (
    <Page description={description} metaTitle={title}>
      <RightChild>
        <div>About</div>
      </RightChild>
    </Page>
  );
}

export default About;
