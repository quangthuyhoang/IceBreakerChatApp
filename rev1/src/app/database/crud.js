const db = require('./index');
const debug = require('debug')('crud');

var crud = {};

crud.addNewUser = function(user, callback) {

    return db.query(
        user.insertQuery(),
        user.getValues(),
        function (error, results, fields) {
        if (error) throw error;
        if (results) {
            debug('user registered')
        }
        console.log('CRUD :: addnewuser', results)
        callback(results);
    });
}

module.exports = crud;
