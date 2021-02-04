const AWS = require('aws-sdk');
const uuid = require('uuid');

const IS_OFFLINE = process.env.NODE_ENV !== 'production';

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'us-east-2',
        endpoint: 'http://127.0.0.1:8080',
    }) : new AWS.DynamoDB.DocumentClient();

const CHECKLIST_TABLE = process.env.CHECKLIST_TABLE;

exports.getAllcheckLists = (req, res) => {
    const params = {
        TableName: CHECKLIST_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the check lists' });
        }
        res.json(result.Items);
    });
};

exports.postNewcheckList = (req, res) => {

    const timestamp = req.body.timestamp;
    const service = req.body.service;
    const quntity = req.body.quntity;
    const ischeck = req.body.ischeck;
    const brand = req.body.brand;
    const cost = req.body.cost;
    const type = req.body.type;
    const item = req.body.item;
    const id = uuid.v4();

    const params = {
        TableName: CHECKLIST_TABLE,
        Item: {
            id,
            item,
            type,
            cost,
            brand,
            quntity,
            service,
            ischeck,
            timestamp
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create check list' });
        }
        res.json({
            id,
            item,
            type,
            cost,
            brand,
            quntity,
            service,
            ischeck,
            timestamp
        });
    });
};

exports.getcheckList = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: CHECKLIST_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving check list' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Check list with id: ${id} not found` });
        }
    });
}

exports.updatecheckList = (req, res) => {

    const timestamp = req.body.timestamp;
    const service = req.body.service;
    const quntity = req.body.quntity;
    const ischeck = req.body.ischeck;
    const brand = req.body.brand;
    const cost = req.body.cost;
    const type = req.body.type;
    const item = req.body.item;
    const id = req.params.id;

    const params = {
        TableName: CHECKLIST_TABLE,
        Key: {
            id
        },
        UpdateExpression: 'set #item = :item,#type = :type, #cost = :cost,#brand = :brand, #ischeck = :ischeck, #quntity = :quntity,#service = :service, #timestamp = :timestamp',
        ExpressionAttributeNames: { '#item': 'item', '#type': 'type', '#cost': 'cost', '#brand': 'brand', '#quntity': 'quntity', '#service': 'service', '#ischeck': 'ischeck', '#timestamp': 'timestamp' },
        ExpressionAttributeValues: { ':item': item, ':type': type, ':cost': cost, ':brand': brand, ':quntity': quntity, ':service': service, ':ischeck': ischeck, ':timestamp': timestamp },
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update check list' });
        }
        res.json(result.Attributes);
    });
}

exports.deletecheckList = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: CHECKLIST_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete check list' });
        }
        res.json({ success: true });
    });
}