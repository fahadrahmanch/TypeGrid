import mongoose from 'mongoose';

const testId = new mongoose.Types.ObjectId().toHexString();

const pipeline = [
  { $match: { companyId: testId } },
  { $group: { _id: null, avgWpm: { $avg: '$wpm' } } }
];

const convertIds = (obj: any) => {
  if (Array.isArray(obj)) {
    obj.forEach(convertIds);
  } else if (obj !== null && typeof obj === 'object') {
    if (obj instanceof Date || obj instanceof mongoose.Types.ObjectId) {
      return; // Skip Date and ObjectId native instances
    }
    for (const key in obj) {
      const val = obj[key];
      // Debug logging
      console.log(`Checking key: ${key}, value: ${val}`);
      
      if (typeof val === 'string' && mongoose.Types.ObjectId.isValid(val) && val.length === 24) {
        console.log(`Matched criteria for ${key}, endsWith Id: ${key.endsWith('Id')}`);
        if (key.endsWith('Id') || key === '_id') {
          obj[key] = new mongoose.Types.ObjectId(val);
          console.log(`Converted ${key} successfully`);
        }
      } else if (typeof val === 'object') {
        convertIds(val);
      }
    }
  }
};

convertIds(pipeline);
console.log(JSON.stringify(pipeline, null, 2));
