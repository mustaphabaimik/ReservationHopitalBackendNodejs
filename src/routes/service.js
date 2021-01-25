const express=require('express');
const { getall,ajouterService,ServiceToHop, servicesByHop, nouveauRdv, nouveauRdvSocial, getSocialuserRdv, getLocalUserRdv } = require('../controller/service');
const router = express.Router();





router.get('/services',getall);
router.post('/services',ajouterService);
router.post('/servicesToHop',ServiceToHop);
router.get('/servicesByHop/:idHopital',servicesByHop);
router.post('/rdv',nouveauRdv);
router.post('/rdvsocialuser',nouveauRdvSocial);
router.get('/socialUserRdv/:SocialUser',getSocialuserRdv);
router.get('/localUserRdv/:user',getLocalUserRdv);


module.exports = router;