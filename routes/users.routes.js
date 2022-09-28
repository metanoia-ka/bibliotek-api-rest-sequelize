const express = require('express');
const router = express.Router();

const { signUp, signIn, authGuard } = require('../controllers/auth.controller');
const { getOneUser, updateUser } = require('../controllers/users.controller');

//REGISTRATION AN USER
router.post('/register', signUp);
router.post('/login', signIn);

//GET ONE USER BY UUID
router.get('/users/:uuid', authGuard, getOneUser);

//UPDATE AN USER
router.put('/users/update/:uuid', authGuard, updateUser);

module.exports = router;