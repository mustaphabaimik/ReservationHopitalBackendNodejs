const MySqli=require('mysqli');

let cnx=new MySqli({
   host:'localhost',
    post:3306,
    user:'root',
    passwd:'',
    db:'pfa'
});

let dbb=cnx.emit(false,'');

module.exports={
    database:dbb
};