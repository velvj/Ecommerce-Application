const { Model } = require('objection');
const User = require('./User');
const product = require('./product')

class order extends Model {
  static get tableName() {
    return 'orders';
  };
  static get idColumn() {
    return 'id';
  }
  $beforeInsert() {
    this.createdAt = new Date();
  };

  $beforeUpdate() {
    this.updatedAt = new Date();
  };

  static get customerIDColumn() {
    return 'customerID';
  };



  static get jsonSchema() {
    return {
      type: 'object',
      required: ['customerID'],
      properties: {
        id: { type: 'integer' },
        customerID: { type: 'integer' },
        orderItem: { type: 'integer' },
        shippingAddress: {
          type: 'object',
          properties: {
            street: { type: 'string' },
            city: { type: 'string' },
            zipCode: { type: 'string' }
          }
        },
        orderDate: { type: 'string' },
        isCancelled: { type: 'boolean' },
        totalAmount: { type: 'integer' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    };
  };

  static get relationMappings() {
    return {
      User: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'users.id',
          to: 'orders.customerID'
        }
      },
      product: {
        relation: Model.HasManyRelation,
        modelClass: product,
        join: {
          from: 'products.id',
          to: 'orders.orderItem'
        }
      }
    }
  };

}
module.exports = order;
