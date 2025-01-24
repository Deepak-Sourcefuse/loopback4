import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {AuthenticationComponent} from '@loopback/authentication';
import {JWTStrategy} from './strategies/jwt.strategy';
import {JWTService,TokenServiceBindings,JWTAuthenticationComponent} from '@loopback/authentication-jwt';
import {BindingKey} from '@loopback/core';
import {AuthorizationInterceptor} from './interceptor/authorization.interceptor';
import {LoggingInterceptor} from './interceptor/logging.interceptor';

export const JWT_SECRET = BindingKey.create<string>('authentication.jwt.secret');

export {ApplicationConfig};

export class GatewayServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    //
    this.bind('services.JWTService').toClass(JWTService);
    this.bind('authentication.strategies.jwt').toClass(JWTStrategy);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to('your-secret-key');
    this.interceptor(AuthorizationInterceptor,{
      global: true,
      group: 'authorization',
    })
    this.interceptor(LoggingInterceptor, {
      global: true,
      group: 'logging',
    });
    
    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
