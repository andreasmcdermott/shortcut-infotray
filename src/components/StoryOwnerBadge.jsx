/** @jsxImportSource solid-js */

import { Show } from "solid-js";
import { useApiKey } from "../AppState";

export const StoryOwnerBadge = (props) => (
  <span
    class={`flex-none br-100 ba b--light-silver relative overflow-hidden ${
      props.owner ? "" : "bg-light-gray"
    }`}
    style={`width: 14px; height: 14px; ${
      props.highlight ? "transform: scale(1.5);" : ""
    }`}
    onMouseEnter={props.onMouseEnter}
    onMouseLeave={props.onMouseLeave}
  >
    <Show when={props.owners?.[0]?.profile?.display_icon?.url}>
      <img
        class="w-100 h-100 absolute"
        src={`${
          props.owners?.[0]?.profile?.display_icon?.url
        }?token=${useApiKey()}`}
        alt={props.owners?.[0]?.profile?.name}
      />
    </Show>
  </span>
);
