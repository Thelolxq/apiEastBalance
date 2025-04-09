const UserController = require('../controller/UserController');
const routes = require('express').Router();



routes.post('/register', UserController.registerUser);
routes.post('/login', UserController.loginUser);





module.exports = routes;