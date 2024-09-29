const connection = require('../Config/DatabaseConnection')
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const LoginInsert =  async(req,res) => {
    try{
        const saltRounds = 10;

        let { lid,useremail,password,userrole } = req.body
        if(!useremail && !password){
            return res.json({message:"All feilds are required"})
        }
        const passwordEncrypted = await bcrypt.hash(password, saltRounds);
      //  console.log(id)
        const results = await connection.query(
            `call InsertUpdateLogin(?, ?,?,?);`,
            [
              lid,
              useremail,
              passwordEncrypted,
              userrole
            ]
          );
   console.log(results)
    return res.json({success:"data submitted successfully"}); // we need to send return in json
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}
const LoginGet =  async(req,res) => {
    try{
        const saltRounds = 10;

        let { lid,useremail,password } = req.body
        const passwordEncrypted = await bcrypt.hash(password, saltRounds);
      //  console.log(id)
        const results = await connection.query(
            `call GetLogin();`,
            [ ]
          );
   console.log(results)
    return res.json({success:"data submitted successfully"}); // we need to send return in json
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}
const LoginGetByEmail =  async(req,res) => {
    try{
        

        let { useremail,password } = req.body
       
        const results = await connection.query(
            `call GetLoginByEmail(?);`,
            [ useremail ]
          );
          if (results[0].length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = results[0][0][0];
        console.log(user)
        const isMatch = await bcrypt.compare(password, user.Password);
        console.log(isMatch)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
   console.log(results)
    const token = jwt.sign({ id: user.ID, email: user.Email,role:user.role }, process.env.AccessToken_SecretKey, {
        expiresIn: '1h', // Token expires in 1 hour
    });
  
    res.cookie('jwt', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 1 * 60 * 60 * 1000 
    });

    return res.json({ success: "Login successful" });
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
}
const roleCheck = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission' });
        }
        next();
    };
};
module.exports = {
    LoginInsert,
    LoginGet,
    LoginGetByEmail,
    roleCheck
}