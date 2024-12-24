import mongoose, { Schema } from 'mongoose'

const participantSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	secret_friend: {
		type: String,
		required: true,
	},
})

const groupSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		organizer: {
			type: Schema.Types.ObjectId,
			ref: 'Organizer',
		},
		participants: [participantSchema],
	},
	{
		timestamps: true,
	},
)

export const Group = mongoose.model('Group', groupSchema)
