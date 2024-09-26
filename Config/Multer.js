const multer = require('multer');


const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// Export the upload middleware to be used in other parts of the application
module.exports = upload;
