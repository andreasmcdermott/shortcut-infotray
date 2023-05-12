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
  return data.data;
};

// 645ebb40-02f8-4351-8a56-6a12f3d3d490
