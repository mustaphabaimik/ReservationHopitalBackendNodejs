const { json } = require("body-parser");
const {database}=require("../../config/db");
const shortid = require('shortid');


exports.getall=(req, res)=> {
    database.table('services as s')
        .withFields(['s.id',
            's.nom'
        ])
        .getAll()
        .then(data => {
            if (data.length > 0) {
                res.status(200).json({
                    services: data
                });
            } else {
                res.status(404).json({
                    message:"Aucun service trouvé"
                }) 
            }
        })
        .catch(err => console.log(err));
}





exports.ajouterService = (req, res,next) => {

    slug=shortid.generate()+"-"+req.body.nom;
    
    database.query("INSERT INTO services(nom,slug) VALUES('"+req.body.nom+"','"+slug+"')")
    .then((value)=>{
        res.status(201).json({
            message:"votre service a bien été crée",
            slug:slug      
        })
    }).catch((err)=>{
        res.status(404).json({
            message:err
        })
    })
    
   


};


exports.ServiceToHop = (req, res) => {

    database.table('services as s')
    .withFields(['s.id',
        's.nom',
        's.slug'
    ])
    .filter({'s.slug': req.body.slug})
    .get()
    .then(serv => {
       
        if (serv) {
           console.log(serv.id);
           for(let i of req.body.hopitaux){
               
                //insertion
                database.query("INSERT INTO hopitalservice(hopital,service) VALUES('"+i+"','"+serv.id+"')")
                .then((value)=>{
                    res.status(201).json({
                        message:"votre service a bien été crée",
                            
                    })
                }).catch((err)=>{
                    res.status(404).json({
                        message:err
                    })
                })
           }
        } else {
            res.json({message: "error"});
        }
    }).catch(err => res.json(err));
   


};

exports.servicesByHop = (req, res) => {
   
    database.table('services as s')
    .join([
        {
            table: "hopitalservice as hs",
            on: `s.id = hs.service`
        }
    ])
    .withFields(['s.id',
        's.nom'
    ])
    .filter({'hs.hopital': req.params.idHopital})
    .getAll()
    .then(services => {
        // console.log(prod);
        if (services) {
            res.status(201).json({
                services:services         
            })
        } else {
            res.json({message: "aucun service"});
        }
    }).catch(err => res.json(err));
    


};

//rendez-vous local user
exports.nouveauRdv = (req, res,next) => {

  

    database.table('rdv as r')     
    .withFields(['r.daterdv',
        'r.heurerdv'
    ])
    .filter({'r.daterdv':req.body.daterdv,'r.heurerdv':req.body.heurerdv,'r.hopital':req.body.hopital,'r.service':req.body.service,'r.medecin':req.body.medecin})
    .get()
    .then(rdv => {
        
        if (rdv) {
            res.status(404).json({
                message:"rendez-vous déjà pris"
            }) 
            
        } else {
          
            
                database.query(`INSERT INTO rdv(daterdv,heurerdv,user,hopital,service,medecin) VALUES('${req.body.daterdv}','${req.body.heurerdv}',${req.body.user},${req.body.hopital},${req.body.service},${req.body.medecin})`)
                .then((value)=>{
                    res.status(201).json({
                        message:"votre rendez-vous a bien été pris"       
                    })
                }).catch((err)=>{
                    res.status(404).json({
                        message:err
                    })
                }) 
        
          
            
        }
    }).catch(err => res.json(err));



    
    
    
   
   


};


//rendez-vous social user
exports.nouveauRdvSocial = (req, res,next) => {
    database.table('rdv as r')     
    .withFields(['r.daterdv',
        'r.heurerdv'
    ])
    .filter({'r.daterdv':req.body.daterdv,'r.heurerdv':req.body.heurerdv,'r.hopital':req.body.hopital,'r.service':req.body.service,'r.medecin':req.body.medecin})
    .get()
    .then(rdv => {
        
        if (rdv) {
            res.status(404).json({
                message:"rendez-vous déjà pris"
            }) 
            
        } else {
          
            
            database.query(`INSERT INTO rdv(daterdv,heurerdv,hopital,service,medecin,SocialUser) VALUES('${req.body.daterdv}','${req.body.heurerdv}',${req.body.hopital},${req.body.service},${req.body.medecin},${req.body.SocialUser})`)
            .then((value)=>{
                res.status(201).json({
                    message:"votre rendez-vous a bien été pris"       
                })
            }).catch((err)=>{
                res.status(404).json({
                    message:err
                })
            }) 
        
          
            
        }
    }).catch(err => res.json(err));
    
   

};

//rendez-vous social user
exports.getSocialuserRdv = (req, res,next) => {

    database.table('rdv as r')
    .join([
            {
                table: "hopitaux as h",
                on: `h.ObjectId = r.hopital`
            },
            {
                table: "services as s",
                on: `s.id = r.service`
            },
            {
                table: "medecin as m",
                on: `m.id = r.medecin`
            },
            {
                table: "users as u",
                on: `u.id = m.id`
            }
        ])
    .withFields(['r.id',
        'r.daterdv',
        'r.heurerdv',
        'h.nom as hopital',
        's.nom as service',
        'u.nom as medecin'
    ])
    .filter({'r.SocialUser': req.params.SocialUser})
    .getAll()
    .then(data => {
        if (data.length > 0) {
            res.status(200).json(data);
           
        } else {
            res.status(404).json({
                message:"Aucun rdv trouvé"
            }) 
        }
    })
    .catch(err => console.log(err));

    // console.log(req.params.SocialUser);
    
    // database.table('rdv as r')
    // // .join([
    // //     {
    // //         table: "hopitaux as h",
    // //         on: `h.ObjectId = r.hopital`
    // //     }
    // //     // {
    // //     //     table: "services as s",
    // //     //     on: `s.id = r.service`
    // //     // },
    // //     // {
    // //     //     table: "medecin as m",
    // //     //     on: `m.id = r.medecin`
    // //     // },
    // //     // {
    // //     //     table: "users as u",
    // //     //     on: `u.id = m.id`
    // //     // }
    // // ])
    // .withFields(['r.daterdv',
    //     'r.heurerdv'
    //     // 'h.nom',
    //     // 's.nom',
    //     // 'u.nom'
    // ])
    // // .filter({'r.SocialUser': req.params.SocialUser})
    // .getAll()
    // .then(services => {
    //     // console.log(prod);
    //     if (data) {
    //         res.status(201).json({
    //             rdv:data         
    //         })
    //     } else {
    //         res.json({message: "aucun service"});
    //     }
    // }).catch(err => res.json(err));
    

};


exports.getLocalUserRdv = (req, res,next) => {

    database.table('rdv as r')
    .join([
            {
                table: "hopitaux as h",
                on: `h.ObjectId = r.hopital`
            },
            {
                table: "services as s",
                on: `s.id = r.service`
            },
            {
                table: "medecin as m",
                on: `m.id = r.medecin`
            },
            {
                table: "users as u",
                on: `u.id = m.id`
            }
        ])
    .withFields(['r.id',
        'r.daterdv',
        'r.heurerdv',
        'h.nom as hopital',
        's.nom as service',
        'u.nom as medecin'
    ])
    .filter({'r.user': req.params.user})
    .getAll()
    .then(data => {
        if (data.length > 0) {
            res.status(200).json(data);
           
        } else {
            res.status(404).json({
                message:"Aucun rdv trouvé"
            }) 
        }
    })
    .catch(err => console.log(err));

};

