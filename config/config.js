module.exports = {
	port: process.env.port || 3000,
	database: process.env.MONGOLAB_URI || "mongodb://localhost/wdi-project-3",
	secret: process.env.SECRET || "ADs&*hel02#£!!jsbbX"
}