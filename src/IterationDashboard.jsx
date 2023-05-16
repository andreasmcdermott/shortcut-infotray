import { Show, createSignal } from "solid-js";
import { useApiKey, useCurrentIterations } from "./AppState";

const StoryOwnerBadge = (props) => (
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
const StoryName = (props) => (
  <span class="flex-auto truncate">{props.children}</span>
);

export const IterationDashboard = () => {
  const currentIterations = useCurrentIterations();
  const apiKey = useApiKey();
  const [stateName, setStateName] = createSignal({});

  return (
    <div class="flex flex-column g2">
      <Show when={currentIterations()} fallback={<p>Loading...</p>}>
        <h2 class="pa0 ma0 f7 ttu tracked lh-solid">Current Iteration</h2>
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
                  <h3 class="pa0 ma0 f7 lh-solid flex items-center g2">
                    <Show when={iteration.team?.display_icon?.url}>
                      <img
                        class="flex-none w1 h1 br-100 ba b--moon-gray"
                        src={`${iteration.team.display_icon.url}?token=${apiKey}`}
                        alt=""
                      />
                    </Show>
                    <span>{iteration.name}</span>
                    <span class="normal">
                      {iteration.start_date} &#8212; {iteration.end_date}
                    </span>
                    <a
                      style="margin-left: auto;"
                      href={iteration.app_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open
                    </a>
                  </h3>
                  <Show when={num_stories > 0}>
                    <div
                      class="w-100 br3 bg-moon-gray flex"
                      style="height: 4px;"
                    >
                      <div
                        class="bg-dark-green br3"
                        style={`height: 4px; width: ${
                          (iteration.stats.num_stories_done / num_stories) * 100
                        }%;`}
                      />
                      <div
                        class="bg-green br3"
                        style={`height: 4px; width: ${
                          (iteration.stats.num_stories_started / num_stories) *
                          100
                        }%;`}
                      />
                    </div>
                    <For each={Object.values(storiesByWorkflowAndState)}>
                      {({ workflow, statesByType, storiesByState }) => (
                        <div class="flex flex-column g1">
                          <h3 class="pa0 ma0 f7 lh-solid">
                            {workflow.name}
                            <Show
                              when={stateName().workflow_id === workflow.id}
                            >
                              <span class="normal ml2">
                                {stateName().state_name}
                              </span>
                            </Show>
                          </h3>
                          <div class="flex g1">
                            <For each={Object.entries(statesByType)}>
                              {([, { states, numStories }]) => (
                                <div
                                  class={`flex g1 ${
                                    numStories ? "flex-auto" : "flex-none"
                                  } pa1 br3 bg-light-gray`}
                                  style={`flex-grow: ${numStories}; min-width: 15px;`}
                                >
                                  <For each={states}>
                                    {(state) => (
                                      <div
                                        onMouseEnter={() =>
                                          setStateName({
                                            workflow_id: workflow.id,
                                            state_name: state.name,
                                          })
                                        }
                                        onMouseLeave={() => setStateName({})}
                                        class={`flex g1 ${
                                          storiesByState[state.id]?.stories
                                            ?.length
                                            ? "flex-auto"
                                            : "flex-none"
                                        } flex-wrap bg-white br2 pa1 bb b--moon-gray`}
                                        style={`flex-grow: ${
                                          (
                                            storiesByState[state.id]?.stories ||
                                            []
                                          ).length + 1
                                        }; min-width: 15px; max-width: ${
                                          states.length < 2 ? 100 : 50
                                        }%`}
                                      >
                                        <For
                                          each={
                                            storiesByState[state.id]?.stories ||
                                            []
                                          }
                                        >
                                          {(story) => (
                                            <StoryOwnerBadge
                                              owners={story.owners}
                                            />
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
