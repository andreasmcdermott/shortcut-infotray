/** @jsxImportSource solid-js */

import { For, Show, createMemo, createSignal } from "solid-js";
import { useActiveStories } from "./AppState";
import { StoryTypeBadge } from "./components/StoryTypeBadge";
import { StoryName } from "./components/StoryName";
import { StoryInlineActions } from "./components/StoryInlineActions";
import { MiniKanban } from "./components/MiniKanban";
import { SectionTitle } from "./components/SectionTitle";

const orderOfStates = { backlog: 0, unstarted: 1, started: 2, done: 3 };

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

  const storiesByStateType = createMemo(() =>
    (activeStories() || []).reduce(
      (acc, story) => {
        acc[orderOfStates[story.state.type]].push(story);
        return acc;
      },
      [[], [], [], []]
    )
  );

  const [currentStory, setCurrentStory] = createSignal(null);

  const highlightStory = (storyId, scrollTo = false) => {
    setCurrentStory(storyId);
    if (scrollTo && storyId) {
      const storyEl = document.body.querySelector(
        `[data-active-stories] [data-story-id="${storyId}"]`
      );
      if (
        storyEl &&
        storyEl.previousElementSibling &&
        storyEl.previousElementSibling.matches("[data-story-id]")
      ) {
        storyEl.previousElementSibling.scrollIntoView();
      } else if (storyEl && storyEl.parentElement) {
        storyEl.parentElement.scrollTo(0, 0);
      }
    }
  };

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
                        onMouseEnter={() => highlightStory(story.id, true)}
                        onMouseLeave={() => highlightStory(null)}
                      />
                    )}
                  </For>
                )}
              </MiniKanban>
            )}
          </For>
        </div>

        <div class="pv1 bg-white br3 bb b--moon-gray">
          <ul
            data-active-stories
            class="list pa0 ma0 flex flex-column"
            style="max-height: 140px; overflow-y: auto;"
          >
            <For each={storiesByStateType().filter((s) => s.length)}>
              {(stories) => (
                <>
                  <strong
                    class="ph2 ttc bg-white"
                    style="position: sticky; top: 0; z-index: 2; display: block;"
                  >
                    {stories[0].state.type}
                  </strong>
                  <For each={stories}>
                    {(story) => (
                      <li data-story-id={story.id}>
                        <div
                          class="f5 flex pa0 ma0 ph2 g2 items-center mw-100 relative overflow-hidden"
                          onMouseEnter={() => {
                            highlightStory(story.id);
                          }}
                          onMouseLeave={() => {
                            highlightStory(null);
                          }}
                        >
                          <StoryTypeBadge
                            type={story.story_type}
                            highlight={story.id === currentStory()}
                          />
                          <StoryName>{story.name}</StoryName>
                          <StoryInlineActions story={story} />
                        </div>
                      </li>
                    )}
                  </For>
                </>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  );
};
