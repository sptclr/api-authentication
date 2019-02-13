const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const usersController = require('../controllers/users');

const passportSignIn = passport.authenticate('jwt', { session: false });
const passportJWT = passport.authenticate('local', { session: false });

router.route('/signup')
    .post(validateBody(schemas.authSchema), usersController.signUp);

router.route('/signin')
    .post(validateBody(schemas.authSchema),passportSignIn, usersController.signIn);

router.route('/secret')
    .get(passportJWT, usersController.secret);

module.exports = router;