import { authenticate } from '@loopback/authentication';
import {get, param} from '@loopback/rest';
import axios from 'axios';
import { Role } from '../models/role.enum';
import { Roles } from '../decorator/role.decorator';

export class GatewayController {
  private orderServiceUrl: string;
  private productServiceUrl: string;
  private userServiceUrl: string;

  constructor() {
    this.orderServiceUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:5001';
    this.productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5002';
    this.userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:5003';
  }
  @authenticate('jwt')
  @Roles(Role.Admin, Role.SuperAdmin)
  @get('/combined-data/{orderId}') // To get {order, user, product}; 
  async getCombinedData(@param.path.number('orderId') orderId: number): Promise<object> {

    let order, product, user;

    try {
        const orderResponse = await axios.get(`${this.orderServiceUrl}/orders/${orderId}`);
        order = orderResponse.data;
      } catch (error) {
        console.error('Error fetching order:', error.message);
        throw error;
      }

    try {
        const productResponse = await axios.get(`${this.productServiceUrl}/products/${order.productId}`);
        product = productResponse.data;
      } catch (error) {
        console.error('Error fetching product:', error.message);
        throw error;
      }

      try {
        const userResponse = await axios.get(`${this.userServiceUrl}/users/${order.userId}`);
        user = userResponse.data;
      } catch (error) {
        console.error('Error fetching user:', error.message);
        throw error;
      }

    return {order, user, product};
  }
}