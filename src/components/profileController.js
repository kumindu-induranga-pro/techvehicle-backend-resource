const dynamoDb = require('dynamoDb');
const AWS = require('aws-sdk');
const uuid = require('uuid');

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'eu-west-2',
        endpoint: 'http://127.0.0.1:8080',
    }) : new AWS.DynamoDB.DocumentClient();

const PROFILE_TABLE = process.env.PROFILE_TABLE;

exports.getAllProfile = (req, res) => {
    const params = {
        TableName: PROFILE_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the profile' });
        }
        res.json(result.Items);
    });
};

exports.postNewProfile = (req, res) => {

    const coordinates = req.body.coordinates;
    const zipcode = req.body.zipcode;
    const country = req.body.country;
    const address = req.body.address;
    const userid = req.body.userid;
    const image = req.body.image;
    const name = req.body.name;
    const id = uuid.v4();

    const params = {
        TableName: PROFILE_TABLE,
        Item: {
            id,
            name,
            image,
            userid,
            address,
            zipcode,
            country,
            coordinates
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create profile' });
        }
        res.json({
            id,
            name,
            image,
            userid,
            address,
            zipcode,
            country,
            coordinates
        });
    });
};

exports.getProfile = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: PROFILE_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving profile' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Profile with id: ${id} not found` });
        }
    });
}

exports.updateProfile = (req, res) => {

    const coordinates = req.body.coordinates;
    const zipcode = req.body.zipcode;
    const country = req.body.country;
    const address = req.body.address;
    const userid = req.body.userid;
    const image = req.body.image;
    const name = req.body.name;
    const id = req.params.id;

    const params = {
        TableName: PROFILE_TABLE,
        Key: {
            id
        },
        UpdateExpression: 'set #name = :name',
        UpdateExpression: 'set #image = :image',
        UpdateExpression: 'set #userid = :userid',
        UpdateExpression: 'set #address = :address',
        UpdateExpression: 'set #country = :country',
        UpdateExpression: 'set #zipcode = :zipcode',
        UpdateExpression: 'set #coordinates = :coordinates',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': name },
        ExpressionAttributeNames: { '#image': 'image' },
        ExpressionAttributeValues: { ':image': image },
        ExpressionAttributeNames: { '#address': 'address' },
        ExpressionAttributeValues: { ':address': address },
        ExpressionAttributeNames: { '#userid': 'userid' },
        ExpressionAttributeValues: { ':userid': userid },
        ExpressionAttributeNames: { '#country': 'country' },
        ExpressionAttributeValues: { ':country': country },
        ExpressionAttributeNames: { '#zipcode': 'zipcode' },
        ExpressionAttributeValues: { ':zipcode': zipcode },
        ExpressionAttributeNames: { '#coordinates': 'coordinates' },
        ExpressionAttributeValues: { ':coordinates': coordinates },
        ReturnValues: "ALL_NEW"
    }

    dynamoDb.update(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Could not update profile' });
        }
        res.json(result.Attributes);
    });
}


exports.deleteProfile = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: PROFILE_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete profile' });
        }
        res.json({ success: true });
    });
}