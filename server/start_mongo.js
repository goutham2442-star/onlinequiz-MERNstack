const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');

async function runLocalMongo() {
  const dbPath = path.join(__dirname, '..', 'data', 'db');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbPath: dbPath,
      storageEngine: 'wiredTiger',
    },
  });

  const uri = mongod.getUri();
  console.log(`✅ LOCAL MONGODB RUNNING at: ${uri}`);
  console.log(`Port: 27017`);
  console.log(`Persistent data directory: ${dbPath}`);

  // Keep process alive
  process.on('SIGINT', async () => {
    console.log('Shutting down MongoDB...');
    await mongod.stop();
    process.exit(0);
  });
}

runLocalMongo().catch(err => {
  console.error('Failed to start MongoDB server:', err);
  process.exit(1);
});
