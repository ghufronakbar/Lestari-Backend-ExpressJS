'use strict';

module.exports = function(app)  {
    var apiAdmin = require('./controllers/admin')


    app.route('/v1/web/animals')
    .get(apiAdmin.animal_controller.webanimalid);

    app.route('/v1/web/animal/:id')
    .get(apiAdmin.animal_controller.webanimalid);

    app.route('/v1/web/animal/edit/:id')
    .put(apiAdmin.animal_controller.webanimaledit);

    app.route('/v1/web/animal/delete/:id')
    .delete(apiAdmin.animal_controller.webanimaldelete);

    app.route('/v1/web/request/accounts')
    .get(apiAdmin.request_account_controller.webrequestaccounts);

    app.route('/v1/web/request/account/:id')
    .get(apiAdmin.request_account_controller.webrequestaccountid);

    app.route('/v1/web/request/account/approve/:id')
    .put(apiAdmin.request_account_controller.webapproverequestaccount);

    app.route('/v1/web/request/datas')
    .get(apiAdmin.request_data_controller.webrequestdatas);

    app.route('/v1/web/request/data/:id')
    .get(apiAdmin.request_data_controller.webrequestdataid);

    app.route('/v1/web/request/data/approve/:id')
    .put(apiAdmin.request_data_controller.webapproverequestdata);

    app.route('/v1/web/request/data/approve/send')
    .post(apiAdmin.request_data_controller.websendrequestdata);
   
    app.route('/v1/web/history/request/data')
    .get(apiAdmin.history_request_data_controller.webhistoryrequestdatas);

    app.route('/v1/web/history/request/data/:id')
    .get(apiAdmin.history_request_data_controller.webhistoryrequestdataid);
   
}

