import { Show, useContext, createContext } from "solid-js";
import { AuthScreen } from "./screens/AuthScreen";
import { fetchActiveStories, fetchCurrentUser } from "./api/request";
import { createSignalWithLocalStorage } from "./utils/createSignalWithLocalStorage";
import { createResourceWithRefetch } from "./utils/createResourceWithRefetch";

const AppStateContext = createContext({ activeStories: [] });

export function AppState(props) {
  const [apiKey, setApiKey] = createSignalWithLocalStorage("apiKey", null);

  const [user] = createResourceWithRefetch(apiKey, fetchCurrentUser);
  const [activeStories] = createResourceWithRefetch(
    () => user() && apiKey(),
    fetchActiveStories
  );

  return (
    <AppStateContext.Provider value={{ activeStories }}>
      <Show when={apiKey} fallback={<AuthScreen onSave={setApiKey} />}>
        {props.children}
      </Show>
    </AppStateContext.Provider>
  );
}

export const useActiveStories = () => useContext(AppStateContext).activeStories;
