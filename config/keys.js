module.exports = {
    mongoURI : process.env.MONGO_URI || 'mongodb://localhost:27017/devconnect',
    jwtKey : process.env.JWT_SECRET || 'freak'
}