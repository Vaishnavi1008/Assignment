const connection = require('../DatabaseConnection')
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const ExporttoExcel = async(req,res) => {
    try{
        
        const results = await connection.query(
            `call GetExportoExcel();`,
            []
          );
          console.log(results[0][0])
        const products = results[0][0]
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(products);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Products');
        const fileName = 'ProductData.xlsx';
        const filePath = path.join(__dirname, fileName);
        xlsx.writeFile(workbook, filePath);
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.log('Error in downloading file:', err);
                return res.status(500).json({ message: 'Error in downloading file' });
            }
          
        })
    
         return res.status(200).json({message:"Downloaded Successfully"})
}


    catch(err){
        res.status(400).json({message:err.message})
    }
}
module.exports={
    ExporttoExcel
}