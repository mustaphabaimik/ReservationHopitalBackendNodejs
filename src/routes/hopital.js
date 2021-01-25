const express=require('express');
const { getall, getRegions, getProvinces, getHopByProvince, getHopByRegion, getHopByName, filterHopitaux, getByRegProv, getByRegName, getByProvName, statisReservHop, statisNbrReser, getOne } = require('../controller/hopital');
const router = express.Router();



router.get('/hopitaux',getall);
router.get('/hopitaux/:idHop',getOne);
router.get('/regions',getRegions);
router.get('/provinces',getProvinces);
router.get('/hopitaux/:province',getHopByProvince);
router.get('/hopitauxByRegion/:region',getHopByRegion);
router.get('/hopitauxByName/:nom',getHopByName);
router.get('/filterhopitaux/:nom/:province/:region',filterHopitaux);
router.get('/hopitauxByRegProv/:region/:province',getByRegProv);
router.get('/hopitauxByRegName/:region/:nom',getByRegName);
router.get('/hopitauxByProvName/:province/:nom',getByProvName);
router.get('/statisReservHop',statisReservHop);
router.get('/statisNbrReser',statisNbrReser);





module.exports = router;