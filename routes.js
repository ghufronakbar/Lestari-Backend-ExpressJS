'use strict';

module.exports = function(app)  {
    var jsonku = require('./controller');

    app.route('/')
    .get(jsonku.index);

    app.route('/animals')
    .get(jsonku.animals);

    app.route('/animals/data/:id')
    .get(jsonku.animalsid);

    app.route('/users')
    .get(jsonku.users);

    app.route('/users/data/:id')
    .get(jsonku.usersid);

    app.route('/request/data')
    .get(jsonku.reqdata);

    app.route('/request/data/id/:id')
    .get(jsonku.reqdataid);

    app.route('/request/data/pending')
    .get(jsonku.reqdatapend);

    app.route('/request/account')
    .get(jsonku.reqacc);

    app.route('/request/account/id/:id')
    .get(jsonku.reqaccid);

    app.route('/request/account/pending')
    .get(jsonku.reqaccpend);
   
}