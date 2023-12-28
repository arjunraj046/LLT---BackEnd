const bcrypt = require('bcrypt');

// Hashing a password
exports.passwordHashing = async (password) => {
    try {
        const saltRounds = 10;
        let hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (err) {
        console.error("Hashing error", err);
        return null;
    }
};

// Password comparison function
exports.passwordComparing = async (hashedPassword, userPassword) => {
    try {
        const result = await bcrypt.compare(userPassword, hashedPassword);
        if (result) {
            console.log('Passwords match!',result);
            return true;
        } else {
            console.log('Passwords do not match!');
            return false;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
};
