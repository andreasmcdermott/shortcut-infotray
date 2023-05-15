import { Show } from "solid-js";
import { useActiveStories } from "./AppState";
import { For } from "solid-js";

const StoryTypeBadge = (props) => (
  <span
    class={`${
      props.type === "feature"
        ? "bg-yellow b--gold"
        : props.type === "bug"
        ? "bg-light-red b--dark-red"
        : "bg-moon-gray b--gray"
    } br-100 flex-none ba`}
    style="width: 6px; height: 6px;"
  />
);
const StoryName = (props) => (
  <span class="flex-auto truncate">{props.children}</span>
);

export const StoryDashboard = () => {
  const activeStories = useActiveStories();
  return (
    <div class="flex flex-column g2">
      <Show when={activeStories?.()} fallback={<p>Loading...</p>}>
        <h2 class="pa0 ma0 f7 ttu tracked lh-solid">Active Stories</h2>
        <div class="flex bg-white br3 bb b--moon-gray pa2">
          <div>Col 1</div>
          <div>Col 2</div>
          <div>Col 3</div>
          <div>Col 4</div>
        </div>
        <ul class="list ph2 pv1 ma0 bg-white br3 bb b--moon-gray">
          <For each={activeStories()}>
            {(item) => (
              <li class="f6 flex pa0 ma0 g2 items-center mw-100 overflow-hidden ">
                <StoryTypeBadge type={item.story_type} />
                <StoryName>{item.name}</StoryName>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};
