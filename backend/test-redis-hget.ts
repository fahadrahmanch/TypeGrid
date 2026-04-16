import Redis from 'ioredis';

const redis = new Redis();

(async () => {
  try {
    const key = 'my_test_key';
    await redis.hset(key, 'myfield', 'myval');

    // Pass undefined
    let field: any = undefined;
    console.log('Calling hget with field=', field);
    const result = await redis.hget(key, field);
  } catch (e: any) {
    console.log('Error caught:', e.message, '\ncommand:', e.command);
  }
  process.exit();
})();
