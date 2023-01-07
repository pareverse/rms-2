import mongoose from 'mongoose'

const UnitSchema = mongoose.Schema(
	{
		tenant: {
			id: {
				type: String,
				default: ''
			}
		},
		image: {
			type: String,
			default: ''
		},
		number: {
			type: String,
			default: ''
		},
		type: {
			type: String,
			default: ''
		},
		sqm: {
			type: String,
			default: ''
		},
		price: {
			type: Number,
			default: 0
		},
		advance: {
			type: Number,
			default: 0
		},
		deposit: {
			type: Number,
			default: 0
		},
		duration: {
			type: Number,
			default: 0
		},
		status: {
			type: String,
			default: 'Vacant'
		},
		deleted: {
			type: Boolean,
			default: false
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

const Units = mongoose.models.Units || mongoose.model('Units', UnitSchema)

export default Units
