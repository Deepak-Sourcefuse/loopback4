import {
    Provider,
    Interceptor,
    InvocationContext,
    InvocationResult,
    inject,
    ValueOrPromise,
  } from '@loopback/core';
  
  export class LoggingInterceptor implements Provider<Interceptor> {
    intercept(
      context: InvocationContext,
      next: () => ValueOrPromise<InvocationResult>,
    ): ValueOrPromise<InvocationResult> {
      console.log(`Method: ${context.targetName} called with arguments:`, context.args);
  
      const startTime = Date.now();
      return next()
        .then((result:any) => {
          const elapsedTime = Date.now() - startTime;
          console.log(`Method: ${context.targetName} completed in ${elapsedTime}ms`);
          console.log(`Result:`, result);
          return result;
        })
        .catch((err:any) => {
          console.error(`Error in method: ${context.targetName}`, err);
          throw err;
        });
    }
    value(): Interceptor {
      console.log('LoggingInterceptor registered');
        return this.intercept.bind(this);
      }
  }
  