import {
  Show,
  useContext,
  onMount,
  createContext,
  createResource,
  createSignal,
  createEffect,
} from "solid-js";
import { AuthScreen } from "./screens/AuthScreen";
import { fetchActiveStories, fetchCurrentUser } from "./api/request";

const AppStateContext = createContext({});

export function AppState(props) {
  const [ready, setReady] = createSignal(false);
  const [apiKey, setApiKey] = createSignal(null);

  onMount(() => {
    const storedApiKey = localStorage.getItem("apiKey");
    setApiKey(storedApiKey);
    setReady(true);
  });

  createEffect(() => {
    if (apiKey()) {
      localStorage.setItem("apiKey", apiKey());
    }
  });

  const [user] = createResource(apiKey, fetchCurrentUser);
  const [activeStories] = createResource(
    () => user() && apiKey(),
    fetchActiveStories
  );

  return (
    <AppStateContext.Provider value={{ activeStories }}>
      <Show when={ready}>
        <Show
          when={() => state.apiKey}
          fallback={<AuthScreen onSave={setApiKey} />}
        >
          {props.children}
        </Show>
      </Show>
    </AppStateContext.Provider>
  );
}

export const useActiveStories = () => useContext(AppStateContext).activeStories;
