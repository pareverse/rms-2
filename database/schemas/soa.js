import mongoose from 'mongoose'

const SOASchema = mongoose.Schema(
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
		schedule: {
			start: {
				type: String,
				default: ''
			},
			due: {
				type: String,
				default: ''
			}
		},
		monthly: {
			type: Number,
			default: 0
		},
		camc: {
			type: String,
			default: ''
		},
		vat: {
			percentage: {
				type: Number,
				default: 0
			},
			amount: {
				type: String,
				default: ''
			}
		},
		lapses: {
			percentage: {
				type: Number,
				default: 0
			},
			amount: {
				type: String,
				default: ''
			}
		},
		water: {
			current: {
				reading: {
					type: Number,
					default: 0
				},
				date: {
					type: String,
					default: ''
				}
			},
			previous: {
				reading: {
					type: Number,
					default: 0
				},
				date: {
					type: String,
					default: ''
				}
			},
			amount: {
				type: String,
				default: ''
			}
		},
		total: {
			type: String,
			default: ''
		},
		status: {
			type: String,
			default: 'Unpaid'
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

const SOA = mongoose.models.SOA || mongoose.model('SOA', SOASchema)

export default SOA
