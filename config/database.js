import mongoose from 'mongoose'

let connected = false

const connectDB = async () => {
	mongoose.set('strictQuery', true) // ensure that only specified fields in our schema will be saved

	//If the db is already connected, dont connect again
	if (connected) {
		console.log('MongoDB is already connected...')
		return
	}

	//Connect to MongoDB
	try {
		await mongoose.connect(process.env.MONGODB_URI)
		connected = true
		console.log('MongoDB connected...')
	} catch (error) {
		console.log(error)
	}
}

export default connectDB
