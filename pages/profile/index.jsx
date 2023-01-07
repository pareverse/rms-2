import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Button, Container, Flex, Grid, GridItem, Spinner, Text } from '@chakra-ui/react'
import Tenant from 'components/units/tenant'
import Details from 'components/units/details'
import SOA from 'components/units/SOA'
import Payments from 'components/units/payments'
import { useRouter } from 'next/router'

const Profile = () => {
	const { data: session } = useSession()
	const router = useRouter()
	const { data: user, isFetched: isUserFetched } = useQuery(['user'], () => api.get('/users', session.user.id))
	const { data: unit, isFetched: isUnitFetched } = useQuery(['unit'], () => api.get('/units', user.unit.id), { enabled: isUserFetched ? true : false })

	if (!session) {
		router.push('/')
		return
	}

	if ((isUserFetched && user.unit.id && !isUnitFetched) || !isUserFetched) {
		return (
			<Container>
				<Spinner color="brand.default" />
			</Container>
		)
	}

	if (user.unit.id === '') {
		return (
			<Container>
				<Flex bg="red.alpha" justify="space-between" align="center" border="1px" borderColor="red.default" p={6}>
					<Flex direction="column">
						<Text fontSize={24} fontWeight="semibold" color="red.default">
							You are not authorized to view this page.
						</Text>

						<Text fontSize="sm" color="red.default">
							You do not have permission to view this directory or page using the credentials that you supplied.
						</Text>
					</Flex>

					<Button variant="outline" size="xl" colorScheme="red">
						Message Us
					</Button>
				</Flex>
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

export default Profile
