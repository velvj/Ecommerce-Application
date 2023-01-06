const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return 'users';
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
    static get usernameColumn() {
        return 'username';
    };
    static get passwordColumn() {
        return 'password';
    };
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                phone: { type: 'string' },
                password: { type: 'string' },
                role: { type: 'string' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' }

            }
        };
    }

}

module.exports = User;