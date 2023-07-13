const sequelize = require('sequelize');
const { DataTypes } = sequelize;

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {

      await queryInterface.createTable('member', {
        member_id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        first_name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        last_name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        full_name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        deleted_at: {
          type: DataTypes.DATE,
        },
      }, { transaction });

      await queryInterface.createTable('product', {
        product_id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        price: {
          allowNull: false,
          type: DataTypes.DECIMAL(10, 2),
        },
        img_url: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        deleted_at: {
          type: DataTypes.DATE,
        },
      }, { transaction });

      await queryInterface.createTable('purchase', {
        purchase_id: {
          allowNull: false,
          primaryKey: true,
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        },
        member_id: {
          allowNull: false,
          type: DataTypes.UUID,
          references: {
            model: 'member',
            key: 'member_id',
          },
        },
        product_id: {
          allowNull: false,
          type: DataTypes.UUID,
          references: {
            model: 'product',
            key: 'product_id',
          },
        },
        quantity: {
          allowNull: false,
          type: DataTypes.INTEGER,
        },
        total_price: {
          allowNull: false,
          type: DataTypes.DECIMAL(10, 2),
        },
        created_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updated_at: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        deleted_at: {
          type: DataTypes.DATE,
        },
      }, { transaction });
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('purchase', { transaction });
      await queryInterface.dropTable('product', { transaction });
      await queryInterface.dropTable('member', { transaction });
    });
  }
};
