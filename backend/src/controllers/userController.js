import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const { username, email, password, confirmPassword } = req.body

        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Preencha todos os campos!" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres!" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "As senhas não conferem!" })
        }

        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "Este E-mail já está cadastrado!" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            status: 'offline'
        })

        await newUser.save()


        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            message: "Usuário criado com sucesso! 🎉"
        });
    } catch (error) {
        console.error("ERRO REAL:", error);
        res.status(500).json({ message: "Erro no servidor", error: error.message })
    }
}

export const loginUser = async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "Preencha todos os campos!" })
        }

        const user = await User.findOne({ email })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "E-mail ou senha inválidos!" })
        }

        if (user.isBanned) {
            return res.status(403).json({ message: "Sua conta foi banida do servidor!" })
        }

        /* TOKEN */
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '10s' }
        )

        user.status = 'online'
        await user.save()

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            status: user.status,
            token: token, // <--- ENVIA O TOKEN PARA O FRONT
            message: `Bem-vindo de volta, ${user.username}! ⚔️`
        })
    } catch (error) {
        console.error("ERRO REAL:", error);
        res.status(500).json({ message: "Erro no servidor", error: error.message })
    }
}