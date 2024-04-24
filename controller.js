'use strict';

var response = require('./res');
var connection = require('./connection');

exports.index = function(req,res){
    response.ok("REST API Worked!",res)
}

//GET ANIMALS
exports.animals = function(req,res){
    connection.query('SELECT * FROM animals', function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};

//GET ID ANIMALS
exports.animalsid = function(req,res){
    let id = req.params.id;
    connection.query('SELECT * FROM animals WHERE id=?',[id], function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};

//GET USERS
exports.users = function(req,res){
    connection.query('SELECT userId, email, name, picture, status FROM users', function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};

//GET USERS
exports.usersid = function(req,res){
    let id = req.params.id;
    connection.query('SELECT userId, email, name, picture FROM users WHERE userId=?',[id], function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};


//GET REQUEST DATA
exports.reqdata = function(req,res){
    connection.query('SELECT * FROM request_data', function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};

//GET ID REQUEST DATA
exports.reqdataid = function(req,res){
    let id = req.params.id
    connection.query('SELECT * FROM request_data WHERE id=?',[id], function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};

//GET REQUEST DATA
exports.reqdatapend = function(req,res){
    connection.query('SELECT * FROM request_data WHERE status=0', function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};


//GET REQUEST ACCOUNT
exports.reqacc = function(req,res){
    connection.query('SELECT * FROM request_account', function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};

//GET ID REQUEST ACCOUNT
exports.reqaccid = function(req,res){
    let id = req.params.id
    connection.query('SELECT * FROM request_account WHERE id=?',[id], function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};

//GET REQUEST ACCOUNT PENDING
exports.reqaccpend = function(req,res){
    connection.query('SELECT * FROM request_account WHERE status=0', function(error, rows, fields){
        if(error){
            connection.log(error);            
        }else{
            response.ok(rows, res)
        };
    }
    )
};



