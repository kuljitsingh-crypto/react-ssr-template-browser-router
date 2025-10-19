module.exports.validateAndGetCurrentUserInfo = async (req) => {
  // your custom logic to validate current user
  // return current user Data or null
  return null;
};

module.exports.isCurrentUserAuthenticated = async (currentUser) => {
  // your custom logic to check authenticated status

  return currentUser !== null;
};

module.exports.fetchCustomConfig = async (req) => {
  // your custom logic that fetch configuration and send to frontend

  return {};
};
