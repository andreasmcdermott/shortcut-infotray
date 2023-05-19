/** @jsxImportSource solid-js */

import { Show } from "solid-js";
import { Link } from "./Link";
import { useApiKey } from "../AppState";
import { InlineActions } from "./InlineActions";

export const IterationHeader = (props) => {
  const apiKey = useApiKey();

  return (
    <h3 class="pa0 ma0 f6 lh-solid flex items-center g2 relative">
      <Show when={props.iteration.team?.display_icon?.url}>
        <img
          class="flex-none w1 h1 br-100 ba b--moon-gray"
          src={`${props.iteration.team.display_icon.url}?token=${apiKey}`}
          alt=""
        />
      </Show>
      <span>{props.iteration.name}</span>
      <span class="normal">
        {props.iteration.start_date} &#8212; {props.iteration.end_date}
      </span>
      <InlineActions>
        <Link href={props.iteration.app_url}>Open</Link>
      </InlineActions>
    </h3>
  );
};
