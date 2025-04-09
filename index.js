const express = require('express');
const cors = require('cors');
const FoodRoutes = require('./src/routes/FoodRoutes');
const UserRoutes = require('./src/routes/UserRoutes');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/food', FoodRoutes);
app.use('/api/user', UserRoutes);
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
    });

