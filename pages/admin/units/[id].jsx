import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Container, Grid, GridItem, Spinner } from '@chakra-ui/react'
import Tenant from 'components/units/tenant'
import Details from 'components/units/details'
import SOA from 'components/units/SOA'
import Payments from 'components/units/payments'

const Unit = () => {
	const router = useRouter()
	const { id } = router.query

	const { data: unit, isFetched: isUnitFetched } = useQuery(['unit', id], () => api.get('/units', id))
	const { data: user, isFetched: isUserFetched } = useQuery(['user'], () => api.get('/users', unit.tenant.id), { enabled: isUnitFetched && unit.tenant.id ? true : false })

	if ((isUnitFetched && unit.tenant.id && !isUserFetched) || !isUnitFetched) {
		return (
			<Container>
				<Spinner color="brand.default" />
			</Container>
		)
	}

	return (
		<Container>
			<Grid templateColumns="1fr 384px" alignItems="start" gap={6}>
				<GridItem display="grid" gap={6}>
					<SOA user={user} unit={unit} />
					<Payments user={user} unit={unit} />
				</GridItem>

				<GridItem display="grid" gap={6}>
					<Tenant user={user} unit={unit} />
					<Details unit={unit} />
				</GridItem>
			</Grid>
		</Container>
	)
}

export default Unit
