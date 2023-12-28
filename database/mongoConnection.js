const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://arjun:HVUlAqvmeEAbOSTk@cluster0.deb5y4o.mongodb.net/LLT", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`📡... Database successfully connected!`);
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
}
module.exports = connectDB
