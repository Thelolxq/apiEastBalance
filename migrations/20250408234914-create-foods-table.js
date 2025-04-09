
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Lógica para CREAR la tabla
    await queryInterface.createTable('foods', { 
     
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      grupo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cantidad_base: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 100.00
      },
      unidad_base: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'gramos'
      },
      calorias: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      proteinas: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      carbohidratos: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      grasas: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      fibra: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      azucares: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      grasas_saturadas: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      sodio_mg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
     
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
   
    });
  },

  async down(queryInterface, Sequelize) {
    // Lógica para REVERTIR la creación (borrar la tabla)
    await queryInterface.dropTable('foods');
  }
};