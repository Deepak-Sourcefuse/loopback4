import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'externalApi',
  connector: 'rest',
  baseURL: 'https://jsonplaceholder.typicode.com',
  crud: false,
  options: {
    headers: {
      accept: 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts',
      },
      functions: {
        getPosts: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: 'https://jsonplaceholder.typicode.com/posts/{id}',
      },
      functions: {
        getPostById: ['id'],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ExternalApiDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'externalApi';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.externalApi', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
