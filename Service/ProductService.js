const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');
const connection = require('../Config/DatabaseConnection');

const bulkInsertProducts  = async (req, res) => {
    try {
      
  
        const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];
  
        const products = xlsx.utils.sheet_to_json(sheet);
  
        if (!products || products.length === 0) {
          return res.status(400).json({ message: "No data found in Excel file" });
        }
  
        const chunkSize = 100;
        for (let i = 0; i < products.length; i += chunkSize) {
          const chunk = products.slice(i, i + chunkSize);
  
          await processChunk(chunk);
        }
  
        return res.json({ success: "Data submitted successfully" });
      
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  const getProducts = async ({ searchKeyword, sortOrder, page, pageSize }) => {
    const [results] = await connection.query(`CALL GetProduct(?, ?, ?, ?);`, [
        searchKeyword, sortOrder, page, pageSize
    ]);

    return results[0];  // Assuming this is the product data
};
const insertOrUpdateProduct = async ({ Pid, Name, ProductImage, ProductPrice, CategoryId }) => {
    // Validate CategoryId if present
    if (CategoryId !== "") {
        const [categoryData] = await connection.query("CALL GetCategoryId(?);", [Number(CategoryId)]);
        if (categoryData.length === 0) {
            throw new Error(`Category Id does not exist: ${CategoryId}`);
        }
    }

    // Insert or update product in the database
    const [results] = await connection.query(`CALL InsertUpdateProduct(?, ?, ?, ?, ?);`, [
        Pid, Name, ProductImage, ProductPrice, CategoryId
    ]);
    
    return results;
};
const processChunk = async (chunk) => {
    try {
      for (const item of chunk) {
        var isCategoryValid = false;
        const { pid, Name, ProductPrice, CategoryId, ProductImage } = item;
        let imageBuffer = null;
        if (Name == "" || ProductPrice == "" || CategoryId == "") {
          return res.json({ message: `All fields are required` });
        }
        if (CategoryId !== "") {
          const categoryData = await connection.query("CALL GetCategoryId(?);", [
            CategoryId,
          ]);
          if (categoryData.length == 0)
            return res.json({
              message: `Category Id is not exist ${CategoryId}`,
            });
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
        await connection.query("CALL InsertUpdateProduct(?, ?, ?, ?, ?);", [
          pid,
          Name,
          imageBuffer,
          ProductPrice,
          CategoryId,
        ]);
      }
    } catch (err) {
      throw err;
    }
  };
  const exportToExcel  = async (req, res) => {
    try {
      const results = await connection.query(`call GetExportoExcel();`, []);
      console.log(results[0][0]);
      const products = results[0][0];
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(products);
      xlsx.utils.book_append_sheet(workbook, worksheet, "Products");
      const fileName = "ProductData.xlsx";
      const filePath = path.join(__dirname, fileName);
      xlsx.writeFile(workbook, filePath);
      return filePath;
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
 
  module.exports = {
    bulkInsertProducts ,
    exportToExcel ,
    insertOrUpdateProduct,
    getProducts
   
  }