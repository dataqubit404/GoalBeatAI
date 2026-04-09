// GoalBeat AI — Live Match Service
const api = require("./footballApi");

module.exports = {
  async getLiveMatches() {
    try {
      const data = await api.getLiveFixtures();
      return data?.response || [];
    } catch (e) {
      return [];
    }
  },
};
