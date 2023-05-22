import { createResource, onCleanup, onMount } from "solid-js";
import { MINUTES } from "./ms";

export const createResourceWithRefetch = (source, fetcher) => {
  const [data, { refetch }] = createResource(source, fetcher);
  let intervalId;

  onMount(() => {
    intervalId = setInterval(refetch, MINUTES(1));
  });

  onCleanup(() => {
    clearInterval(intervalId);
  });
  return [data, refetch];
};
