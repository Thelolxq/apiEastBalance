const User = require("../model/UserModel");
const bcrypt = require("bcryptjs");



const registerUser = async (req, res) => {
        const { username, email, password} = req.body;
        try{
            if(!username || !email || !password) {
                return res.status(400).json({ message: "Todos los campos son requeridos" });
            }
            const existingEmail = await User.findOne({ where: { Email: email } });
            if (existingEmail) {
                return res.status(400).json({ message: "El email ya existe" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                Username: username,
                Email: email,
                Password: hashedPassword,
            });

            const secureRresponse ={
                id: newUser.id,
                username: newUser.Username,
                email: newUser.Email,
            }
            res.status(201).json({ message: "User registered successfully", user: secureRresponse });
        }
        catch (error) {
        console.error("ERROR en registro:", error);
        if (error.name === 'SequelizeValidationError') {
             return res.status(400).json({
                status: 'fail',
                message: 'Datos inválidos',
                errors: error.errors.map(e => e.message)
            });
        }
        res.status(500).json({ status: 'error', message: "Error interno del servidor" });
        }

}

const loginUser = async (req, res)=>{
    const { email , password} = req.body;

    try{
        if(!email || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }
        const user = await User.findOne({ where: { Email: email } });
       
        if(!user || !(await bcrypt.compare(password, user.Password))) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const secureResponse = {
            id: user.id,
            username: user.Username,
            email: user.Email,
        };
        res.status(200).json({ message: "Login successful", user: secureResponse });
    }
    catch (error) {
        console.error("ERROR en login:", error);
        res.status(500).json({ status: 'error', message: "Error interno del servidor" });
    }
}

module.exports = {
    registerUser,
    loginUser,
};