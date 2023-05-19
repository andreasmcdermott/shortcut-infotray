import { createResource, onCleanup, onMount } from "solid-js";

export const createResourceWithRefetch = (source, fetcher) => {
  const [data, { refetch }] = createResource(source, fetcher);
  let intervalId;

  onMount(() => {
    intervalId = setInterval(refetch, 30e5);
  });

  onCleanup(() => {
    clearInterval(intervalId);
  });
  return [data, refetch];
};
