// Central runtime configuration for the RewardSyncHQ Chrome extension.
// Change these values before packaging a build; no other extension file
// should hardcode an API or frontend URL.
globalThis.REWARDSYNC_CONFIG = Object.freeze({
  API_BASE_URL: 'https://b5g2sob5d0.execute-api.us-east-1.amazonaws.com/production/api',
  FRONTEND_URL: 'https://rewardsynchq.com',
});
