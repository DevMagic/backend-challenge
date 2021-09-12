const express = require('express'); 
const router = express.Router();
const userControllers = require('../controllers/userController')

router.post('/register',userControllers.createUser);
router.post('/login',userControllers.login);
module.exports = router