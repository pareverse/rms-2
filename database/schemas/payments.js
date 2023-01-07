import mongoose from 'mongoose'

const PaymentSchema = mongoose.Schema(
	{
		user: {
			id: {
				type: String,
				default: ''
			}
		},
		unit: {
			id: {
				type: String,
				default: ''
			}
		},
		soa: {
			type: Object,
			default: {}
		},
		total: {
			type: Number,
			default: 0
		},
		method: {
			type: String,
			default: ''
		},
		proof: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: 'Processing'
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

const Payments = mongoose.models.Payments || mongoose.model('Payments', PaymentSchema)

export default Payments
