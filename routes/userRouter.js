const express = require('express'); 
const router = express.Router();
const userControllers = require('../controllers/userController')

router.post('/register',userControllers.createUser);

module.exports = router