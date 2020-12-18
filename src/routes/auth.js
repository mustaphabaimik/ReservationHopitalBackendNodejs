
const express=require('express');
const { signup,signin } = require('../controller/auth');

const router = express.Router();
const {database}=require("../../config/db");
const path = require('path');
const multer = require('multer');
const shortid = require('shortid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
});

const upload = multer({ storage });






router.post('/signup',upload.single('photoUrl'),signup);
router.post('/signin',signin);




router.get('/getall', function (req, res) {
    database.table('users as u')
        .withFields(['u.nom',
            'u.prenom',
            'u.email'
        ])
        .getAll()
        .then(users => {
            if (users.length > 0) {
                res.status(200).json({
                    users: users
                });
            } else {
                res.json({message: "Aucun produits trouvé"});
            }
        })
        .catch(err => console.log(err));
});










module.exports = router;