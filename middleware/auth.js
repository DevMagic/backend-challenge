const jwt = require('jsonwebtoken');

exports.newToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        process.env.JWT_SECRET || 'usd89f6ysd88fsd6f87s',
        {
            expiresIn: '24h',
        }
    );
};

exports.isAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (auth) {
        const token = auth.slice(7, auth.length);
        jwt.verify(
            token,
            process.env.JWT_SECRET || 'usd89f6ysd88fsd6f87s',
            (err, decoded) => {
                if (err) {
                    res.status(401).send({ message: 'Token inválido' });
                } else {
                    req.user = decoded;
                    console.log(req.user);
                    next();
                }
            }
        );
    } else {
        res.status(401).send({ message: 'Token não fornecido' });
    }
};