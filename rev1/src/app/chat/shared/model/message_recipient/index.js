const debug = require('debug')('MessageRecipientModel');

function MessageRecipientModel(args) {
    var self = this;
    self.id = args.id
    self.recipient_user_id = args.recipient_user_id;
    self.recipient_group_id = args.recipient_group_id;
    self.is_read = args.is_read;
    self.message_id = args.message_id;
}


// Methods

// returns model values
MessageRecipientModel.prototype.getValues = function(){
    var vals = [], self = this;
    var arr = Object.keys(this)
    for(let i = 0; i < arr.length; i++) {
        let k = arr[i]
        vals.push(self[k])
    }
    return vals;
}

// Create SQL commands here

// INSERT/CREATE
MessageRecipientModel.prototype.insertQuery = function(){
    var rowStr = '?', columns, obj = Object.keys(this);
    columns = obj.join(', ')
    rowStr = rowStr + ', ?'.repeat(obj.length - 1)
 
    var sql = `INSERT INTO message_recipient (${columns}) VALUES (${rowStr})`
    return sql
}

module.exports = MessageRecipientModel;