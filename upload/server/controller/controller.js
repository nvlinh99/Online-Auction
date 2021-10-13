const UploadModel = require('../model/schema');
const fs = require('fs');

exports.home = (req, res, next) => {
	res.json({
		message: 'Welcome to the uploads API'
	});
};

exports.getImage = async (req, res, next) => {
	const { imageName } = req.params;
	const img = await UploadModel.findOne({ filename: imageName });
	if(!img){
		res.status(404).json({
			message: 'Image not found'
		});
	}
	const contentType = img.contentType;
	const imageBase64 = img.imageBase64;
	const imgSrc = `data:${contentType};base64,${imageBase64}`;
	const buffer = new Buffer.from(imgSrc.replace(/^data:image\/\w+;base64,/, ""), 'base64'); 
	res.writeHead(200, {
		'Content-Type': `${contentType}`,
		'Content-Length': buffer.length
	});
	res.end(buffer); 
}

exports.uploads = (req, res , next) => {
    const files = req.files;

    if(!files){
        return res.status(400).json({
						message: 'Please choose files'
				});
    }
    // convert images into base64 encoding
    let imgArray = files.map((file) => {
			let img = fs.readFileSync(file.path)

			return encode_image = img.toString('base64')
	})

	let result = imgArray.map((src, index) => {
		let finalImg = {
			filename : files[index].originalname,
			contentType : files[index].mimetype,
			imageBase64 : src
		}
		let newUpload = new UploadModel(finalImg);

		return newUpload
		.save()
		.then(() => {
			return { msg : `${files[index].originalname} Uploaded Successfully...!`}
		})
		.catch(error =>{
			if(error){
				if(error.name === 'MongoError' && error.code === 11000){
					return Promise.reject({ error : `Duplicate ${files[index].originalname}. File Already exists! `});
				}
				return Promise.reject({ error : error.message || `Cannot Upload ${files[index].originalname} Something Missing!`})
			}
		})
	});

	Promise.all(result)
		.then( msg => {
				res.json(msg);
		})
		.catch(err =>{
				res.json(err);
		})
}