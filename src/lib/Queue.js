import Bee from 'bee-queue';

import redisConfig from '../config/redis';

import NewDelivery from '../app/jobs/NewDelivery';
import CancelDelivery from '../app/jobs/CancelDelivery';

const jobs = [NewDelivery, CancelDelivery];

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
    jobs.forEach(({ key, handler }) => {
      const { bee } = this.queues[key];
      bee.on('failed', this.handlerFailure).process(handler);
    });
  }

  handlerFailure(err) {
    console.log(`QUEUE FAILED: ${err}`);
  }
}

export default new Queue();
