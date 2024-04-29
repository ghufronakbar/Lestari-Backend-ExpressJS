"use strict";

const verifikasi = require("./middleware/verifikasi");
const express = require("express");

module.exports = function (app) {
  var apiAdmin = require("./controllers/admin");
  var apiUser = require("./controllers/user");

  //tambahkan penampung

  //API USER

  app.route("/v1/mob/user/login").post(apiUser.auth.login);

  app
    .route("/v1/mob/animals/editable/:token")
    .get(apiUser.editable_animal_controller.mobeditableanimals);

  app
    .route("/v1/mob/animal/editable/:token/:id_animal")
    .get(apiUser.editable_animal_controller.mobeditableanimalid);

  app
    .route("/v1/mob/animal/add")
    .post(apiUser.editable_animal_controller.mobanimalpost);

  app
    .route("/v1/mob/animal/editable/edit/:token/:id_animal")
    .put(apiUser.editable_animal_controller.mobediteditableanimal);

  app
    .route("/v1/mob/animal/editable/delete/:token/:id_animal")
    .delete(apiUser.editable_animal_controller.deleteAnimalById);

  app
    .route("/v1/mob/animal/upload/image/:token")
    .post(apiUser.editable_animal_controller.mob_upload_image);

  app
    .route("/v1/mob/animal/delete/image")
    .delete(apiUser.editable_animal_controller.deleteImageByURL);

  app
    .route("/v1/mob/animals/history/:token")
    .get(apiUser.history_animal_controller.mobhistoryanimals);

  app
    .route("/v1/mob/animal/history/:token/:id_animal")
    .get(apiUser.history_animal_controller.mobhistoryanimalid);

  app
    .route("/v1/mob/user/account/:token")
    .get(apiUser.account_controller.mobaccount);

  app
    .route("/v1/mob/user/account/edit/name/:token")
    .put(apiUser.account_controller.mobaccounteditname);

  app
    .route("/v1/mob/user/account/edit/picture/:token")
    .put(apiUser.account_controller.mobaccounteditpicture);

  app
    .route("/v1/mob/user/account/edit/password/:token")
    .put(apiUser.account_controller.mobaccounteditpassword);
};
