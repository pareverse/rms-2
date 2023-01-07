import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Flex, GridItem, Icon, Text } from '@chakra-ui/react'
import { FiCheckSquare, FiGrid, FiPackage, FiUsers } from 'react-icons/fi'
import Card from 'components/_card'

const Statistics = ({ sales_query }) => {
	const { data: units, isFetched: isUnitsFetched } = useQuery(['units'], () => api.all('units'))
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('users'))

	return (
		<>
			<GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
				<Card>
					<Flex justify="space-between" align="center">
						<Flex direction="column" gap={1} w="calc(100% - 76px)">
							<Text fontSize="2xl" fontWeight="semibold" color="accent-1" noOfLines={1}>
								{isUnitsFetched ? units.filter((unit) => unit.status === 'Vacant').length : 0}
							</Text>

							<Text fontSize="sm" fontWeight="medium" color="accent-1">
								Vacant Units
							</Text>
						</Flex>

						<Flex bg="brand.default" justify="center" align="center" borderRadius="full" h={16} w={16}>
							<Icon as={FiCheckSquare} boxSize={6} color="white" />
						</Flex>
					</Flex>
				</Card>
			</GridItem>

			<GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
				<Card>
					<Flex justify="space-between" align="center">
						<Flex direction="column" gap={1} w="calc(100% - 76px)">
							<Text fontSize="2xl" fontWeight="semibold" color="accent-1" noOfLines={1}>
								{isUnitsFetched ? units.length : 0}
							</Text>

							<Text fontSize="sm" fontWeight="medium" color="accent-1">
								Total Units
							</Text>
						</Flex>

						<Flex bg="brand.default" justify="center" align="center" borderRadius="full" h={16} w={16}>
							<Icon as={FiGrid} boxSize={6} color="white" />
						</Flex>
					</Flex>
				</Card>
			</GridItem>

			<GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
				<Card>
					<Flex justify="space-between" align="center">
						<Flex direction="column" gap={1} w="calc(100% - 76px)">
							<Text fontSize="2xl" fontWeight="semibold" color="accent-1" noOfLines={1}>
								{isUsersFetched ? users.length : 0}
							</Text>

							<Text fontSize="sm" fontWeight="medium" color="accent-1">
								Total Tenants
							</Text>
						</Flex>

						<Flex bg="brand.default" justify="center" align="center" borderRadius="full" h={16} w={16}>
							<Icon as={FiUsers} boxSize={6} color="white" />
						</Flex>
					</Flex>
				</Card>
			</GridItem>

			<GridItem colSpan={{ base: 12, md: 6, '2xl': 3 }}>
				<Card>
					<Flex justify="space-between" align="center">
						<Flex direction="column" gap={1} w="calc(100% - 76px)">
							<Text fontSize="2xl" fontWeight="semibold" color="accent-1" noOfLines={1}>
								₱{(0).toFixed(2)}
							</Text>

							<Text fontSize="sm" fontWeight="medium" color="accent-1">
								Total Collected
							</Text>
						</Flex>

						<Flex bg="brand.default" justify="center" align="center" borderRadius="full" h={16} w={16}>
							<Text fontSize={24} color="white">
								₱
							</Text>
						</Flex>
					</Flex>
				</Card>
			</GridItem>
		</>
	)
}

export default Statistics
