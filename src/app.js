const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const checkListRoutes = require('./routes/checkList');
const fuelTypeRoutes = require('./routes/fuelType');
const categoryRoutes = require('./routes/category');
const centersRoutes = require('./routes/centers');
const profileRoutes = require('./routes/profile');
const serviceRoutes = require('./routes/service');
const vehicleRoutes = require('./routes/vehicle');
const modelRoutes = require('./routes/model');
const brandRoutes = require('./routes/brand');
const partRoutes = require('./routes/part');

app.use('/checkList', checkListRoutes);

app.use('/fuelType', fuelTypeRoutes);

app.use('/category', categoryRoutes);

app.use('/profile', profileRoutes);

app.use('/service', serviceRoutes);

app.use('/vehicle', vehicleRoutes);

app.use('/center', centersRoutes);

app.use('/model', modelRoutes);

app.use('/brand', brandRoutes);

app.use('/part', partRoutes);

module.exports = app;