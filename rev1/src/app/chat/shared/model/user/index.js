function UserModel(user) {
    var self = this;
    self.username = user.username || null;
    self.uuid = user.uuid || null;
    self.create_date = user.create_date || null;
    self.is_active = user.is_active || false;
}


// Methods
// Validation
UserModel.prototype.isUserNameValid = function(){
    const userNameValidation = new RegExp('^\d{1,45}$')
    return userNameValidation.test(this.username);
}

UserModel.prototype.isUuidValid = function() {
    const uuidValidation = /^\{[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}‌​\}$/
    console.log(this.uuid)
    return uuidValidation.test(this.uuid);
    // return this.uuid.length === 36;
}

UserModel.prototype.isValid = function(){
    if(
        this.isUserNameValid() &&
        this.isUuidValid()
    ) {
        return true;
    }
    return false;
}
UserModel.prototype.generate_datetime = function(){
    var self = this;
    const dateTime = new Date().getTime();
    self['create_date'] = Math.floor(dateTime / 1000);
};



// update password
UserModel.prototype.generate_uuid = function(value) {
    var self = this;
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
    self['uuid'] = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();;
}

// returns model values
UserModel.prototype.getValues = function(){
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
UserModel.prototype.insertQuery = function(){
    var rowStr = '?', columns, obj = Object.keys(this);
    columns = obj.join(', ')
    rowStr = rowStr + ', ?'.repeat(obj.length - 1)
 
    var sql = `INSERT INTO User (${columns}) VALUES (${rowStr})`
    return sql
}

module.exports = UserModel;