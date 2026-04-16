import mongoose from 'mongoose';
import logger from '../utils/logger';
export class connectDB {
  private DB_URL;
  constructor() {
    this.DB_URL = process.env.MONGO_URL || ' ';
  }
  public async connectDatabase(): Promise<void> {
    try {
      await mongoose.connect(this.DB_URL);
      logger.info('Database connected successfully');
    } catch (err: any) {
      logger.error('MongoDB connection failed', {
        error: err.message,
        stack: err.stack,
      });
      throw err;
    }
  }
}
