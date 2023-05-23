import {RateLimiter} from "limiter";
const MAX_REQUESTS_PER_MINUTE = 100;

export const limiter = new RateLimiter({
  tokensPerInterval: MAX_REQUESTS_PER_MINUTE,
  interval: "minute",
});