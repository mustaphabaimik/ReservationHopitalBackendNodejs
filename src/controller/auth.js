const jwt=require('jsonwebtoken');
const {database}=require("../../config/db");
const path = require('path');


exports.signup=(req,res)=>{   
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
                    
                        database.query("INSERT INTO users(nom,prenom,email,password,photoUrl) VALUES('"+req.body.nom+"','"+req.body.prenom+"','"+req.body.email+"','"+req.body.password+"','"+img+"')")
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


exports.signin=(req,res)=>{  
    
    database.table('users as u')     
    .withFields(["u.id",
        'u.nom',
        'u.prenom',
        'u.email',
        'u.password',
        'u.photoUrl'
    ])
    .filter({'u.email':req.body.email })
    .get()
    .then(user => {    
        if (user) {
            if(user.password===req.body.password){
               const token =jwt.sign({id:user.id,email:user.email},process.env.JWT_SECRET,{expiresIn:'1h'});
               res.status(200).json({
                message:"Connecté avec succès",
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





