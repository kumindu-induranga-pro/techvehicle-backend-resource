const AWS = require('aws-sdk');
const uuid = require('uuid');

const IS_OFFLINE = process.env.NODE_ENV !== 'production';

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'us-east-2',
        endpoint: 'http://127.0.0.1:8080',
    }) : new AWS.DynamoDB.DocumentClient();


const SERVICE_TABLE = process.env.SERVICE_TABLE;

exports.getAllServices = (req, res) => {
    const params = {
        TableName: SERVICE_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the services' });
        }
        res.json(result.Items);
    });
};

exports.postNewService = (req, res) => {

    const timestamp = req.body.timestamp;
    const recommand = req.body.recommand;
    const userid = req.body.userid;
    const center = req.body.center;
    const round = req.body.round;
    const cost = req.body.cost;
    const id = uuid.v4();

    const params = {
        TableName: SERVICE_TABLE,
        Item: {
            id,
            cost,
            round,
            center,
            userid,
            recommand,
            timestamp
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create service' });
        }
        res.json({
            id,
            cost,
            round,
            center,
            userid,
            recommand,
            timestamp
        });
    });
};

exports.getService = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: SERVICE_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving service' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Services with id: ${id} not found` });
        }
    });
}

exports.updateService = (req, res) => {

    const timestamp = req.body.timestamp;
    const recommand = req.body.recommand;
    const userid = req.body.userid;
    const center = req.body.center;
    const round = req.body.round;
    const cost = req.body.cost;
    const id = req.params.id;

    const params = {
        TableName: SERVICE_TABLE,
        Key: {
            id
        },
        UpdateExpression: 'set #cost = :cost, #round = :round,#center = :center,#userid = :userid,#recommand = :recommand,#timestamp = :timestamp',
        ExpressionAttributeNames: { '#cost': 'cost', '#round': 'round', '#center': 'center', '#userid': 'userid', '#recommand': 'recommand', '#timestamp': 'timestamp' },
        ExpressionAttributeValues: { ':cost': cost, ':round': round, ':center': center, ':userid': userid, ':recommand': recommand, ':timestamp': timestamp },
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update service' });
        }
        res.json(result.Attributes);
    });
}

exports.deleteService = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: SERVICE_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete service' });
        }
        res.json({ success: true });
    });
}