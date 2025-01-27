import {inject} from '@loopback/core';
import {get, param} from '@loopback/rest';
import {ExternalApiService} from '../services/external-api-service';

export class ExternalApiController {
  constructor(
    @inject('services.ExternalApiService')
    private externalApiService: ExternalApiService,
  ) {}

  @get('/posts')
  async fetchPosts() {
    return this.externalApiService.getPosts();
  }

  @get('/posts/{id}')
  async fetchPostById(@param.path.number('id') id: number) {
    return this.externalApiService.getPostById(id);
  }
}
