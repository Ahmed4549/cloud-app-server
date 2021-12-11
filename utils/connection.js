const { Connection, connections, createConnection } = require('mongoose');
const mongoose = require('mongoose');
const TenantModel = require('../models/SaaS/tenant');

const getConnection = async (company) => {
    connectionsArray = connections;
    let companyurl = await TenantModel.findOne({ companyLower: company });
    if (companyurl) {
        const foundConn = await mongoose.connections.find((connectionsArray) => {
            return connectionsArray.name === companyurl.company
        });
        if (foundConn && foundConn.readyState === 1) {
            return foundConn;
        }
        return await createConnections(companyurl.company);
    }
    else {
        if (company == '7-star') {
            return await createConnections(company);
        }
        else {
            return false
        }
    }
}

const createConnections = async (company) => {
    return await createConnection(`mongodb+srv://ayaz:ayaz123@cluster0.hhjfv.mongodb.net/${company}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
}

const getConnectedModels = async (company, models) => {
    let connectedModels = {}
    const connection = await getConnection(company);
    if (connection) {
        for (let i = 0; i < models.length; i++) {
            connectedModels[models[i]] = connection.model(models[i])
        }
        return connectedModels;
    }


}

module.exports = {
    getConnection,
    getConnectedModels
}