import redis from "ioredis"
import dotenv from "dotenv"
dotenv.config()
export const client = new redis("rediss://default:Aa_dAAIjcDEyMjJhMzI2N2NkOGE0YWZlOWY4ZGQyMzRmMjJiZmRlMnAxMA@firm-monkey-45021.upstash.io:6379");
await client.set('foo', 'bar');
//key value store

// await redis.set("foo","bar")
