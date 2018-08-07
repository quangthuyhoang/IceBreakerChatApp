const express       = require('express');
const app       = express();
const http      = require('http').Server(app);
const io        = require('socket.io')(http);
const db        = require('./src/app/database/index');
const User      = require('./src/app/chat/shared/model/user/index');
const Message   = require('./src/app/chat/shared/model/message/index');
const crud      = require('./src/app/database/crud');
const chatRoutes = require('./src/app/chat/shared/services/message/index');

const bodyParser = require('body-parser');
const url       = require('url');

const debug     = require('debug')('server');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', express.static(__dirname + '/src'));
app.use('/public', express.static(__dirname + '/src/public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/src/views/index.html');
});

app.post('/register', (req, res) => {
    var payload = req.body;

    if(typeof req.body === 'string') {
        payload = JSON.parse(req.body);
    }
      var user = new User({username: payload.username});

    user.generate_datetime();
    user.generate_uuid();
    user.is_active = true;
    crud.addNewUser(user, function(results){
        res.status(201).json(user)
    })
})

app.get('/profile', (req, res) => {
    var payload = req.query;
    debug('payload -login ' + payload);

    res.sendFile(__dirname + '/src/views/profile.html')
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/src/views/login.html');
})

app.post('/login', (req, res) => {
    var payload = JSON.parse(req.body.user);
    console.log(payload, payload.uuid, typeof payload)
    db.query('SELECT * FROM user WHERE uuid = "' + payload.uuid + '"',
        function(error, results, fields) {
            if (error) throw error;
            var queryResult = {
                loginResult : true
            }
            if (!results[0] || results[0].length < 1) {
                queryResult = {
                    loginResult : false
                }
            }

            if (results[0]) {
                console.log('result', results)
                queryResult.username =  results[0].username
                if (results[0].uuid !== payload.uuid) {
                    queryResult.loginResult = false;
                }
            }
            // TODO: create token id to show successful login
         
            res.redirect(302, url.format({
                pathname: '/profile',
                query: queryResult
            }))
    })
    
})

app.use('/chat', chatRoutes)
//app.use('/games', gameRoutes);


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
            message_body: message.message_body
        });
        newMsg.generate_datetime();
        console.log("this is in default")
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

    socket.on('programming-153352671804811300', (msg) => {
        let message = JSON.parse(msg);
        var newMsg = new Message({
            subject: message.subject,
            sender_id: message.uuid,
            message_body: message.message_body,
            parent_message_id: message.parent_message_id
        });
        newMsg.generate_datetime();
        console.log("this is in programmer", newMsg)
        io.emit('programming-153352671804811300', JSON.parse(msg))
    })
});
// const chatSocket = io.of('/chat');
// chatSocket.on('connection', (socket) => {
//     socket.join(topic + '-' + room_id);
//     socket.broadcast.emit('someone connected to ' + topic + ' room_id: ' + room_id );
//     console.log('someone connected to ' + topic + ' room_id: ' + room_id );
//     socket.on('disconnect', function() {
//         console.log('user has disconnected from chatroom');
//     })
//     socket.join(topic + '-' + room_id, (msg) => {
//         let message = JSON.parse(msg);
//         let newMessage = new Message({
//             subject : topic,
//             sender_id : message.uuid,
//             message_body : message.message_body,
//             message_parent_id : room_id
//         })

//         newMessage.generate_datetime();
//         socket.emit(topic + '-' + room_id, newMessage)
//         db.query(
//             newMessage.insertQuery(),
//             newMessage.getValues(),
//             function (error, results, fields) {
//             if (error) throw error;
//             if (results) {
//                 debug('message sent')
//             }
//         });
//     })
// })

// chatSocketConnection(io, 'programming', '153352671804811300');
function chatSocketConnection(io, topic, room_id) {
    let room = topic + '-' + room_id;
    const chatSocket = io.of('/chat');
    
    chatSocket.on('connection', (socket) => {
        
        socket.join(topic + '-' + room_id);
        socket.broadcast.emit('someone connected to ' + topic + ' room_id: ' + room_id );
        console.log('someone connected to ' + topic + ' room_id: ' + room_id );
        socket.on('disconnect', function() {
            console.log('user has disconnected from chatroom');
        })
        console.log("joined", topic, room_id)
        socket.join(topic + '-' + room_id)
        socket.on(room, (msg) => {
            console.log("mesage", msg)
            let message = JSON.parse(msg);
            let newMessage = new Message({
                subject : topic,
                sender_id : message.uuid,
                message_body : message.msg,
                parent_message_id : room_id
            })

            newMessage.generate_datetime();
            console.log("newMessage", newMessage)
            chatSocket.emit(room, newMessage)
            db.query(
                newMessage.insertQuery(),
                newMessage.getValues(),
                function (error, results, fields) {
                if (error) throw error;
                if (results) {
                    debug('message sent')
                }
            });
        })
    })
}

const port = process.env.PORT || 3000;
http.listen(port, function() {
    console.log('Server listening to port ' + port)
});
