(function(global, io) {
 
    // ** Declared variables **
    let path = global.location.pathname;
    var myStorage = global.localStorage;
    var message = {};
    var socket = io();
    var user = JSON.parse(getMyData('_icebreaker_uuid'));
 
    message.subject = path.split('/')[2];
    message.parent_message_id = path.split('/')[3];
    message.sender_id = user.uuid;
    message.username = user.username;
    var  chatroom = message.subject + '-' + message.parent_message_id;
 
    // ** Event Listener **
    $('form').submit(function(){
        message.message_body = $('#m').val();
        socket.emit(chatroom, JSON.stringify(message))
        $('#m').val('');
        return false;
    });
    
    // TODO save current active users join in room and reference username from list with join, leave to add and remove
    // name from list
    socket.on(chatroom, function(msg) {
        $('#messages').append($('<li>').text(msg.sender_id + " : " + msg.message_body));
    });

    function getMyData(key) {
        return myStorage.getItem(key);
    }
    
})(window, io)