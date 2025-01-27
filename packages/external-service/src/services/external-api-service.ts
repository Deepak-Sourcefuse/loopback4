import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {ExternalApiDataSource} from '../datasources';

export interface ExternalApiService {
  getPosts(): Promise<object[]>;
  getPostById(id: number): Promise<object>;
}

export class ExternalApiServiceProvider implements Provider<ExternalApiService> {
  constructor(
    // externalApi must match the name property in the datasource json file
    @inject('datasources.externalApi')
    protected dataSource: ExternalApiDataSource = new ExternalApiDataSource(),
  ) {}

  value(): Promise<ExternalApiService> {
    return getService(this.dataSource);
  }
}
