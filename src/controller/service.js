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

