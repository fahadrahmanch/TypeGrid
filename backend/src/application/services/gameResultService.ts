import redis from "../../config/redis";

export const checkGameEndService = async (gameId: string) => {
  const key = `game:${gameId}`;
  const allPlayers = await redis.hgetall(key);
  const players = Object.values(allPlayers).map((p) => JSON.parse(p));
  const isComplete = players.every((item) => {
    return item.status != "PLAYING";
  });
  return isComplete;
  
};

export const checkQuickGameEndService = async (gameId: string) => {
  const key = `quick:game:${gameId}`
  const allPlayers = await redis.hgetall(key);
  const players = Object.values(allPlayers).map((p) => JSON.parse(p));
  const isComplete = players.every((item) => {
    return item.status != "PLAYING";
  });
  return isComplete;
  
};