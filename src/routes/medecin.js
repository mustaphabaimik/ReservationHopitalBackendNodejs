const express=require('express');
const { getall, ajouterMedecin, signUpUser, signin, getone, changepass, getDocByServices } = require('../controller/medecin');
const router = express.Router();

const path = require('path');
const multer = require('multer');
const shortid = require('shortid');
const { loginAuthorisation } = require('../autorisations');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
});

const upload = multer({ storage });




router.get('/medecins',getall);
router.get('/medecinByService/:service',getDocByServices);
router.post('/medecins',ajouterMedecin);
router.post('/signUpUser',upload.single('photoUrl'),signUpUser);
router.post('/signInMedecin',signin);
router.get('/medecins/:email',getone);
router.post('/changepass',loginAuthorisation,changepass);





module.exports = router;