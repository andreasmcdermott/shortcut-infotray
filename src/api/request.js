const URL = "https://api.app.shortcut.com";
const TokenKey = "Shortcut-Token";

const withCache = (fn) => {
  let cacheKey = null;
  let cacheValue = null;

  return async (apiKey) => {
    if (cacheKey === apiKey) return cacheValue;

    const result = await fn(apiKey);
    cacheKey = apiKey;
    cacheValue = result;
    return result;
  };
};

export const fetchCurrentUser = withCache(async (apiKey) => {
  const res = await fetch(`${URL}/api/v3/member`, {
    headers: { [TokenKey]: apiKey },
  });
  const data = await res.json();
  return data;
});

const fetchWorkflowsAndStates = async (apiKey, workflows) => {
  const data = await Promise.all(
    Object.keys(workflows).map((workflowId) =>
      fetch(`${URL}/api/v3/workflows/${workflowId}`, {
        headers: { [TokenKey]: apiKey },
      }).then((res) => res.json())
    )
  );
  return data;
};

export const fetchActiveStories = async (apiKey) => {
  const user = await fetchCurrentUser(apiKey);
  const res = await fetch(
    `${URL}/api/v3/search/stories?page_size=25&query=${encodeURIComponent(
      `!is:archived !is:done owner:${user.mention_name}`
    )}`,
    {
      headers: { [TokenKey]: apiKey },
    }
  );
  const data = await res.json();
  const stories = data.data.sort((a, b) => a.name.localeCompare(b.name));
  const usedWorkflowsAndStates = stories
    .map((story) => [story.workflow_id, story.workflow_state_id])
    .reduce((acc, [workflowId, stateId]) => {
      if (!acc[workflowId]) acc[workflowId] = [];
      if (!acc[workflowId].includes(stateId)) acc[workflowId].push(stateId);
      return acc;
    }, {});
  const workflows = await fetchWorkflowsAndStates(
    apiKey,
    usedWorkflowsAndStates
  );
  stories.forEach((story) => {
    const workflow = workflows.find(
      (workflow) => workflow.id === story.workflow_id
    );
    const state = workflow.states.find(
      (state) => state.id === story.workflow_state_id
    );
    story.workflow = workflow;
    story.state = state;
  });
  return stories;
};
