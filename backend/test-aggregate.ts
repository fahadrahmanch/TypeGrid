import mongoose from 'mongoose';
import { CompanyUserStats } from './src/infrastructure/db/models/company/company-user-stats.schema';
import { BaseRepository } from './src/infrastructure/db/base/base.repository';

// mock env or mock connection
async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/typegrid');
  
  const repo = new BaseRepository(CompanyUserStats, (d:any) => d);
  
  // Try the raw aggregation with a fake string ID
  const testId = new mongoose.Types.ObjectId().toHexString();
  
  const pipeline = [
    { $match: { companyId: testId } },
    { $group: { _id: null, avgWpm: { $avg: '$wpm' } } }
  ];
  
  console.log("Before aggregate:", JSON.stringify(pipeline, null, 2));
  await repo.aggregate(pipeline);
  console.log("After aggregate mutation:", JSON.stringify(pipeline, null, 2));
  
  mongoose.disconnect();
}
run();
