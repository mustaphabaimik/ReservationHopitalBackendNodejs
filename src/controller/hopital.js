const {database}=require("../../config/db");


exports.getall=(req, res)=> {
    database.table('hopitaux as h')
        .withFields(['h.ObjectId',
            'h.nom',
            'h.province',
            'h.region'
        ])
        .getAll()
        .then(data => {
            if (data.length > 0) {
                res.status(200).json({
                    hopitaux: data
                });
            } else {
                res.status(404).json({
                    message:"Aucun hopital trouvé"
                }) 
            }
        })
        .catch(err => console.log(err));
}

exports.getOne=(req, res)=> {
   
    

    database.table('hopitaux as h')
        .withFields(['h.ObjectId',
        'h.nom',
        'h.x',
        'h.y'
        ])
        .filter({'h.ObjectId': req.params.idHop})
        .get()
        .then(hopital => {
           
            if (hopital) {
                res.status(200).json(hopital);
            } else {
                res.json({message: `Désolé, aucun résultat ne correspond à votre recherche.`});
            }
        }).catch(err => res.json(err));
}



exports.getHopByProvince=(req, res)=> {

   
    database.table('hopitaux as h')
        .withFields(['h.nom',
            'h.province',
            'h.region'
        ])
        .filter({'h.province': req.params.province })
        .getAll()
        .then(data => {
            if (data.length > 0) {
                res.status(200).json({
                    hopitaux: data
                });
            } else {
                res.status(404).json({
                    message:"Aucun hopital trouvé"
                }) 
            }
        })
        .catch(err => console.log(err));
}
exports.getHopByRegion=(req, res)=> {

   
    database.table('hopitaux as h')
        .withFields(['h.nom',
            'h.province',
            'h.region'
        ])
        .filter({'h.region': req.params.region })
        .getAll()
        .then(data => {
            if (data.length > 0) {
                res.status(200).json({
                    hopitaux: data
                });
            } else {
                res.status(404).json({
                    message:"Aucun hopital trouvé"
                }) 
            }
        })
        .catch(err => console.log(err));
}

exports.getHopByName=(req, res)=> {

    database.query(`SELECT nom,province,region FROM hopitaux where nom like '%${req.params.nom}%'`)
    .then((data)=>{
        if (data.length > 0) {
            res.status(200).json({
                hopitaux: data
            });
        } else {
            res.status(404).json({
                message:"Aucun hopital trouvé"
            }) 
        }
    }).catch((err)=>{
        res.status(404).json({
            message:err
        })
    });
   
    
}

exports.filterHopitaux=(req, res)=> {

    database.query(`SELECT nom,province,region FROM hopitaux where nom like '%${req.params.nom}%' AND province='${req.params.province}' AND region='${req.params.region}'`)
    .then((data)=>{
        if (data.length > 0) {
            res.status(200).json({
                hopitaux: data
            });
        } else {
            res.status(404).json({
                message:"Aucun hopital trouvé"
            }) 
        }
    }).catch((err)=>{
        res.status(404).json({
            message:err
        })
    })  
   
    .catch(err => console.log(err));
}

exports.getByRegProv=(req, res)=> {

    database.query(`SELECT nom,province,region FROM hopitaux where province='${req.params.province}' AND region='${req.params.region}'`)
    .then((data)=>{
        if (data.length > 0) {
            res.status(200).json({
                hopitaux: data
            });
        } else {
            res.status(404).json({
                message:"Aucun hopital trouvé"
            }) 
        }
    }).catch((err)=>{
        res.status(404).json({
            message:err
        })
    })  
   
    .catch(err => console.log(err));
}

exports.getByRegName=(req, res)=> {

    database.query(`SELECT nom,province,region FROM hopitaux where nom like '%${req.params.nom}%' AND region='${req.params.region}'`)
    .then((data)=>{
        if (data.length > 0) {
            res.status(200).json({
                hopitaux: data
            });
        } else {
            res.status(404).json({
                message:"Aucun hopital trouvé"
            }) 
        }
    }).catch((err)=>{
        res.status(404).json({
            message:err
        })
    })  
   
    .catch(err => console.log(err));
}

exports.getByProvName=(req, res)=> {

    database.query(`SELECT nom,province,region FROM hopitaux where nom like '%${req.params.nom}%' AND province='${req.params.province}'`)
    .then((data)=>{
        if (data.length > 0) {
            res.status(200).json({
                hopitaux: data
            });
        } else {
            // res.json({message: "Aucun hopital trouvé"});
            res.status(404).json({
                message:"Aucun hopital trouvé"
            }) 
        }
    }).catch((err)=>{
        res.status(404).json({
            message:err
        })
    })  
   
    .catch(err => console.log(err));
}

exports.getRegions=(req, res)=> {
    database.table('hopitaux as h')
        .withFields([
            'h.region'
        ])
        .getAll()
        .then(data => {
            if (data.length > 0) {
                const regions =  removeduplicate(data);
                res.status(200).json({ regions });          
            } else {
                
                res.status(404).json({
                    message:"Aucune region trouvé"
                }) 
            }
        })
        .catch(err => console.log(err));
}

exports.getProvinces=(req, res)=> {
    database.table('hopitaux as h')
        .withFields([
            'h.province'
        ])
        .getAll()
        .then(data => {
            if (data.length > 0) {
                const provinces =  removeduplicateprovince(data);
                res.status(200).json({ provinces });          
            } else {
                res.status(404).json({
                    message:"Aucune province trouvé"
                })
            }
        })
        .catch(err => console.log(err));
}

exports.statisReservHop=(req, res)=> {
    // ${req.params.nom}

    database.query("select h.nom as 'hopital',count(r.hopital) as 'nbr' from rdv r inner join hopitaux h on h.ObjectId=r.hopital group by h.nom")
    .then((data)=>{
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            // res.json({message: "Aucun hopital trouvé"});
            res.status(404).json({
                message:"pas de reservation"
            }) 
        }
    }).catch((err)=>{
        res.status(404).json({
            message:err
        })
    })  
   
    .catch(err => console.log(err));
}

exports.statisNbrReser=(req, res)=> {
    // ${req.params.nom}

    database.query("select count(id) as 'nbr' from rdv")
    .then((data)=>{
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            // res.json({message: "Aucun hopital trouvé"});
            res.status(404).json({
                message:"pas de reservation"
            }) 
        }
    }).catch((err)=>{
        res.status(404).json({
            message:err
        })
    })  
   
    .catch(err => console.log(err));
}


function removeduplicate(regions){ 
        var cache = {};
        regions = regions.filter(function(elem,index,array){
            return cache[elem.region]?0:cache[elem.region]=1;
        });
        console.log(regions);
        return regions;
   
}

function removeduplicateprovince(regions){ 
    var cache = {};
    regions = regions.filter(function(elem,index,array){
        return cache[elem.province]?0:cache[elem.province]=1;
    });
    console.log(regions);
    return regions;

}





