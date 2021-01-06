const {database}=require("../../config/db");
var nodemailer = require('nodemailer');
const jwt=require('jsonwebtoken');


exports.getall=(req, res)=> {
   
    database.table('medecin as m')
    .join([
        {
            table: "users as u",
            on: `m.id = u.id`
        },
        {
            table: "hopitaux as h",
            on: `h.ObjectId = m.hopital`
        },
        {
            table: "services as s",
            on: `s.id = m.service`
        }
        
    ])
    .withFields(['u.id',
        'u.nom',
        'u.prenom',
        'u.email',
        'u.photoUrl',
        'u.role',
        'm.specialite',
        'h.nom as hopital',
        's.nom as service'
    ])
    .getAll()
    .then(medecins => {
       
        if (medecins) {
            res.status(200).json(medecins);
        } else {
            res.json({message: "aucun medecin"});
        }
    }).catch(err => res.json(err));


}


exports.getDocByServices=(req, res)=> {
   
    database.table('medecin as m')
    .join([
        {
            table: "users as u",
            on: `m.id = u.id`
        },
        {
            table: "hopitaux as h",
            on: `h.ObjectId = m.hopital`
        },
        {
            table: "services as s",
            on: `s.id = m.service`
        }
        
    ])
    .withFields(['u.id',
        'u.nom',
        'u.prenom',
        'u.email',
        'u.photoUrl',
        'u.role',
        'm.specialite',
        'h.nom as hopital',
        's.nom as service'
    ])
    .filter({'s.nom':req.params.service })
    .getAll()
    .then(medecins => {
       
        if (medecins) {
            res.status(200).json(medecins);
        } else {
            res.json({message: "aucun medecin"});
        }
    }).catch(err => res.json(err));


}

exports.signUpUser=(req,res)=>{  
    
    console.log("bzaaaaaaafff");
    database.table('users as u')     
        .withFields(['u.nom',
            'u.prenom',
            'u.email',
            'u.password'
            // 'u.photoUrl'
        ])
        .filter({'u.email':req.body.email })
        .get()
        .then(user => {
            
            if (user) {
                res.status(404).json({
                    message:"Adresse e-mail déjà prise"
                }) 
            } else {
                let img;
                if(req.file){
                     img= "http://localhost:5000/public/"+req.file.filename;
                     
                }
                
                    database.query("INSERT INTO users(nom,prenom,email,password,photoUrl,role) VALUES('"+req.body.nom+"','"+req.body.prenom+"','"+req.body.email+"','"+Math.random().toString()+"','"+img+"','"+req.body.role+"')")
                    .then((value)=>{
                        res.status(201).json({
                            message:" votre compte a bien été crée"       
                        })
                    }).catch((err)=>{
                        res.status(404).json({
                            message:err
                        })
                    })  
              
                
            }
        }).catch(err => res.json(err));

}

exports.ajouterMedecin = (req, res) => {

    // console.log(req.body.nom);

    database.table('users as u')     
            .withFields(['u.id',
                'u.email',
                'u.password',
                'u.nom',
                'u.prenom'             
            ])
            .filter({'u.email':req.body.email })
            .get()
            .then(user => {
                
                if (user) {
                    
                    database.query("INSERT INTO medecin(id,specialite,hopital,service) VALUES('"+user.id+"','"+req.body.specialite+"','"+req.body.hopital+"','"+req.body.service+"')")
                    .then((value)=>{
                        res.status(201).json({
                            message:"votre compte a bien été crée"       
                        })
                    }).catch((err)=>{
                        res.status(404).json({
                            message:err
                        })
                    }) 
                    
                    
                    //send email

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                            user: 'mustaphabaimik@gmail.com',
                            pass: 'qqkdarxbaoniaepq'
                            }
                        });
                        
                        var mailOptions = {
                            from: 'mustaphabaimik@gmail.com',
                            to: user.email,
                            subject: 'mot de passe',
                            text: user.nom+ " " + user.prenom +" voila votre nom d'utilisateur et votre mot  pour acceder à l'application Medicio. "+ " nom utilisateur:  "+user.email+ "  mot de passe:  " + user.password +"  afin de protéger votre compte Veuillez s'il vous plait modifier votre mot de passe dès la premiere connexion"
                        };
                        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            console.log('Email sent: ' + info.response);
                            }
                        });
                    
                } else {
                    res.status(404).json({
                        message:"quelque chose s'est mal passé"
                    })
                    
                }
            }).catch(err => res.json(err));

            

    
}


exports.signin=(req,res)=>{  
    
    database.table('users as u')     
    .withFields(["u.id",
        'u.nom',
        'u.prenom',
        'u.email',
        'u.password',
        'u.role',
        'u.photoUrl'
    ])
    .filter({'u.email':req.body.email })
    .get()
    .then(user => {    
        if (user) {
            // return res.status(400).json({
            //             user:user
            //         })
            if(user.password===req.body.password && user.role==="medecin"){               
               const token =jwt.sign({id:user.id,role:user.role},process.env.JWT_SECRET,{expiresIn:'1h'});
               res.status(200).json({
                message:`Nous sommes ravis de vous revoir ${user.nom} ${user.prenom}`,
                user:user,
                status:res.statusCode,
                token
               });
            }
            else{
                return res.status(400).json({
                    message:"Le mot de passe entré est incorrect"
                })
            }
        } else {
            
            return res.status(400).json({
                message:"vous n'êtes pas encore inscrit"
            })
          
            
        }
    }).catch(err => res.json(err));
}

exports.getone=(req,res)=>{
    

    database.table('users as u')
    .join([
        {
          table: 'medecin as m',
          on: 'm.id = u.id'
        }
    ])
    .withFields(["m.etatpass"])
    .filter({'u.email':req.params.email })
    .get()
        .then(medecin => {
            // console.log(prod);
            if (medecin) {
                res.status(200).json(medecin);
            } else {
                res.json({message: "erreur"});
            }
    }).catch(err => res.json(err));
    
}



exports.changepass = (req, res) => {

    // console.log(req.body.nom);

    database.table('users as u')     
            .withFields(['u.id',
                'u.email',
                'u.password',
                'u.nom',
                'u.prenom'             
            ])
            .filter({'u.email':req.body.email })
            .get()
            .then(user => {
                
                if (user) {
                    
                    database.query(`UPDATE users SET password='${req.body.password}' where id=${user.id}`)
                    .then((value)=>{      
                        database.query(`UPDATE medecin SET etatpass='true' where id=${user.id}`)
                        .then((result)=>{
                            res.status(200).json({
                                message:"votre mot de passe a bien été modifié",
                                status:res.statusCode     
                            })
                        }).catch((er)=>{
                            res.status(404).json({
                                message:er
                            })
                        }) 
                    }).catch((err)=>{
                        res.status(404).json({
                            message:err
                        })
                    }) 
                    
                    
                    //send email

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                            user: 'mostafa.bmk09@gmail.com',
                            pass: 'mostafavsouiame'
                            }
                        });
                        
                        var mailOptions = {
                            from: 'mostafa.bmk09@gmail.com',
                            to: user.email,
                            subject: 'mot de passe',
                            text: user.nom+ " " + user.prenom +" voila votre nom d'utilisateur et votre mot  pour acceder à l'application Medicio. "+ " nom utilisateur:  "+user.email+ "  mot de passe:  " + user.password +"  afin de protéger votre compte Veuillez s'il vous plait modifier votre mot de passe dès la premiere connexion"
                        };
                        
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                            console.log(error);
                            } else {
                            console.log('Email sent: ' + info.response);
                            }
                        });
                    
                } else {
                    res.status(404).json({
                        message:"quelque chose s'est mal passé"
                    })
                    
                }
            }).catch(err => res.json(err));

            

    
}




