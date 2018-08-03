const app       = require('express')();
const http      = require('http').Server(app);
const io        = require('socket.io')(http);
const db        = require('./src/app/database/index');
const User      = require('./src/app/chat/shared/model/user/index');
const Message   = require('./src/app/chat/shared/model/message/index');
const crud      = require('./src/app/database/crud');

const bodyParser = require('body-parser');
const url       = require('url');

const debug     = require('debug')('server');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/views/index.html');
});

app.post('/register', (req, res) => {
    var payload = req.body;

    if(typeof req.body === 'string') {
        payload = JSON.parse(req.body);
    }
    debug("payload: " +payload, typeof payload)

    var user = new User({username: payload.username});

    user.generate_datetime();
    user.generate_uuid();
    user.is_active = true;
    crud.addNewUser(user, function(results){
        res.send(JSON.stringify(user))
    })
    // res.redirect(url.format({
    //     pathname: '/saveCredential',
    //     query: user
    // }))
 
})

app.get('/saveCredential', (req, res) => {
    var payload = req.query;
    debug('payload -login ' + payload);
    res.json(payload)
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/views/login.html');
})

app.post('/login', (req, res) => {
    var payload = req.body;
    console.log(payload)
    db.query('SELECT * FROM user WHERE uuid = "' + payload.uuid + '"',
        function(error, results, fields) {
            if (error) throw error;
     
            if (!results[0] || results[0].length < 1) {
                return res.redirect(url.format({
                    pathname: '/',
                    query: {
                        loginSuccess: false
                    }
                }))
            }

            if (results[0]) {
                console.log('i was here')
                if (results[0].uuid !== payload.uuid) {
                    return res.redirect(url.format({
                        pathname: '/',
                        query: {
                            loginSuccess: false
                        }
                    }));
                }
            }
            // TODO: create token id to show successful login
            res.redirect(url.format({
                pathname: '/',
                query: {
                    loginSuccess: true
                }
            }))
    })
    
})

io.on('connection', (socket) => {
    socket.broadcast.emit('a user has connected');
    socket.on('disconnect', function() {
        console.log('user has disconnected');
    })
    socket.on('chat message', (msg) => {
        var message = JSON.parse(msg)
        var newMsg = new Message({
            subject: 'default subject',
            sender_id: message.uuid,
            message_body: message.msg
        });
        newMsg.generate_datetime();

        // TODO: add query to get username
        io.emit('chat message', JSON.parse(msg))
        db.query(
            newMsg.insertQuery(),
            newMsg.getValues(),
            function (error, results, fields) {
            if (error) throw error;
            if (results) {
                debug('message sent')
            }
        });
    })

});

const port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('Server listening to port ' + port)
});
