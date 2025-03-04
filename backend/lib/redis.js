import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

console.log('Attempting to connect to Redis...'); // Debug log

const redis = new Redis(process.env.UPSTASH_REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        console.log(`Retry attempt ${times}`); // Debug log
        if (times > 3) {
            console.error('Redis connection failed after 3 retries');
            return null;
        }
        return Math.min(times * 100, 3000);
    },
    connectTimeout: 10000,
    enableReadyCheck: true,
    showFriendlyErrorStack: true
});

redis.on('connect', () => {
    console.log('Redis Connected!');
});

redis.on('ready', () => {
    console.log('Redis Ready!');
});

redis.on('error', (err) => {
    console.error('Redis Error:', err);
});

redis.on('end', () => {
    console.log('Redis connection ended');
});

// Test connection and basic operations
const testRedisConnection = async () => {
    try {
        await redis.ping();
        console.log('Redis PING successful');
        
        // Test set operation
        const testKey = 'test:key';
        await redis.set(testKey, 'test value', 'EX', 60);
        console.log('Test key set successfully');
        
        const value = await redis.get(testKey);
        console.log('Test key retrieved:', value);
    } catch (err) {
        console.error('Redis test failed:', err);
    }
};

testRedisConnection();

export default redis;

