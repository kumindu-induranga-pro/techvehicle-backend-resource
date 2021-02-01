const dynamoDb = require('dynamoDb');
const uuid = require('uuid');

const CATEGORIES_TABLE = process.env.CATEGORIES_TABLE;

exports.getAllCategories = (req, res) => {
    const params = {
        TableName: CATEGORIES_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the categories' });
        }
        res.json(result.Items);
    });
};

exports.postNewCategory = (req, res) => {
    const name = req.body.name;
    const id = uuid.v4();

    const params = {
        TableName: CATEGORIES_TABLE,
        Item: {
            id,
            name
        },
    };

    dynamoDb.put(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not create category' });
        }
        res.json({
            id,
            name
        });
    });

};

exports.getCategory = (req, res) => {
    const id = req.params.id;
    const params = {
        TableName: CATEGORIES_TABLE,
        Key: {
            id
        }
    };
    dynamoDb.get(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error retrieving category' });
        }
        if (result.Item) {
            res.json(result.Item);
        } else {
            res.status(404).json({ error: `Category with id: ${id} not found` });
        }
    });

}

exports.updateCategory = (req, res) => {

    const name = req.body.name;
    const id = req.params.id;

    const params = {
        TableName: CATEGORIES_TABLE,
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
            res.status(400).json({ error: 'Could not update category' });
        }
        res.json(result.Attributes);
    });
}

exports.deleteCategory = (req, res) => {
    const id = req.params.id;

    const params = {
        TableName: CATEGORIES_TABLE,
        Key: {
            id
        }
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            res.status(400).json({ error: 'Could not delete category' });
        }
        res.json({ success: true });
    });
}