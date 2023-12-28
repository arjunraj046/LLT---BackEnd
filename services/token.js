const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

exports.verifyToken = async (token) => {
    try {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        console.log('Entered verify token', decodedToken);
        return decodedToken;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
};
