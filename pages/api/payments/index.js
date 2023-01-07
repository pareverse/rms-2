import connect from 'database/connect'
import Payments from 'database/schemas/payments'

export default async (req, res) => {
	const { method } = req
	await connect()

	switch (method) {
		case 'GET':
			try {
				const data = await Payments.find({}).sort({ createdAt: -1 })
				res.status(200).send(data)
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'POST':
			try {
				console.log(req.body)
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'PATCH':
			try {
				const { id, data } = req.body

				await Payments.findByIdAndUpdate(
					{ _id: id },
					{
						status: data.status,
						updated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
					}
				)

				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		case 'DELETE':
			try {
				res.status(200).send('request success.')
			} catch (error) {
				return res.status(400).send('request failed.')
			}

			break

		default:
			res.status(400).send('request failed.')
			break
	}
}
