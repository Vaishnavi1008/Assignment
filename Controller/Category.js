const connection = require('../Config/DatabaseConnection')


const CategoryInsertUpdate =  async(req,res) => {
    try{
        let { pid,CategoryName } = req.body
      //  console.log(id)
      if(!CategoryName){
        return res.json({message:"Category Name is required"})
      }
        const results = await connection.query(
            `call InsertUpdateCategory(?, ?);`,
            [
              pid,
              CategoryName
            ]
          );
   console.log(results)
    return res.json({success:"data submitted successfully"}); // we need to send return in json
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}
const CategoryGet =  async(req,res) => {
    try{
        
        const results = await connection.query(
            `call GetCategory();`,
            []
          );
   console.log(results)
    return res.json({results:results[0]}); // we need to send return in json
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}

module.exports = {
    CategoryInsertUpdate,
    CategoryGet
}
