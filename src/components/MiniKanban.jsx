/** @jsxImportSource solid-js */

import { createSignal } from "solid-js";
import { For } from "solid-js";
import { Show } from "solid-js";

export const MiniKanban = (props) => {
  const [activeState, setActiveState] = createSignal("");
  return (
    <div class="flex flex-column g1">
      <h3 class="pa0 ma0  normal lh-solid f6">
        <span class="ttu tracked f7">{props.workflowName}</span>
        <Show when={activeState()}>
          <span class="normal ml2">{activeState()}</span>
        </Show>
      </h3>
      <div class="flex g1 overflow-hidden w-100">
        <For each={props.states}>
          {({ states, numStories }) => (
            <div
              class={`overflow-hidden flex-auto flex g1 pa1 br3 ${
                states[0].type === "backlog"
                  ? "bg-light-gray"
                  : states[0].type === "unstarted"
                  ? "bg-light-gray"
                  : states[0].type === "started"
                  ? "bg-light-green"
                  : "bg-green"
              }`}
              style={`min-width: ${28 * states.length}px;`}
            >
              <For each={states}>
                {(state) => (
                  <div
                    onMouseEnter={() => setActiveState(state.name)}
                    onMouseLeave={() => setActiveState("")}
                    class={`flex g1 ${
                      numStories ? "flex-auto" : "flex-none"
                    } flex-wrap bg-white br2 pa1`}
                    style={`flex-grow: ${
                      numStories + 1
                    }; min-width: 20px; max-width: ${
                      states.length < 2 ? 100 : 50
                    }% ${numStories === 0 ? "width: 20px;" : "width: auto;"}`}
                  >
                    {props.children(state)}
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
