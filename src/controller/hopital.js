const {database}=require("../../config/db");


exports.getall=(req, res)=> {
    database.table('hopitaux as h')
        .withFields(['h.nom',
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
                const province =  removeduplicateprovince(data);
                res.status(200).json({ province });          
            } else {
                res.status(404).json({
                    message:"Aucune province trouvé"
                })
            }
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


