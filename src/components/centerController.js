const dynamoDb = require('dynamoDb');
const uuid = require('uuid');

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
        UpdateExpression: 'set #name = :name',
        UpdateExpression: 'set #address = :address',
        UpdateExpression: 'set #zipcode = :zipcode',
        UpdateExpression: 'set #country = :country',
        UpdateExpression: 'set #coordinates = :coordinates',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { ':name': name },
        ExpressionAttributeNames: { '#address': 'address' },
        ExpressionAttributeValues: { ':address': address },
        ExpressionAttributeNames: { '#zipcode': 'zipcode' },
        ExpressionAttributeValues: { ':zipcode': zipcode },
        ExpressionAttributeNames: { '#country': 'country' },
        ExpressionAttributeValues: { ':country': country },
        ExpressionAttributeNames: { '#coordinates': 'coordinates' },
        ExpressionAttributeValues: { ':coordinates': coordinates },
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