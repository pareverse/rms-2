import Router from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { AspectRatio, Button, chakra, Flex, Image, SimpleGrid, Skeleton, Text } from '@chakra-ui/react'
import Card from 'components/_card'

const Units = () => {
	const { data: session } = useSession()
	const { data: user, isFetched: isUserFetched } = useQuery(['user'], () => api.get('/users', session.user.id))
	const { data: units, isFetched: isUnitsFetched } = useQuery(['units'], () => api.all('/units'))

	return (
		<chakra.section pt={100} id="units">
			<Flex direction="column" gap={12}>
				<Flex align="center" direction="column" textAlign="center">
					<Text fontSize={32} fontWeight="bold" color="accent-1">
						Units
					</Text>
				</Flex>

				<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
					{isUserFetched && isUnitsFetched
						? units.map((unit) => (
								<Card key={unit._id}>
									<Flex direction="column" gap={6}>
										<AspectRatio mt={-6} mx={-6} ratio={16 / 9}>
											<Image alt="unit" src="/assets/unit.jpg" />
										</AspectRatio>

										<Flex direction="column" gap={3}>
											<Flex justify="space-between" align="center" gap={6}>
												<Text fontSize="sm" fontWeight="medium" color="accent-1">
													Unit
												</Text>

												<Text fontSize="sm" fontWeight="medium" color="accent-1">
													{unit.number}
												</Text>
											</Flex>

											<Flex justify="space-between" align="center" gap={6}>
												<Text fontSize="sm" fontWeight="medium" color="accent-1">
													Type
												</Text>

												<Text fontSize="sm" fontWeight="medium" color="accent-1">
													{unit.type}
												</Text>
											</Flex>

											<Flex justify="space-between" align="center" gap={6}>
												<Text fontSize="sm" fontWeight="medium" color="accent-1">
													Sqm
												</Text>

												<Text fontSize="sm" fontWeight="medium" color="accent-1">
													{unit.sqm}
												</Text>
											</Flex>

											<Flex justify="space-between" align="center" gap={6}>
												<Text fontSize="sm" fontWeight="medium" color="accent-1">
													Status
												</Text>

												<Text fontSize="sm" fontWeight="medium" color={unit.status === 'Occupied' ? 'brand.default' : unit.status === 'Reserved' ? 'yellow.default' : unit.status === 'Vacant' && 'red.default'}>
													{unit.status}
												</Text>
											</Flex>

											<Flex justify="space-between" align="center" gap={6}>
												<Text fontSize="sm" fontWeight="medium" color="accent-1">
													Price
												</Text>

												<Text fontSize="sm" fontWeight="medium" color="accent-1">
													₱{unit.price.toFixed(2)}
												</Text>
											</Flex>
										</Flex>

										<Flex align="center" gap={6}>
											<Button variant="tinted" size="lg" colorScheme="brand" w="full" disabled={user?.unit?.id || unit.status === 'Occupied' ? true : false} onClick={() => (session ? Router.push(`/reserve/${unit._id}`) : signIn('google'))}>
												Reserve
											</Button>

											<Button size="lg" colorScheme="brand" w="full" disabled={user?.unit?.id || unit.status === 'Occupied' ? true : false} onClick={() => (session ? Router.push(`/rent/${unit._id}`) : signIn('google'))}>
												Rent Now
											</Button>
										</Flex>
									</Flex>
								</Card>
						  ))
						: [...Array(3)].map((data, index) => (
								<Card key={index}>
									<Flex direction="column" gap={6}>
										<AspectRatio mt={-6} mx={-6} ratio={16 / 9}>
											<Skeleton />
										</AspectRatio>

										<AspectRatio m={-6} ratio={16 / 9}>
											<chakra.div />
										</AspectRatio>
									</Flex>
								</Card>
						  ))}
				</SimpleGrid>
			</Flex>
		</chakra.section>
	)
}

export default Units
