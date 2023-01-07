import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from 'instance'
import { Avatar, Badge, chakra, Container, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Select, Td, Text, Tr, useToast } from '@chakra-ui/react'
import { FiCheckCircle, FiMoreHorizontal, FiXCircle } from 'react-icons/fi'
import Table from 'components/_table'
import Card from 'components/_card'
import { month } from 'functions/month'
import Toast from 'components/_toast'

const Payments = () => {
	const queryClient = useQueryClient()
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))
	const { data: payments, isFetched: isPaymentsFetched } = useQuery(['payments'], () => api.all('/payments'))
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const editMutation = useMutation((data) => api.update('/payments', data.id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('payments')
			setIsLoading(true)

			toast({
				position: 'top',
				duratin: 1000,
				render: () => <Toast title="Success" description="Payment updated successfully." />
			})
		}
	})

	const onProcess = (pay) => {
		editMutation.mutate({
			id: pay._id,
			status: 'Processing'
		})
	}

	const onAccept = (pay) => {
		editMutation.mutate({
			id: pay._id,
			status: 'Accepted'
		})
	}

	const onReject = (pay) => {
		editMutation.mutate({
			id: pay._id,
			status: 'Rejected'
		})
	}

	return (
		<Container>
			<Flex direction="column" gap={6}>
				<Text fontSize={32} fontWeight="bold" color="accent-1">
					Payments
				</Text>

				<Card>
					<Table
						data={payments}
						fetched={isUsersFetched && isPaymentsFetched}
						th={['ID', 'Tenant', 'Total', 'Date', 'Method', 'Proof', 'Status', '']}
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
									<Text>{pay.proof}</Text>
								</Td>

								<Td>
									<Badge variant="tinted" colorScheme={pay.status === 'Accepted' ? 'green' : pay.status === 'Processing' ? 'brand' : pay.status === 'Rejected' && 'red'}>
										{pay.status}
									</Badge>
								</Td>

								<Td textAlign="right">
									<Menu placement="left-end">
										<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

										<MenuList>
											<MenuItem icon={<FiXCircle size={16} />} onClick={() => onProcess(pay)}>
												Processing
											</MenuItem>

											<MenuItem icon={<FiCheckCircle size={16} />} onClick={() => onAccept(pay)}>
												Accept
											</MenuItem>

											<MenuItem icon={<FiXCircle size={16} />} onClick={() => onReject(pay)}>
												Reject
											</MenuItem>
										</MenuList>
									</Menu>
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
				</Card>
			</Flex>
		</Container>
	)
}

export default Payments
