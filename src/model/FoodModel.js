

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/Db'); // Adjust the path as necessary

class Food extends Model {
  
    calculateNutrients(amountInGrams) {
    
        if (typeof amountInGrams !== 'number' || amountInGrams < 0) {
            console.error("Error: La cantidad para calcular nutrientes debe ser un número positivo.");
            return null;
        }
    
        if (!this.cantidad_base || this.cantidad_base <= 0) {
             console.error(`Error: La cantidad base para '${this.nombre}' no es válida (${this.cantidad_base}). No se pueden calcular los nutrientes.`);
             return null;
        }
      
        const factor = amountInGrams / this.cantidad_base;

        const calculated = {};

        const nutrientFields = [
            'calorias', 'proteinas', 'carbohidratos', 'grasas',
            'fibra', 'azucares', 'grasas_saturadas', 'sodio_mg'
          
        ];

        nutrientFields.forEach(field => {
          
            if (this[field] !== null && typeof this[field] === 'number') {
              
                calculated[field] = parseFloat((this[field] * factor).toFixed(2));
            } else {
              
                calculated[field] = null;
            }
        });

        return calculated;
    }
}

Food.init({
   
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    barcode: {
        type: DataTypes.STRING,
        allowNull: true, 
        unique: true,    
        comment: 'Código de barras (EAN/UPC) del producto, si aplica.',
    },

    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Nombre común del alimento (ej: Manzana Fuji, Pechuga de Pollo sin piel)',
    },
    grupo: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Grupo alimenticio (ej: Fruta, Verdura, Carne, Lácteo, Grano, Legumbre, Grasa). Considerar ENUM.',
      
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción adicional, marca, notas sobre el alimento.',
    },

 
    cantidad_base: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        defaultValue: 100.00,
        comment: 'La cantidad (en unidad_base) para la cual se especifican los nutrientes (generalmente 100).',
    },
    unidad_base: {
        type: DataTypes.STRING(10), 
        allowNull: false,
        defaultValue: 'gramos',
        comment: 'La unidad para la cantidad_base (ej: gramos, ml).',
    },

 
    calorias: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        defaultValue: 0.00,
        validate: { min: 0 }, 
        comment: 'Kilocalorías (kcal) por cantidad_base.',
    },
    proteinas: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        defaultValue: 0.00,
        validate: { min: 0 },
        comment: 'Gramos de proteína por cantidad_base.',
    },
    carbohidratos: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        defaultValue: 0.00,
        validate: { min: 0 },
        comment: 'Gramos de carbohidratos totales por cantidad_base.',
    },
    grasas: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: { min: 0 },
        comment: 'Gramos de grasa total por cantidad_base.',
    },

   
    fibra: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: true, 
        validate: { min: 0 },
        comment: 'Gramos de fibra dietética por cantidad_base.',
    },
    azucares: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: { min: 0 },
        comment: 'Gramos de azúcares por cantidad_base.',
    },
    grasas_saturadas: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: true,
        validate: { min: 0 },
        comment: 'Gramos de grasas saturadas por cantidad_base.',
    },
    sodio_mg: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: true,
        validate: { min: 0 },
        comment: 'Miligramos de sodio por cantidad_base.',
    },
  


}, {
    sequelize,               
    modelName: 'Food',       
    tableName: 'foods',     
    timestamps: true,       
    paranoid: false,         
    comment: 'Tabla para almacenar información nutricional de alimentos y productos.', 
 
});

// Export the model
module.exports = Food;