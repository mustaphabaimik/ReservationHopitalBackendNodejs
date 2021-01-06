const express=require('express');
const { getall,ajouterService,ServiceToHop, servicesByHop } = require('../controller/service');
const router = express.Router();





router.get('/services',getall);
router.post('/services',ajouterService);
router.post('/servicesToHop',ServiceToHop);
router.get('/servicesByHop/:idHopital',servicesByHop);


module.exports = router;