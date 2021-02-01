const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

const checkListRoutes = require('./routes/checkList');
const fuelTypeRoutes = require('./routes/fuelType');
const categoryRoutes = require('./routes/category');
const centersRoutes = require('./routes/centers');
const profileRoutes = require('./routes/profile');
const serviceRoutes = require('./routes/service');
const vehicleRoutes = require('./routes/vehicle');
const modelRoutes = require('./routes/model');
const brandRoutes = require('./routes/brand');

app.use('/checkList', checkListRoutes);

app.use('/fuelType', fuelTypeRoutes);

app.use('/catgory', categoryRoutes);

app.use('/profile', profileRoutes);

app.use('/service', serviceRoutes);

app.use('/vehicle', vehicleRoutes);

app.use('/center', centersRoutes);

app.use('/model', modelRoutes);

app.use('/brand', brandRoutes);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());
module.exports = app;