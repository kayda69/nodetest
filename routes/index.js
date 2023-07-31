var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

var mongoose = require("mongoose")

var car = new mongoose.Schema({
  name: String,
  price: Number,
  date: String,
  img: Array
})

main().catch(err => console.log(err));

async function main() {
  const db= "mongodb+srv://admin:aofe4fKL7NSjUmvE@fpoly.nmoo5ba.mongodb.net/test"
  await mongoose.connect(db);

}

//
/* GET home page. */
router.get('/', async function(req, res, next) {
  var query = mongoose.model("test", car, "cars")
  var data = await query.find()
  res.render('index', {data:data});
});
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+".jpg");
  },
});

var upload = multer({ storage: storage });

router.post('/uploads', upload.array('carIMG'), async function(
  req,
  res,
  next
) {
  const carName = req.body.tenXe;
  const price = req.body.giaTien;
  const date = req.body.namSX;
  const files= req.files
  console.log(files)
  console.log(carName)
  var query = mongoose.model("test", car, "cars")
  await query.create({
    name: carName,
    price: price,
    date: date,
    img : files
  })

  res.redirect("/")
});
router.get("/remove", async function(req, res, next){
  var id = req.query.id
  var query = mongoose.model("test", car, "cars")
  await query.deleteOne({_id: id})
  res.redirect("/")
})

router.post('/updateItem', upload.array('carIMG'), async function(req, res, next) {
  const id=req.body.carId
  const carName = req.body.tenXe;
  const price = req.body.giaTien;
  const date = req.body.namSX;
  const files= req.files
  console.log(id)
  var query = mongoose.model("test", car, "cars")
  if(files.length<1){
 await query.updateOne({_id : id}, {
  name :carName,
  price :price,
  date: date,
 })
}
else{
  await query.updateOne({_id : id}, {
    name :carName,
    price :price,
    date: date,
    img :files
   })
}
  res.redirect("/")
});

module.exports = router;
