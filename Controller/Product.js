const connection = require('../DatabaseConnection')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const uploadImage = upload.array('ProductImage')
// const ProductBulkInsert=  async(req,res) => {
//     try{
        
//         uploadImage(req, res, async (err) => {
//           //  console.log('Files:', req.files);
//             if (err) {
//                 return res.status(400).json({ message: 'File upload error: ' + err.message });
//             }
//             const products = Object.keys(req.body)
//                 .filter(key => key.startsWith('products['))
//                 .reduce((acc, key) => {
//                     const index = key.match(/\d+/)[0]; // Extract the index from the key
//                     const field = key.split('.').pop(); // Get the field name

//                     if (!acc[index]) {
//                         acc[index] = {};
//                     }

//                     acc[index][field] = req.body[key]; // Add the value to the product object

//                     return acc;
//                 }, []);
//             console.log(products)
//             console.log(req.body)
//             if (!products || products.length === 0) {
//                 return res.status(400).json({ message: 'Invalid input data' });
//             }

            
//             if (req.files.length !== products.length) {
//                 return res.status(400).json({ message: 'Mismatch between number of images and products' });
//             }
//             const productsWithImages = products.map((product, index) => ({
//                 ...product,
//                 ProductImage: req.files[index] ? req.files[index].buffer : null,
//             }));
//             const chunkSize = 100;
//             const chunks = [];
//             for (let i = 0; i < productsWithImages.length; i += chunkSize) {
//                 chunks.push(productsWithImages.slice(i, i + chunkSize));
//             }

//             await Promise.all(chunks.map(chunk => processChunk(chunk)));
//         //     const ProductImage = req.file ? req.file.buffer : null;
//         //     console.log(ProductImage)
//         //      const results = await connection.query(
//         //     `call InsertUpdateProduct(?, ?,?,?,?);`,
//         //     [
//         //       pid,
//         //       Name,
//         //       ProductImage,
//         //       ProductPrice,
//         //       CategoryId
//         //     ]
//         //   );
//         //   console.log(results)
//          return res.json({success:"data submitted successfully"}); 
//         })
       

       
   
//     }
//     catch(err){
//         res.status(400).json({message:err.message})
//     }
// }
const processChunk = async (chunk) => {
 
    try {
       
        for (const item of chunk) {
            var isCategoryValid = false;
            const { pid, Name, ProductPrice, CategoryId, ProductImage } = item;
            let imageBuffer = null;
            if(Name == "" || ProductPrice == "" || CategoryId == ""){
                return res.json({message:`All fields are required`})
            }
            if(CategoryId !== ""){
              const categoryData =  await connection.query(
                    'CALL GetCategoryId(?);',
                    [CategoryId]
                );
                if(categoryData.length == 0)
                    return res.json({message:`Category Id is not exist ${CategoryId}`})
            }
            
             if (ProductImage) {
                const imagePath = path.resolve(ProductImage); 
                if (fs.existsSync(imagePath)) {
                    imageBuffer = fs.readFileSync(imagePath); 
                } else {
                    console.log(`Image not found at path: ${imagePath}`);
                    continue; // Skip this product if the image doesn't exist
                }
            }
            await connection.query(
                'CALL InsertUpdateProduct(?, ?, ?, ?, ?);',
                [pid, Name, imageBuffer, ProductPrice, CategoryId]
            );
        }
    } catch (err) {
        throw err; 
    } 
};
const ProductInsertUpdate=  async(req,res) => {
    try{
        const uploadImage = upload.single('ProductImage')
        uploadImage(req, res, async (err) => {
          //  console.log('Files:', req.files);
            if (err) {
                return res.status(400).json({ message: 'File upload error: ' + err.message });
            }
         
            const {Pid,Name,ProductPrice,CategoryId} = req.body
            console.log(CategoryId,"Name")
            if(Name == "" || ProductPrice == "" || CategoryId == ""){
                return res.json({message:`All fields are required`})
            }
            if(CategoryId !== ""){
                var cid = CategoryId
              const categoryData =  await connection.query(
                    'CALL GetCategoryId(?);',
                    [Number(cid)]
                );
                if(categoryData.length == 0)
                    return res.json({message:`Category Id is not exist ${CategoryId}`})
            }
            const ProductImage = req.file ? req.file.buffer : null;
            console.log(ProductImage)
             const results = await connection.query(
            `call InsertUpdateProduct(?, ?,?,?,?);`,
            [
                Pid,
              Name,
              ProductImage,
              ProductPrice,
              CategoryId
            ]
          );
          console.log(results)
         return res.json({success:"data submitted successfully"}); 
        })
       

       
   
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}
const ProductGet =  async(req,res) => {
    try{
        const { searchKeyword,sortOrder,page,pageSize} = req.body
        
        const results = await connection.query(
            `call GetProduct(?,?,?,?);`,
            [
                searchKeyword,
                sortOrder,
                page,
                pageSize
            ]
          );
   console.log(results)
   bytearrqaytoimga(results[0][0][0].ProductImage)
    return res.json({results:results[0]}); // we need to send return in json
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}
const ProductBulkInsert = async (req, res) => {
    try {
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'File upload error: ' + err.message });
            }

            // Ensure a file is uploaded
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Get the first sheet
            const sheet = workbook.Sheets[sheetName];

            
            const products = xlsx.utils.sheet_to_json(sheet);

            
            if (!products || products.length === 0) {
                return res.status(400).json({ message: 'No data found in Excel file' });
            }

            
            const chunkSize = 100;
            for (let i = 0; i < products.length; i += chunkSize) {
                const chunk = products.slice(i, i + chunkSize);

                await processChunk(chunk);
            }

            return res.json({ success: "Data submitted successfully" });
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
const bytearrqaytoimga = (byteArray) => {
    console.log(byteArray)
    const outputPath = path.join(__dirname, 'output-image.png');


const buffer = Buffer.from(byteArray);


fs.writeFile(outputPath, buffer, (err) => {
    if (err) {
        console.error('Error saving image:', err);
    } else {
        console.log('Image saved successfully to', outputPath);
    }
});
}

module.exports = {
    ProductBulkInsert,
    ProductGet,
    ProductInsertUpdate
}
