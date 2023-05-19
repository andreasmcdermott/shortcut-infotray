/** @jsxImportSource solid-js */

import { For, Show, createMemo, createSignal } from "solid-js";
import { useActiveStories } from "./AppState";
import { StoryTypeBadge } from "./components/StoryTypeBadge";
import { StoryName } from "./components/StoryName";
import { StoryInlineActions } from "./components/StoryInlineActions";
import { MiniKanban } from "./components/MiniKanban";
import { SectionTitle } from "./components/SectionTitle";

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

  const [currentStory, setCurrentStory] = createSignal(null);

  return (
    <div class="flex flex-column g2">
      <Show when={activeStories()} fallback={<p>Loading...</p>}>
        <SectionTitle>Active Stories</SectionTitle>
        <div class="flex flex-column g2">
          <For each={Object.values(storiesByWorkflowAndState())}>
            {({ workflow, statesByType, storiesByState }) => (
              <MiniKanban
                workflowName={workflow.name}
                states={Object.values(statesByType)}
              >
                {(state) => (
                  <For each={storiesByState[state.id]?.stories || []}>
                    {(story) => (
                      <StoryTypeBadge
                        type={story.story_type}
                        highlight={story.id === currentStory()}
                        onMouseEnter={() => setCurrentStory(story.id)}
                        onMouseLeave={() => setCurrentStory(null)}
                      />
                    )}
                  </For>
                )}
              </MiniKanban>
            )}
          </For>
        </div>

        <ul class="list ph0 pv1 ma0 bg-white br3 bb b--moon-gray ">
          <For each={activeStories()}>
            {(story) => (
              <li
                class="f5 flex pa0 ma0 ph2 g2 items-center mw-100 relative overflow-hidden"
                onMouseEnter={() => {
                  setCurrentStory(story.id);
                }}
                onMouseLeave={() => {
                  setCurrentStory(null);
                }}
              >
                <StoryTypeBadge
                  type={story.story_type}
                  highlight={story.id === currentStory()}
                />
                <StoryName>{story.name}</StoryName>
                <StoryInlineActions story={story} />
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};
