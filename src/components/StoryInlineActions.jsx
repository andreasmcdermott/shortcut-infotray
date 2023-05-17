/** @jsxImportSource solid-js */

import { Link } from "./Link";

export const StoryInlineActions = (props) => {
  return (
    <div class="hover-action absolute h-100 bg-white ph2" style="right: 0;">
      <Link href={props.story.app_url}>Open</Link>
    </div>
  );
};
