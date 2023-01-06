const { Model } = require('objection');
const User = require('./User');

class products extends Model {
  static get tableName() {
    return 'products';
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

  static get productNameColumn() {
    return 'productName';
  };

  static get priceColumn() {
    return 'price';
  };
  static get qtyColumn() {
    return 'qty';
  };

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['productName', 'price', 'qty'],
      properties: {
        id: { type: 'integer' },
        productName: { type: 'string', minLength: 1, maxLength: 255 },
        brand: { type: 'string', minLength: 1, maxLength: 255 },
        model: { type: 'integer' },
        category: { type: 'string', minLength: 1, maxLength: 255 },
        color: { type: 'string', minLength: 1, maxLength: 255 },
        price: { type: 'integer' },
        qty: { type: 'integer' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    };
  };

  // static relationMappings = {
  //   products: {
  //     relation: Model.HasManyRelation,
  //     modelClass: User,
  //     join: {
  //       from: 'users.id',
  //       to: 'tickets.user_id'
  //     }
  //   }
  // };

};

module.exports = products;
