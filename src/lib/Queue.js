import Bee from 'bee-queue';

import redisConfig from '../config/redis';

import NewDelivery from '../app/jobs/NewDelevery';

const jobs = [NewDelivery];

class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  init() {
    jobs.forEach(({ key, handler }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig
        }),
        handler
      };
    });
  }

  add(queue, data) {
    this.queues[queue].createJob(data).save();
  }

  processJobs() {
    this.queues.forEach(({ bee, handler }) => {
      bee.process(handler);
    });
  }
}

export default new Queue();
