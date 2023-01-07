import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { Badge, chakra, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Select, Td, Text, Tr } from '@chakra-ui/react'
import { FiCheckCircle, FiMoreHorizontal, FiXCircle } from 'react-icons/fi'
import Card from 'components/_card'
import Table from 'components/_table'
import { month } from 'functions/month'

const Payments = ({ user, unit }) => {
	const { data: session } = useSession()
	const { data: payments, isFetched: isPaymentsFetched } = useQuery(['payments'], () => api.all('/payments'))

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
						Payments History
					</Text>
				</Flex>

				<Table
					data={payments}
					fetched={isPaymentsFetched}
					th={['ID', 'Total', 'Date', 'Method', 'Status', '']}
					td={(pay) => (
						<Tr key={pay._id}>
							<Td>
								<Badge variant="tinted" colorScheme="brand">
									{pay._id.slice(15, 25)}
								</Badge>
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
								{session.user.role === 'Admin' && (
									<Menu placement="left-end">
										<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

										<MenuList>
											<MenuItem icon={<FiXCircle size={16} />} value="Reject">
												Processing
											</MenuItem>

											<MenuItem icon={<FiCheckCircle size={16} />} value="Accept">
												Accept
											</MenuItem>

											<MenuItem icon={<FiXCircle size={16} />} value="Reject">
												Reject
											</MenuItem>
										</MenuList>
									</Menu>
								)}
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
					filters={(pay) => {
						return pay.filter((pay) => pay.unit.id === unit._id)
					}}
				/>
			</Flex>
		</Card>
	)
}

export default Payments
