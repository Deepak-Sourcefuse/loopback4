import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PgDataSource} from '../datasources';
import {Order, OrderRelations} from '../models';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {
  constructor(
    @inject('datasources.pg') dataSource: PgDataSource,
  ) {
    super(Order, dataSource);
  }
}
