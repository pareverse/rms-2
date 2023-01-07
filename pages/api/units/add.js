import connect from 'database/connect'
import Users from 'database/schemas/users'
import Units from 'database/schemas/units'

export default async (req, res) => {
	await connect()

	try {
		const { id, data } = req.body

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
				status: 'Occupied',
				updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
			}
		)

		res.status(200).send('request success.')
	} catch (error) {
		return res.status(400).send('request failed.')
	}
}
