const express = require('express');
const router = express.Router(); //Router({mergeParams: true}) will pass through objects for params.id
const MessageModel = require('../../model/message');
const db    = require('../../../../database/index');

router.get('/new', (req, res) => {
    res.send("form to create new topics")
})

router.post('/', (req, res) => {
    let topic = req.body.topic;
    console.log(req.body)
    let newMessage;
    let appData = {};
    if(topic) {
        newMessage = new MessageModel({
            subject : topic.subject,
            message_body : topic.message_body,
            sender_id : topic.uuid
        })
        newMessage.generate_datetime();
        console.log('id', newMessage.generate_id())
        newMessage.parent_message_id = newMessage.generate_id();

        db.query(
            newMessage.insertQuery(),
            newMessage.getValues(),
            function(error, results, field) {
                if (error) {
                    console.log(error)
                    appData['error'] = true;
                    appData['message'] = 'Error in creating topic'
                    res.status(500).json(appData);
                } else {
                    res.status(201).json(newMessage)
                }
            })
    } else {
        appData['error'] = true;
        appData['message'] = 'Something was wrong with the information submitted';
        res.status(400).json(appData);
    }
})

router.get('/:topic/:room_id', (req, res) => {
    let topic = req.params.topic;
    let room = req.params.room_id;
    res.sendFile('C:/Users/avera/Documents/personal/IceBreakerChatApp/rev1/src/views/index.html');
})

module.exports = router;