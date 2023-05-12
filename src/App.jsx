import { AppState, useActiveStories } from "./AppState";
import { ErrorBoundary, Show } from "solid-js";

const ListOfStories = () => {
  const activeStories = useActiveStories();
  return (
    <div>
      <Show when={activeStories()} fallback={<p>Loading...</p>}>
        <ul>
          {activeStories().map((story) => (
            <li>{story.name}</li>
          ))}
        </ul>
      </Show>
    </div>
  );
};

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
      <div class="container">
        <AppState>
          <h1>Welcome to Shortcut!</h1>
          <ListOfStories />
        </AppState>
      </div>
    </ErrorBoundary>
  );
}
