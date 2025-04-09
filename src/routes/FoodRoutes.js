const routes = require('express').Router();
const FoodController = require('../controller/FoodController');

routes.post('/search/off', FoodController.searchFoodsOnOFF);

routes.post('/import/off/:barcode', FoodController.importAndSaveFoodFromOFF);


module.exports = routes;