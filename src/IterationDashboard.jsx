import { Show } from "solid-js";

export const IterationDashboard = () => (
  <div class="flex flex-column g2">
    <Show when={true} fallback={<p>Loading...</p>}>
      <h2 class="pa0 ma0 f7 ttu tracked lh-solid">Current Iteration</h2>
      <div class="list ph2 pv1 ma0 bg-white br3 bb b--moon-gray">
        <span class="f6">Test</span>
      </div>
    </Show>
  </div>
);
