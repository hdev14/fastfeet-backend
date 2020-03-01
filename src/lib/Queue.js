import Bee from 'bee-queue';

import redisConfig from '../config/redis';

import NewDelivery from '../app/jobs/NewDelevery';

const jobs = [NewDelivery];

class Queue {
  constructor() {
    this.queues = [];
    this.init();
  }

  init() {
    jobs.forEach(({ key }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig
        })
      };
    });
  }

  addJob(queue, data) {
    this.queues[queue].bee.createJob(data).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee } = this.queues[job.key];
      bee.on('failed', this.handlerFailure).process(job.handler);
    });
  }

  handlerFailure(err) {
    console.log(`QUEUE FAILED: ${err}`);
  }
}

export default new Queue();
