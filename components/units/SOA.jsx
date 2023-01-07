import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Badge, Button, chakra, Divider, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList, Select, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiCheckCircle, FiEye, FiMoreHorizontal, FiPrinter } from 'react-icons/fi'
import Card from 'components/_card'
import Modal from 'components/_modal'
import Table from 'components/_table'
import Toast from 'components/_toast'
import { month } from 'functions/month'

const AddModal = ({ user, unit }) => {
	const disclosure = useDisclosure()
	const queryClient = useQueryClient()

	const {
		register,
		watch,
		setValue,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const addMutation = useMutation((data) => api.create('/soa', data), {
		onSuccess: () => {
			queryClient.invalidateQueries('soa')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="SOA added successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		let vat = (unit.price + Number(data.camc)) * (12 / 100)
		let lapses = (unit.price + Number(data.camc)) * (2 / 100)
		let water = Math.abs(Number(data.current_reading) - Number(data.previous_reading)) * 60

		addMutation.mutate({
			user: {
				id: user._id
			},
			unit: {
				id: unit._id
			},
			schedule: {
				start: data.start,
				due: data.due
			},
			monthly: unit.price,
			camc: data.camc,
			vat: {
				percentage: 12,
				amount: vat
			},
			lapses: {
				percentage: 2,
				amount: lapses
			},
			water: {
				current: {
					reading: data.current_reading,
					date: data.current_date
				},
				previous: {
					reading: data.previous_reading,
					date: data.previous_date
				},
				amount: water
			},
			total: unit.price + Number(data.camc) + vat + lapses + water
		})
	}

	return (
		<Modal
			title="SOA Form"
			size="xl"
			toggle={(onOpen) => (
				<Button
					size="lg"
					colorScheme="brand"
					disabled={unit.tenant.id ? false : true}
					onClick={() => {
						onOpen()
						clearErrors()
						reset()
						setValue('camc', 0)
						setValue('current_reading', 0)
						setValue('previous_reading', 0)
						setValue('total', 0)
					}}
				>
					Add New
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<Text fontSize="lg" fontWeight="semibold" color="accent-1">
						Schedule
					</Text>
					<Flex align="start" gap={6}>
						<FormControl isInvalid={errors.start}>
							<FormLabel>Start Date</FormLabel>
							<Input type="date" size="lg" {...register('start', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={errors.due}>
							<FormLabel>Due Date</FormLabel>
							<Input type="date" size="lg" {...register('due', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>
					</Flex>
					<Divider />
					<Text fontSize="lg" fontWeight="semibold" color="accent-1">
						Current Changes
					</Text>
					<FormControl>
						<FormLabel>Monthly Rent</FormLabel>

						<InputGroup>
							<InputLeftElement pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input type="number" defaultValue={unit.price} size="lg" readOnly />
						</InputGroup>
					</FormControl>
					<FormControl isInvalid={errors.camc}>
						<FormLabel>CAMC</FormLabel>

						<InputGroup>
							<InputLeftElement pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input size="lg" {...register('camc', { required: true })} />
						</InputGroup>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>
					<FormControl>
						<FormLabel>VAT Amount</FormLabel>

						<InputGroup>
							<InputLeftElement pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input value={((unit.price + Number(watch('camc'))) * (12 / 100)).toFixed(2)} size="lg" readOnly />
						</InputGroup>
					</FormControl>
					<FormControl>
						<FormLabel>Lapses Amount</FormLabel>

						<InputGroup>
							<InputLeftElement pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input value={((unit.price + Number(watch('camc'))) * (2 / 100)).toFixed(2)} size="lg" readOnly />
						</InputGroup>
					</FormControl>
					<Divider />
					<Text fontSize="lg" fontWeight="semibold" color="accent-1">
						Water Bill
					</Text>
					<Flex align="start" gap={6}>
						<FormControl isInvalid={errors.previous_reading}>
							<FormLabel>Previous Reading</FormLabel>
							<Input size="lg" {...register('previous_reading', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={errors.previous_date}>
							<FormLabel>Previous Date</FormLabel>
							<Input type="date" size="lg" {...register('previous_date', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>
					</Flex>
					<Flex align="start" gap={6}>
						<FormControl isInvalid={errors.current_reading}>
							<FormLabel>Current Reading</FormLabel>
							<Input size="lg" {...register('current_reading', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>

						<FormControl isInvalid={errors.current_date}>
							<FormLabel>Current Date</FormLabel>
							<Input type="date" size="lg" {...register('current_date', { required: true })} />
							<FormErrorMessage>This field is required.</FormErrorMessage>
						</FormControl>
					</Flex>
					<FormControl>
						<FormLabel>Amount</FormLabel>

						<InputGroup>
							<InputLeftElement pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input value={Math.abs(Number(watch('current_reading') - Number(watch('previous_reading')))) * 60} size="lg" readOnly />
						</InputGroup>
					</FormControl>
					<Divider />
					<FormControl>
						<FormLabel>Total</FormLabel>

						<InputGroup>
							<InputLeftElement pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input value={unit.price + Number(watch('camc')) + (unit.price + Number(watch('camc'))) * (12 / 100) + (unit.price + Number(watch('camc'))) * (2 / 100) + Math.abs(Number(watch('current_reading') - Number(watch('previous_reading')))) * 60} size="lg" readOnly {...register('total')} />
						</InputGroup>
					</FormControl>

					<Button type="submit" size="lg" colorScheme="brand" isLoading={isLoading}>
						Submit
					</Button>
				</Flex>
			</form>
		</Modal>
	)
}

const SOA = ({ user, unit }) => {
	const router = useRouter()
	const { data: session } = useSession()
	const { data: soa, isFetched: isSoaFetched } = useQuery(['soa'], () => api.all('/soa'))

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<Flex justify="space-between" align="center" gap={6}>
					<Text fontSize="2xl" fontWeight="semibold" color="accent-1">
						Statement of Account
					</Text>

					{session.user.role === 'Admin' && <AddModal user={user} unit={unit} />}
				</Flex>

				<Table
					data={soa}
					fetched={isSoaFetched}
					th={['ID', 'Start', 'Due', 'Total', 'Status', '']}
					td={(soa) => (
						<Tr key={soa._id}>
							<Td>
								<Badge variant="tinted" colorScheme="brand">
									{soa._id.slice(15, 25)}
								</Badge>
							</Td>

							<Td>
								<Text>{month[soa.schedule.start.split('-')[1] - 1] + ' ' + soa.schedule.start.split('-')[2] + ', ' + soa.schedule.start.split('-')[0]}</Text>
							</Td>

							<Td>
								<Text>{month[soa.schedule.due.split('-')[1] - 1] + ' ' + soa.schedule.due.split('-')[2] + ', ' + soa.schedule.due.split('-')[0]}</Text>
							</Td>

							<Td>
								<Text>₱{Number(soa.total).toFixed(2)}</Text>
							</Td>

							<Td>
								<Badge variant="tinted" colorScheme={soa.status === 'Paid' ? 'brand' : 'red'}>
									{soa.status}
								</Badge>
							</Td>

							<Td textAlign="right">
								<Menu placement="left-end">
									<MenuButton as={IconButton} size="xs" icon={<FiMoreHorizontal size={12} />} />

									<MenuList>
										<MenuItem icon={<FiEye size={16} />}>View</MenuItem>
										<MenuItem icon={<FiPrinter size={16} />}>Print</MenuItem>

										<MenuItem icon={<FiCheckCircle size={16} />} onClick={() => router.push(`/admin/pay/${soa._id}`)}>
											Pay
										</MenuItem>
									</MenuList>
								</Menu>
							</Td>
						</Tr>
					)}
					select={(register) => (
						<Flex flex={1} justify="end" align="center" gap={3}>
							<Select placeholder="Status" size="lg" w="auto">
								<chakra.option value="Paid">Paid</chakra.option>
								<chakra.option value="Unpaid">Unpaid</chakra.option>
							</Select>
						</Flex>
					)}
					filters={(soa) => {
						return soa.filter((soa) => soa.unit.id === unit._id)
					}}
				/>
			</Flex>
		</Card>
	)
}

export default SOA
