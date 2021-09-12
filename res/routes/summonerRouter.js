const express = require('express'); 
const router = express.Router();
const summonerControllers = require('../controllers/summonerController')
const authorization = require("../middleware/authorization")

router.post('/register',authorization,summonerControllers.cadSummoner);
router.post('/xlsx',authorization,summonerControllers.generateXlsx);
router.get('/',authorization,summonerControllers.showAllSummoners)
router.get('/detailed/:nickname/:summonerLevelMin/:summonerLevelMax/:winsMin/:winsMax/:lossesMin/:lossesMax',authorization,summonerControllers.showAllSummonersDetailed)
router.delete('/',authorization,summonerControllers.deleteSummoner)
router.put('/',authorization,summonerControllers.updateSummoner)
module.exports = router