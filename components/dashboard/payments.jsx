import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, chakra, Flex, GridItem, IconButton, Select, Td, Text, Tr } from '@chakra-ui/react'
import { FiMoreHorizontal } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import { month } from 'functions/month'

const Payments = () => {
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const { data: payments, isFetched: isPaymentsFetched } = useQuery(['payments'], () => api.all('/payments'))

	return (
		<GridItem colSpan={12}>
			<Card>
				<Flex direction="column" gap={6}>
					<Text fontSize="xl" fontWeight="semibold" color="accent-1">
						Payments
					</Text>

					<Table
						data={payments}
						fetched={isUsersFetched && isPaymentsFetched}
						th={['ID', 'Tenant', 'Total', 'Date', 'Method', 'Status', '']}
						td={(pay) => (
							<Tr key={pay._id}>
								<Td>
									<Badge variant="tinted" colorScheme="brand">
										{pay._id.slice(15, 25)}
									</Badge>
								</Td>

								<Td>
									{users
										.filter((user) => user._id === pay.user.id)
										.map((user) => (
											<Flex align="center" gap={3} key={user._id}>
												<Avatar name={user.name} src={user.image} />
												<Text>{user.name}</Text>
											</Flex>
										))}
								</Td>

								<Td>
									<Text>₱{pay.total.toFixed(2)}</Text>
								</Td>

								<Td>
									<Text>{month[pay.created.split(',')[0].trim().split('/')[0] - 1] + ' ' + pay.created.split(',')[0].trim().split('/')[1] + ', ' + pay.created.split(',')[0].trim().split('/')[2]}</Text>
								</Td>

								<Td>
									<Badge variant="tinted" colorScheme="brand">
										{pay.method}
									</Badge>
								</Td>

								<Td>
									<Badge variant="tinted" colorScheme="brand">
										{pay.status}
									</Badge>
								</Td>

								<Td textAlign="right">
									<IconButton size="xs" icon={<FiMoreHorizontal size={12} />} />
								</Td>
							</Tr>
						)}
						select={(register) => (
							<Flex flex={1} justify="end" align="center" gap={3}>
								<Select placeholder="Status" size="lg" w="auto">
									<chakra.option value="Accepted">Accepted</chakra.option>
									<chakra.option value="Processing">Processing</chakra.option>
									<chakra.option value="Rejected">Rejected</chakra.option>
								</Select>
							</Flex>
						)}
					/>
				</Flex>
			</Card>
		</GridItem>
	)
}

export default Payments
