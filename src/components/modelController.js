const dynamoDb = require('dynamoDb');
const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'us-east-2',
        endpoint: 'http://127.0.0.1:8080',
    }) : new AWS.DynamoDB.DocumentClient();

const MODEL_TABLE = process.env.MODEL_TABLE;

exports.getAllModel = (req, res) => {
    const params = {
        TableName: MODEL_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the models' });
        }
        res.json(result.Items);
    });
};

exports.postNewModel = (req, res) => {
    const name = req.body.name;
    const id = uuid.v4();

    const params = {
        TableName: MODEL_TABLE,
        Item: {
            id,
            name
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create model' });
        }
        res.json({
            id,
            name
        });
    });
};

exports.getModel = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: MODEL_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving model' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Model with id: ${id} not found` });
        }
    });
}

exports.updateModel = (req, res) => {

    const name = req.body.name;
    const id = req.params.id;

    const params = {
        TableName: MODEL_TABLE,
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
            res.status(400).json({ error: 'Could not update model' });
        }
        res.json(result.Attributes);
    });
}

exports.deleteModel = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: MODEL_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete model' });
        }
        res.json({ success: true });
    });
}