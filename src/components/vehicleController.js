const AWS = require('aws-sdk');
const uuid = require('uuid');


const IS_OFFLINE = process.env.NODE_ENV !== 'production';

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'us-east-2',
        endpoint: 'http://127.0.0.1:8080',
    }) : new AWS.DynamoDB.DocumentClient();

const VEHICLE_TABLE = process.env.VEHICLE_TABLE;


exports.getAllVehicles = (req, res) => {
    const params = {
        TableName: VEHICLE_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the vehicles' });
        }
        res.json(result.Items);
    });
};

exports.postNewVehicle = (req, res) => {

    const vehicleNo = req.body.vehicleNo;
    const chassisNo = req.body.chassisNo;
    const fuelType = req.body.fuelType;
    const milleage = req.body.milleage;
    const category = req.body.category;
    const userid = req.body.userid;
    const brand = req.body.brand;
    const model = req.body.model;
    const year = req.body.year;
    const id = uuid.v4();

    const params = {
        TableName: VEHICLE_TABLE,
        Item: {
            id,
            year,
            model,
            brand,
            userid,
            category,
            milleage,
            fuelType,
            chassisNo,
            vehicleNo
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create vehicle' });
        }
        res.json({
            id,
            year,
            model,
            brand,
            userid,
            category,
            milleage,
            fuelType,
            chassisNo,
            vehicleNo
        });
    });
};

exports.getVehicle = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: VEHICLE_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving vehicle' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Vehicle with id: ${id} not found` });
        }
    });
}

exports.updateVehicle = (req, res) => {

    const vehicleNo = req.body.vehicleNo;
    const chassisNo = req.body.chassisNo;
    const fuelType = req.body.fuelType;
    const milleage = req.body.milleage;
    const category = req.body.category;
    const userid = req.body.userid;
    const brand = req.body.brand;
    const model = req.body.model;
    const year = req.body.year;
    const id = req.params.id;

    const params = {
        TableName: VEHICLE_TABLE,
        Key: {
            id,
        },
        UpdateExpression: 'set #year = :year,#model = :model,#brand = :brand,#userid = :userid,#category = :category,#milleage = :milleage,#fuelType = :fuelType,#chassisNo = :chassisNo,#vehicleNo = :vehicleNo',
        ExpressionAttributeNames: { '#year': 'year', '#model': 'model', '#brand': 'brand', '#userid': 'userid', '#category': 'category', '#milleage': 'milleage', '#fuelType': 'fuelType', '#chassisNo': 'chassisNo', '#vehicleNo': 'vehicleNo' },
        ExpressionAttributeValues: { ':year': year, ':model': model, ':brand': brand, ':userid': userid, ':category': category, ':milleage': milleage, ':fuelType': fuelType, ':chassisNo': chassisNo, ':vehicleNo': vehicleNo },
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update vehicle' });
        }
        res.json(result.Attributes);
    });
}


exports.deleteVehicle = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: VEHICLE_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete vehicle' });
        }
        res.json({ success: true });
    });
}