var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  })

module.exports = multer({ storage: storage }).array('image', 2);
