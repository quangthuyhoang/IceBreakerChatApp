
const db        = require('../database/index');

const userAuthentication = function(req, res, next) {
    let uuid = req.body.uuid || req.headers['uuid'];
    let appData = {};
    if (uuid) {
        db.query('SELECT * FROM user WHERE uuid = "' + uuid + '"',
        function(error, results, fields) {
            if (error) {
                appData['error'] = true;
                appData['message'] = "Invalid uuid";
                res.status(500).json(appData);
            } else {
                next();
            }
        })
    } else {
        appData['error'] = true;
        res.status(403).json(appData);
    }
};

module.export = userAuthentication;