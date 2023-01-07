import connect from 'database/connect'
import Users from 'database/schemas/users'
import Units from 'database/schemas/units'
import Payments from 'database/schemas/payments'

export default async (req, res) => {
	await connect()

	try {
		const { data } = req.body
		const deposit = data.price * data.deposit
		const total = data.price * data.advance + data.price * data.deposit

		await Users.findByIdAndUpdate(
			{ _id: data.user.id },
			{
				unit: data.unit,
				name: data.name,
				contact: data.contact,
				company: data.company,
				role: 'Tenant',
				updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
			}
		)

		await Units.findByIdAndUpdate(
			{ _id: data.unit.id },
			{
				tenant: data.user,
				advance: data.advance,
				deposit: deposit,
				status: 'Occupied',
				updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
			}
		)

		await Payments.create({
			user: data.user,
			unit: data.unit,
			method: data.method,
			total: total,
			created: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
			updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
		})

		res.status(200).send('request success.')
	} catch (error) {
		return res.status(400).send('request failed.')
	}
}
