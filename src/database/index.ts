import mongoose from 'mongoose'

export function connectDatabase() {
	try {
		mongoose.connect(process.env.MONGODB_URI as string)
		console.log('📦 Connected to database')
	} catch (err) {
		console.error(`Error connecting to database: ${err}`)
	}
}
