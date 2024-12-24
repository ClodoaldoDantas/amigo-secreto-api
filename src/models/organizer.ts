import mongoose, { Schema } from 'mongoose'

const organizerSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
)

export const Organizer = mongoose.model('Organizer', organizerSchema)
