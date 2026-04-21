import cron from 'node-cron';
import { UserSubscription } from '../db/models/user/user.subscription.schema';
import { Company } from '../db/models/company/company.schema';
// Runs every day at midnight
cron.schedule('0 0 * * *', async () => {
  const now = new Date();

  await UserSubscription.updateMany(
    {
      endDate: { $lt: now },
      status: 'active',
    },
    {
      $set: { status: 'expired' },
    }
  );
  await Company.updateMany(
    {
      endDate: { $lt: now },
      status: 'active',
    },
    {
      $set: { status: 'expired' },
    }
  );

  console.log('Expired subscriptions updated');
});