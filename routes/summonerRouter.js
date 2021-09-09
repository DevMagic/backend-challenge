const express = require('express'); 
const router = express.Router();
const summonerControllers = require('../controllers/summonerController')
const authorization = require("../middleware/authorization")

router.post('/register',authorization,summonerControllers.cadSummoner);
router.get('/',authorization,summonerControllers.showAllSummoners)
router.delete('/',authorization,summonerControllers.deleteSummoner)
router.put('/',authorization,summonerControllers.updateSummoner)
module.exports = router