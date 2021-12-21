const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { newToken } = require('../middleware/auth');

// Criando um novo usuário
exports.createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ where: { email } })

        if (userExists) {
            return res.status(400).json({ error: 'Este e-mail já está em uso.' });
        }

        const newUser = await User.create({
            name, email, password: await bcrypt.hash(password, 10)
        });

        const { id } = newUser;

        return res.status(201).json({ id, name, email });

    } catch (err) {
        return res.status(400).json({ error: err });
    }
};

// Login de usuário
exports.userLogin = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        const user = await User.findOne({ where: { email, name } });

        if (!user) {
            return res.status(400).json({ error: 'Dados inválidos.' });
        }
        const comparePassw = await bcrypt.compare(password, user.password);

        if (!comparePassw) {
            return res.status(400).json({ error: 'Dados inválidos.' });
        }

        return res.json({
            token: newToken(user)
        });

    } catch (err) {
        return res.status(400).json({ error: err })
    }
};