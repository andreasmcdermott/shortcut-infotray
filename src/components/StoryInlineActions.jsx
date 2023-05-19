/** @jsxImportSource solid-js */

import { InlineActions } from "./InlineActions";
import { Link } from "./Link";

export const StoryInlineActions = (props) => {
  return (
    <InlineActions bg="white">
      <Link href={props.story.app_url}>Open</Link>
    </InlineActions>
  );
};
