// post/notifications.processor.ts
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  process(job: Job<{ postId: number }>): any {
    switch (job.name) {
      case 'notify-subscribers':
        console.log(
          `🔔 Processing background job: notified subscribers for post ID -> ${job.data.postId}`,
        );
        // Manually fail the job
        throw new Error('Manually failing this job');
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    console.log({
      jobId: job.id,
      name: job.name,
      message: error.message,
    });
  }
}
