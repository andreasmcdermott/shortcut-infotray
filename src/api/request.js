const URL = "https://api.app.shortcut.com";
const TokenKey = "Shortcut-Token";

export const request = async (apiKey, url) => {
  const res = await fetch(`${URL}/api/v3/${url}`, {
    headers: { [TokenKey]: apiKey },
  });
  const data = await res.json();
  return data;
};

const toCacheKey = (args) => {
  return args.map((arg) => JSON.stringify(arg)).join("-");
};

const withSingleCache = (fn) => {
  let cacheKey = null;
  let cacheValue = null;

  return async (...args) => {
    const key = toCacheKey(args);
    if (cacheKey === key) return cacheValue;

    const result = await fn(...args);
    cacheKey = key;
    cacheValue = result;
    return result;
  };
};

const withExpiringCache = (fn, maxAge = 36e5) => {
  const cache = new Map();
  return async (...args) => {
    const key = toCacheKey(args);
    const cacheItem = cache.get(key);
    if (cacheItem && cacheItem.expiresAt > Date.now()) return cacheItem.value;

    const result = await fn(...args);
    cache.set(key, { value: result, expiresAt: Date.now() + maxAge });
    return result;
  };
};

export const fetchCurrentUser = withSingleCache(async (apiKey) => {
  const { id } = await request(apiKey, `member`);
  const data = await request(apiKey, `members/${id}`);
  return data;
});

const fetchWorkflowsAndStates = withExpiringCache(async (apiKey, workflows) => {
  const data = await Promise.all(
    Object.keys(workflows).map((workflowId) =>
      request(apiKey, `workflows/${workflowId}`)
    )
  );
  return data;
});

export const fetchOwners = withExpiringCache(async (apiKey, ownerIds) => {
  if (!ownerIds.length) return [];
  const uniqueOwnerIds = [...new Set(ownerIds)];
  const owners = await Promise.all(
    uniqueOwnerIds.map((id) => request(apiKey, `members/${id}`))
  );
  return owners;
});

export const fetchGroups = withExpiringCache(async (apiKey, groupIds) => {
  if (!groupIds.length) return [];
  const groups = await Promise.all(
    groupIds.map((groupId) => request(apiKey, `groups/${groupId}`))
  );
  return groups.filter((group) => !group.archived);
});

export const fetchActiveStories = async (apiKey) => {
  const user = await fetchCurrentUser(apiKey);
  const data = await request(
    apiKey,
    `search/stories?page_size=25&query=${encodeURIComponent(
      `!is:archived !is:done owner:${user.profile.mention_name}`
    )}`
  );
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

export const fetchCurrentIterations = async (apiKey) => {
  const user = await fetchCurrentUser(apiKey);
  const groups = await fetchGroups(apiKey, user.group_ids);
  const activeIterationsPerTeam = await Promise.all(
    groups.map(async (group) => {
      const result = await request(
        apiKey,
        `search/iterations?page_size=25&query=${encodeURIComponent(
          `team:${group.mention_name}`
        )}`
      );
      result.team = group;
      return result;
    })
  );
  const currentIterations = activeIterationsPerTeam.reduce(
    (acc, { data: iterations, team }) => {
      const currentIteration = iterations.find((it) => it.status === "started");
      if (currentIteration) {
        currentIteration.team = team;
        acc.push(currentIteration);
      }
      return acc;
    },
    []
  );
  for (const it of currentIterations) {
    const stories = await request(apiKey, `iterations/${it.id}/stories`);
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
    const ownerIds = stories.flatMap((story) => story.owner_ids);
    const owners = await fetchOwners(apiKey, ownerIds);

    stories.forEach((story) => {
      const workflow = workflows.find(
        (workflow) => workflow.id === story.workflow_id
      );
      const state = workflow.states.find(
        (state) => state.id === story.workflow_state_id
      );
      story.workflow = workflow;
      story.state = state;
      story.owners = owners.filter((owner) =>
        story.owner_ids.includes(owner.id)
      );
    });
    it.stories = stories;
    console.log(stories);
  }
  return currentIterations;
};
