const AWS = require('aws-sdk');
const uuid = require('uuid');

const IS_OFFLINE = process.env.NODE_ENV !== 'production';

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'us-east-2',
        endpoint: 'http://127.0.0.1:8080',
    }) : new AWS.DynamoDB.DocumentClient();

const PARTS_TABLE = process.env.PARTS_TABLE;


exports.getAllParts = (req, res) => {
    const params = {
        TableName: PARTS_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the parts' });
        }
        res.json(result.Items);
    });
};

exports.postNewPart = (req, res) => {

    const is_optional = req.body.is_optional;
    const sub_type = req.body.sub_type;
    const name = req.body.name;
    const type = req.body.type;
    const id = uuid.v4();

    const params = {
        TableName: PARTS_TABLE,
        Item: {
            id,
            name,
            type,
            sub_type,
            is_optional,
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create part' });
        }
        res.json({
            id,
            name,
            type,
            sub_type,
            is_optional,
        });
    });

};

exports.getPart = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: PARTS_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving part' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Brand with id: ${id} not part` });
        }
    });
}

exports.updatePart = (req, res) => {

    const is_optional = req.body.is_optional;
    const sub_type = req.body.sub_type;
    const name = req.body.name;
    const type = req.body.type;
    const id = req.params.id;

    const params = {
        TableName: PARTS_TABLE,
        Key: {
            id,
        },
        UpdateExpression: 'set #name = :name, #type = :type ,#sub_type = :sub_type,#is_optional = :is_optional',
        ExpressionAttributeNames: { '#name': 'name', '#type': 'type', '#sub_type': 'sub_type', '#is_optional': 'is_optional' },
        ExpressionAttributeValues: { ':name': name, ':type': type, ':sub_type': sub_type, ':is_optional': is_optional },
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update part' });
        }
        res.json(result.Attributes);
    });
}

exports.deletePart = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: PARTS_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete part' });
        }
        res.json({ success: true });
    });
}