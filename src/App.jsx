/** @jsxImportSource solid-js */

import { AppState } from "./AppState";
import { ErrorBoundary } from "solid-js";
import { StoryDashboard } from "./StoryDashboard";
import { IterationDashboard } from "./IterationDashboard";

export function App() {
  return (
    <ErrorBoundary
      fallback={(err) => (
        <div class="pa4 bg-washed-yellow">
          <strong>Error!</strong>
          <p>{err.message}</p>
          <pre style="word-break: always; line-break: anywhere; white-space: pre-wrap;">
            {JSON.stringify(err.stack, null, 2)}
          </pre>
        </div>
      )}
    >
      <div class="container pa3 flex flex-column g3">
        <AppState>
          <StoryDashboard />
          <IterationDashboard />
        </AppState>
      </div>
    </ErrorBoundary>
  );
}
