import { Show, createMemo } from "solid-js";
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
  const storiesByWorkflowAndState = createMemo(() =>
    (activeStories() || []).reduce((acc, story) => {
      if (!acc[story.workflow_id]) {
        acc[story.workflow_id] = {
          workflow: story.workflow,
          statesByType: [],
          storiesByState: {},
        };

        story.workflow.states.forEach((state) => {
          if (!acc[story.workflow_id].statesByType[state.type])
            acc[story.workflow_id].statesByType[state.type] = {
              numStories: 0,
              states: [],
            };
          acc[story.workflow_id].statesByType[state.type].states.push(state);
        });
      }
      if (!acc[story.workflow_id].storiesByState[story.workflow_state_id])
        acc[story.workflow_id].storiesByState[story.workflow_state_id] = {
          state: story.state,
          stories: [],
        };
      acc[story.workflow_id].storiesByState[
        story.workflow_state_id
      ].stories.push(story);
      acc[story.workflow_id].statesByType[story.state.type].numStories++;
      return acc;
    }, {})
  );

  return (
    <div class="flex flex-column g2">
      <Show when={activeStories()} fallback={<p>Loading...</p>}>
        <h2 class="pa0 ma0 f7 ttu tracked lh-solid">Active Stories</h2>
        <div class="flex flex-column g2">
          <For each={Object.values(storiesByWorkflowAndState())}>
            {({ workflow, statesByType, storiesByState }) => (
              <div class="flex flex-column g1">
                <h3 class="pa0 ma0 f7 lh-solid">{workflow.name}</h3>
                <div class="flex g1">
                  <For each={Object.entries(statesByType)}>
                    {([type, { states, numStories }]) => (
                      <div
                        class="flex g1 flex-auto pa1 br3 bg-light-gray"
                        style={`flex-grow: ${numStories}; min-width: 25px;`}
                      >
                        <For each={states}>
                          {(state) => (
                            <div
                              class={`flex g1 flex-auto flex-wrap bg-white br2 pa1 bb b--moon-gray`}
                              style={`flex-grow: ${
                                (storiesByState[state.id]?.stories || [])
                                  .length + 1
                              }; min-width: 25px; max-width: ${
                                states.length < 2 ? 100 : 50
                              }%`}
                            >
                              {/* <h4 class="pa0 ma0 f7 lh-solid">{state.name}</h4> */}
                              <For
                                each={storiesByState[state.id]?.stories || []}
                              >
                                {(story) => (
                                  <StoryTypeBadge type={story.story_type} />
                                )}
                              </For>
                            </div>
                          )}
                        </For>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>
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
