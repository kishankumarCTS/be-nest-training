// post/notifications.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  process(job: Job<{ postId: number }>): any {
    switch (job.name) {
      case 'notify-subscribers':
        console.log(
          `🔔 Processing background job: notified subscribers for post ID -> ${job.data.postId}`,
        );
        break;
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }
}
