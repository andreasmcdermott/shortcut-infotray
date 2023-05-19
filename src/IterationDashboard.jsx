/** @jsxImportSource solid-js */

import { Show, For } from "solid-js";
import { useApiKey, useCurrentIterations } from "./AppState";
import { ProgressBar } from "./components/ProgressBar";
import { StoryOwnerBadge } from "./components/StoryOwnerBadge";
import { Link } from "./components/Link";
import { MiniKanban } from "./components/MiniKanban";
import { SectionTitle } from "./components/SectionTitle";
import { IterationHeader } from "./components/IterationHeader";

export const IterationDashboard = () => {
  const currentIterations = useCurrentIterations();
  const apiKey = useApiKey();

  return (
    <div class="flex flex-column g2">
      <Show when={currentIterations()} fallback={<p>Loading...</p>}>
        <SectionTitle>Current Iteration</SectionTitle>
        <div class="flex flex-column g2">
          <For each={currentIterations()}>
            {(iteration) => {
              const num_stories =
                iteration.stats.num_stories_started +
                iteration.stats.num_stories_unstarted +
                iteration.stats.num_stories_backlog +
                iteration.stats.num_stories_done;

              const storiesByWorkflowAndState = (
                iteration.stories || []
              ).reduce((acc, story) => {
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
                    acc[story.workflow_id].statesByType[state.type].states.push(
                      state
                    );
                  });
                }
                if (
                  !acc[story.workflow_id].storiesByState[
                    story.workflow_state_id
                  ]
                )
                  acc[story.workflow_id].storiesByState[
                    story.workflow_state_id
                  ] = {
                    state: story.state,
                    stories: [],
                  };
                acc[story.workflow_id].storiesByState[
                  story.workflow_state_id
                ].stories.push(story);
                acc[story.workflow_id].statesByType[story.state.type]
                  .numStories++;
                return acc;
              }, {});

              return (
                <div class="flex flex-column g2">
                  <IterationHeader iteration={iteration} />

                  <Show when={num_stories > 0}>
                    <ProgressBar
                      numStories={num_stories}
                      numDone={iteration.stats.num_stories_done}
                      numInProgress={iteration.stats.num_stories_started}
                    />
                    <For each={Object.values(storiesByWorkflowAndState)}>
                      {({ workflow, statesByType, storiesByState }) => (
                        <MiniKanban
                          workflowName={workflow.name}
                          states={Object.values(statesByType)}
                        >
                          {(state) => (
                            <For each={storiesByState[state.id]?.stories || []}>
                              {(story) => (
                                <StoryOwnerBadge owners={story.owners} />
                              )}
                            </For>
                          )}
                        </MiniKanban>
                      )}
                    </For>
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </div>
  );
};
