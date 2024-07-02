import mongoose from 'mongoose';

const connection = () => {
    mongoose.connect(process.env.DB_URL, {
        dbName: "Main"
    });
    mongoose.connection.on('connected', () => {
        console.log('Mongoose is connected');
    });
    mongoose.connection.on('error', (err) => {
        console.log('Mongoose is not connected, error: ' + err);
    });
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose is disconnected');
    });
};

export default connection;