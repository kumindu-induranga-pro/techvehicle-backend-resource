const dynamoDb = require('dynamoDb');
const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'us-east-2',
        endpoint: 'http://127.0.0.1:8080',
    }) : new AWS.DynamoDB.DocumentClient();

const FUELTYPE_TABLE = process.env.FUELTYPE_TABLE;

exports.getAllfuelType = (req, res) => {
    const params = {
        TableName: FUELTYPE_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the fuel types' });
        }
        res.json(result.Items);
    });
};

exports.postNewfuelType = (req, res) => {
    const name = req.body.name;
    const id = uuid.v4();

    const params = {
        TableName: FUELTYPE_TABLE,
        Item: {
            id,
            name
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create fuel type' });
        }
        res.json({
            id,
            name
        });
    });
};

exports.getfuelType = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: FUELTYPE_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving fuel type' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Fuel type with id: ${id} not found` });
        }
    });
}

exports.updatefuelType = (req, res) => {

    const name = req.body.name;
    const id = req.params.id;

    const params = {
        TableName: FUELTYPE_TABLE,
        Key: {
            id
        },
        UpdateExpression: 'set #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': name },
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update fuel type' });
        }
        res.json(result.Attributes);
    });
}

exports.deletefuelType = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: FUELTYPE_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete fuel type' });
        }
        res.json({ success: true });
    });
}