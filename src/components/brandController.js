const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'us-east-2',
        endpoint: 'http://127.0.0.1:8080',
    }) : new AWS.DynamoDB.DocumentClient();

const BRANDS_TABLE = process.env.BRANDS_TABLE;


exports.getAllBrands = (req, res) => {
    const params = {
        TableName: BRANDS_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the brands' });
        }
        res.json(result.Items);
    });
};

exports.postNewBrand = (req, res) => {
    const name = req.body.name;
    const type = req.body.type;
    const id = uuid.v4();

    const params = {
        TableName: BRANDS_TABLE,
        Item: {
            id,
            name,
            type,
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create brand' });
        }
        res.json({
            id,
            name,
            type,
        });
    });

};

exports.getBrand = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: BRANDS_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving brand' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Brand with id: ${id} not found` });
        }
    });
}

exports.updateBrand = (req, res) => {

    const name = req.body.name;
    const type = req.body.type;
    const id = req.params.id;

    const params = {
        TableName: BRANDS_TABLE,
        Key: {
            id
        },
        UpdateExpression: 'set #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': name },
        UpdateExpression: 'set #type = :type',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':type': type },
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update brand' });
        }
        res.json(result.Attributes);
    });
}

exports.deleteBrand = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: BRANDS_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete brand' });
        }
        res.json({ success: true });
    });
}