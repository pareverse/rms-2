import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
	{
		unit: {
			id: {
				type: String,
				default: ''
			}
		},
		image: {
			type: String,
			default: ''
		},
		name: {
			type: String,
			default: ''
		},
		email: {
			type: String,
			default: ''
		},
		contact: {
			type: String,
			default: ''
		},
		company: {
			name: {
				type: String,
				default: ''
			},
			email: {
				type: String,
				default: ''
			}
		},
		role: {
			type: String,
			default: 'User'
		},
		status: {
			type: String,
			default: 'Active'
		},
		created: {
			type: String,
			default: ''
		},
		updated: {
			type: String,
			default: ''
		}
	},
	{ timestamps: true }
)

const Users = mongoose.models.Users || mongoose.model('Users', UserSchema)

export default Users
