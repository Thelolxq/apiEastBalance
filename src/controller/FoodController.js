const axios = require('axios');
const Food = require('../model/FoodModel');


async function searchOFFByName(searchTerm, pageSize = 10) {
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodedSearchTerm}&search_simple=1&action=process&json=1&page_size=${pageSize}&page=1`;
  console.log(`Buscando en OFF: ${url}`);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'MiAppDeDietas/1.0 (contacto@ejemplo.com)',
      },
      timeout: 10000
    });

    if (response.data && response.data.products && response.data.products.length > 0) {
      console.log(`OFF encontró ${response.data.count} productos para "${searchTerm}". Devolviendo los primeros ${response.data.products.length}.`);
      return response.data.products; 
    } else {
      console.log(`No se encontraron productos en OFF para "${searchTerm}".`);
      return []; 
    }
  } catch (error) {
    console.error(`Error al buscar en OFF "${searchTerm}":`, error.message);
    return []; 
  }
}


async function fetchFoodFromOFF(barcode) {
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
  console.log(`Consultando OFF por barcode: ${url}`);
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'MiAppDeDietas/1.0 (arymanuel652@gmail.com)', 
      },
      timeout: 10000 
    });

    if (response.data.status === 1 && response.data.product) {
      return response.data.product; 
    } else {
      return null; 
    }
  } catch (error) {
    console.error(`Error fetching ${barcode} from OFF:`, error.message);
  
    throw new Error(`Fallo al obtener datos de Open Food Facts para el código ${barcode}`);
  }
}

const searchFoodsOnOFF = async (req, res) => {

  const searchTerm = req.query.term || req.body.searchTerm;
  const pageSize = parseInt(req.query.limit || '10', 10); 

  if (!searchTerm) {
    return res.status(400).json({ status: 'fail', message: 'Término de búsqueda (term/searchTerm) requerido.' });
  }

  try {
    const productsFound = await searchOFFByName(searchTerm, pageSize);

    if (productsFound.length > 0) {
      res.status(200).json({
        status: 'success',
        message: `Se encontraron ${productsFound.length} posibles coincidencias para "${searchTerm}".`,
      
        data: productsFound
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: `No se encontraron productos en Open Food Facts para "${searchTerm}".`
      });
    }
  } catch (error) {
    console.error('Error en el controlador searchFoodsOnOFF:', error.message);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor durante la búsqueda.' });
  }
};


const importAndSaveFoodFromOFF = async (req, res) => {
  const { barcode } = req.params; 

  if (!barcode) {
    return res.status(400).json({ status: 'fail', message: 'Código de barras requerido.' });
  }

  try {
    let localFood = await Food.findOne({ where: { barcode: barcode } });

    if (localFood) {
      return res.status(200).json({
        status: 'success',
        message: 'El alimento ya existe en la base de datos local.',
        data: localFood,
        source: 'local'
      });
    }
    const offProduct = await fetchFoodFromOFF(barcode);

    if (!offProduct) {
      return res.status(404).json({
        status: 'fail',
        message: `Alimento con código de barras ${barcode} no encontrado en Open Food Facts.`
      });
    }

   
    const offNutriments = offProduct.nutriments || {};
    const foodDataToSave = {
      barcode: barcode,
      nombre: offProduct.product_name || offProduct.generic_name || `Producto ${barcode}`,
      grupo: (offProduct.categories_tags && offProduct.categories_tags.length > 0)
             ? offProduct.categories_tags[0].replace(/^[a-z]{2}:/, '') 
             : (offProduct.categories || null),
      descripcion: `Marca: ${offProduct.brands || 'N/A'}. ${offProduct.generic_name || ''}`.trim(),
      cantidad_base: 100,
      unidad_base: offProduct.quantity?.toLowerCase().includes('ml') ? 'ml' : 'gramos',
    
      calorias: offNutriments['energy-kcal_100g'] ?? 0,
      proteinas: offNutriments.proteins_100g ?? 0,
      carbohidratos: offNutriments.carbohydrates_100g ?? 0,
      grasas: offNutriments.fat_100g ?? 0, 
      fibra: offNutriments.fiber_100g ?? null,
      azucares: offNutriments.sugars_100g ?? null, 
      grasas_saturadas: offNutriments['saturated-fat_100g'] ?? null,
    
      sodio_mg: offNutriments.sodium_100g ? (parseFloat(offNutriments.sodium_100g) * 1000) : null,
    };

 
    console.log(`Guardando ${foodDataToSave.nombre} (Barcode: ${barcode}) en la base de datos local...`);
    localFood = await Food.create(foodDataToSave);

    res.status(201).json({ 
      status: 'success',
      message: 'Alimento importado y guardado exitosamente.',
      data: localFood,
      source: 'openfoodfacts'
    });

  } catch (error) {
    console.error(`Error procesando importación para barcode ${barcode}:`, error);
     if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
       return res.status(400).json({
                status: 'fail',
                message: 'Datos inválidos o duplicados al intentar guardar el alimento importado',
                errors: error.errors ? error.errors.map(e => e.message) : [error.message]
            });
    }
   
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al importar el alimento.',
   
    });
  }
};


module.exports = {
    searchFoodsOnOFF,
    importAndSaveFoodFromOFF,
  
};