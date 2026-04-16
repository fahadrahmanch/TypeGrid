import cron from 'node-cron';
import logger from '../../utils/logger';
import { CompanyUserStats } from '../db/models/company/company-user-stats.schema';

export const resetCompanyUserStats = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      await CompanyUserStats.updateMany({}, { $set: { weeklyScore: 0, monthlyScore: 0 } });
      logger.info('Company user stats reset successfully');
    } catch (error) {
      logger.error('Error resetting company user stats', error);
    }
  });
};
