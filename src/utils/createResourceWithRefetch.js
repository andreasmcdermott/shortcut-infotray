import { createResource } from "solid-js";

export const createResourceWithRefetch = (source, fetcher) => {
  const [data, { refetch }] = createResource(source, fetcher);

  return [data, refetch];
};
