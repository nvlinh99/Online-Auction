const multer = require('multer');
const path = require('path');
// set storage
var storage = multer.diskStorage({
    destination : function ( req , file , cb ){
			cb(null, path.join(__dirname,'../uploads'))
        // cb(null, 'uploads')
    },
    filename : function (req, file , cb){
			cb(null, file.originalname);
        // // image.jpg
        // var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));

        // cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})

module.exports = store = multer({ storage : storage })