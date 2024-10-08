const AWS = require('aws-sdk');
const uuid = require('uuid');

const IS_OFFLINE = process.env.NODE_ENV !== 'production';

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'us-east-2',
        endpoint: 'http://127.0.0.1:8080',
    }) : new AWS.DynamoDB.DocumentClient();

const CENTER_TABLE = process.env.CENTER_TABLE;

exports.getAllCenters = (req, res) => {
    const params = {
        TableName: CENTER_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the centers' });
        }
        res.json(result.Items);
    });
};

exports.postNewCenter = (req, res) => {

    const coordinates = req.body.coordinates;
    const country = req.body.country;
    const zipcode = req.body.zipcode;
    const address = req.body.address;
    const name = req.body.name;
    const id = uuid.v4();

    const params = {
        TableName: CENTER_TABLE,
        Item: {
            id,
            name,
            address,
            zipcode,
            country,
            coordinates
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create center' });
        }
        res.json({
            id,
            name,
            address,
            zipcode,
            country,
            coordinates
        });
    });
};

exports.getCenter = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: CENTER_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving center' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Center with id: ${id} not found` });
        }
    });
}

exports.updateCenter = (req, res) => {

    const coordinates = req.body.coordinates;
    const country = req.body.country;
    const zipcode = req.body.zipcode;
    const address = req.body.address;
    const name = req.body.name;
    const id = req.params.id;

    const params = {
        TableName: CENTER_TABLE,
        Key: {
            id
        },
        UpdateExpression: 'set #name = :name,#address = :address,#zipcode = :zipcode,#country = :country,#coordinates = :coordinates',
        ExpressionAttributeNames: { '#name': 'name', '#address': 'address', '#zipcode': 'zipcode', '#country': 'country', '#coordinates': 'coordinates' },
        ExpressionAttributeValues: { ':name': name, ':address': address, ':zipcode': zipcode, ':country': country, ':coordinates': coordinates },
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update center' });
        }
        res.json(result.Attributes);
    });
}

exports.deleteCenter = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: CENTER_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete center' });
        }
        res.json({ success: true });
    });
}