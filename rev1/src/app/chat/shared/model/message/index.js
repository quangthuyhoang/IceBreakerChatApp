const debug = require('debug')('MessageModel');

function MessageModel(args) {
    var self = this;
    //self.id = args.id
    self.subject = args.subject || null;
    self.message_body = args.message_body;
    self.create_date = args.create_date || self.generate_datetime();
    self.sender_id = args.sender_id;
    self.parent_message_id = args.parent_message_id || null;
}
// Validation
MessageModel.prototype.isMessageBodyValid = function(){
    const msg = this.message_body;
    if(msg) {
        if(msg.length < 1) {
            return false;
        }
        if(typeof msg !== 'string') {
            return false;
        }
        return true;
    }
    debug('isMessageBodyValid something went wrong: ' + this.message_body)
    return false;
}

MessageModel.prototype.isSenderIdValid = function() {
        
    // const passwordValidation = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])")
    return passwordValidation.test(this.password);
} 
    // TODO
    // Create Validations for id, create_date, sender_id validation and parent_message_id

// Methods
MessageModel.prototype.generate_datetime = function(){
    var self = this;
    const dateTime =  new Date();
    self['create_date'] = Math.floor(dateTime / 1000);
};

MessageModel.prototype.generate_id = function() {
    return this.create_date + this.sender_id;
}

// returns model values
MessageModel.prototype.getValues = function(){
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
MessageModel.prototype.insertQuery = function(){
    var rowStr = '?', columns, obj = Object.keys(this);
    columns = obj.join(', ')
    rowStr = rowStr + ', ?'.repeat(obj.length - 1)
 
    var sql = `INSERT INTO message (${columns}) VALUES (${rowStr})`
    return sql
}

module.exports = MessageModel;