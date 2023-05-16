import { Show, useContext, createContext } from "solid-js";
import { AuthScreen } from "./screens/AuthScreen";
import {
  fetchActiveStories,
  fetchCurrentIterations,
  fetchCurrentUser,
} from "./api/request";
import { createSignalWithLocalStorage } from "./utils/createSignalWithLocalStorage";
import { createResourceWithRefetch } from "./utils/createResourceWithRefetch";

const AppStateContext = createContext({
  apiKey: null,
  activeStories: [],
  currentIterations: [],
});

export function AppState(props) {
  const [apiKey, setApiKey] = createSignalWithLocalStorage("apiKey", null);

  const [user] = createResourceWithRefetch(apiKey, fetchCurrentUser);
  const [activeStories] = createResourceWithRefetch(
    () => user() && apiKey(),
    fetchActiveStories
  );
  const [currentIterations] = createResourceWithRefetch(
    () => user() && apiKey(),
    fetchCurrentIterations
  );

  return (
    <AppStateContext.Provider
      value={{ apiKey, activeStories, currentIterations }}
    >
      <Show when={apiKey()} fallback={<AuthScreen onSave={setApiKey} />}>
        {props.children}
      </Show>
    </AppStateContext.Provider>
  );
}

export const useApiKey = () => useContext(AppStateContext).apiKey();
export const useActiveStories = () => useContext(AppStateContext).activeStories;
export const useCurrentIterations = () =>
  useContext(AppStateContext).currentIterations;
