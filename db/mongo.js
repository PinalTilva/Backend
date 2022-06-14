const { MongoClient } = require("mongodb");
const url = 'mongodb+srv://Funds11:150430119115pM@Funds11.vvtll.mongodb.net/Funds?retryWrites=true&w=majority';
const dbName = 'Funds'
const client = new MongoClient(url);

const dbData = async () => {
    let result = await client.connect();
    db = result.db(dbName);
    return db.collection('Funds11');
}

async function dbMembers() {
    let result = await client.connect();
    db = result.db(dbName);
    return db.collection('Members');
}

async function login() {
    let result = await client.connect();
    db = result.db(dbName);
    return db.collection('Credentials')
}

module.exports =
{
    dbData: dbData, dbMembers: dbMembers, login: login
};