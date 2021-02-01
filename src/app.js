const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser');
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');
const app = express();

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'eu-west-2',
        endpoint: 'http://127.0.0.1:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();

const checkListRoutes = require('./src/routes/checkList');
const fuelTypeRoutes = require('./src/routes/fuelType');
const categoryRoutes = require('./src/routes/category');
const centersRoutes = require('./src/routes/centers');
const profileRoutes = require('./src/routes/profile');
const serviceRoutes = require('./src/routes/service');
const vehicleRoutes = require('./src/routes/vehicle');
const modelRoutes = require('./src/routes/model');
const brandRoutes = require('./src/routes/brand');

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