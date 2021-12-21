const router = require('express').Router();
const SummonerCtrl = require('../controllers/SummonerCtrl');

const { isAuth } = require('../middleware/auth');

// Todas as rotas abaixo precisam receber o bearer token

router.post('/create', isAuth, SummonerCtrl.createSummoner);

router.get('/', isAuth, SummonerCtrl.getSummoners);

router.get('/:id', isAuth, SummonerCtrl.getSummonersDetails);

router.put('/:id', isAuth, SummonerCtrl.updateSummoner);

router.delete('/:id', isAuth, SummonerCtrl.deleteSummoner);

router.post('/export', isAuth, SummonerCtrl.exportSum);


module.exports = router;