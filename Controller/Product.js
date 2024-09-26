const connection = require("../Config/DatabaseConnection");
const productService = require("../Service/ProductService");
const upload = require("../Config/Multer");
const path = require("path");

const ProductBulkInsert = async (req, res) => {
  try {
    upload.single("file")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "File upload error: " + err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Call service function to bulk insert products
      const result = await productService.bulkInsertProducts(req.file.buffer);
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// Controller for exporting products to Excel
const ExportToExcel = async (req, res) => {
  try {
    const filePath = await productService.exportToExcel();
    const fileName = "ProductData.xlsx";

    // Download the file
    res.download(filePath, fileName, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error in downloading file" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const ProductInsertUpdate = async (req, res) => {
  try {
    const uploadImage = upload.single("ProductImage");
    uploadImage(req, res, async (err) => {
      //  console.log('Files:', req.files);
      if (err) {
        return res
          .status(400)
          .json({ message: "File upload error: " + err.message });
      }

      const { Pid, Name, ProductPrice, CategoryId } = req.body;
      console.log(CategoryId, "Name");
      if (Name == "" || ProductPrice == "" || CategoryId == "") {
        return res.json({ message: `All fields are required` });
      }

      const ProductImage = req.file ? req.file.buffer : null;

      const result = await productService.insertOrUpdateProduct({
        Pid,
        Name,
        ProductImage,
        ProductPrice,
        CategoryId,
      });

      console.log(results);
      return res.json({ success: "Data submitted successfully" });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const ProductGet = async (req, res) => {
  try {
    const { searchKeyword, sortOrder, page, pageSize } = req.body;

    const results = await productService.getProducts({
      searchKeyword,
      sortOrder,
      page,
      pageSize,
    });

    return res.json({ results: results[0] }); // we need to send return in json
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  ProductBulkInsert,
  ProductGet,
  ProductInsertUpdate,
  ExportToExcel,
};
