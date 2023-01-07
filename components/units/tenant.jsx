import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import api from 'instance'
import { Avatar, Button, chakra, Divider, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, Skeleton, SkeletonCircle, Td, Text, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FiChevronRight, FiPlus } from 'react-icons/fi'
import Card from 'components/_card'
import Modal from 'components/_modal'
import Table from 'components/_table'
import Toast from 'components/_toast'

const ViewModal = ({ user }) => {
	const disclosure = useDisclosure()
	const queryClient = useQueryClient()
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const editMutation = useMutation((data) => api.update('/users', user._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('users')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Unit updated successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		editMutation.mutate({
			name: data.name,
			contact: data.contact,
			company: {
				name: data.company_name,
				email: data.company_email
			}
		})
	}

	return (
		<Modal
			title="Tenant Details"
			size="xl"
			toggle={(onOpen) => (
				<IconButton
					variant="tinted"
					borderRadius="full"
					colorScheme="brand"
					icon={<FiChevronRight size={16} />}
					onClick={() => {
						onOpen()
					}}
				/>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<FormControl isInvalid={errors.name}>
						<FormLabel>Full Name</FormLabel>
						<Input defaultValue={user.name} size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl>
						<FormLabel>Email Address</FormLabel>
						<Input value={user.email} size="lg" readOnly />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.contact}>
						<FormLabel>Contact</FormLabel>
						<Input defaultValue={user.contact} size="lg" {...register('contact', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.company_name}>
						<FormLabel>Company Name</FormLabel>
						<Input defaultValue={user.company.name} size="lg" {...register('company_name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.company_name}>
						<FormLabel>Company Email</FormLabel>
						<Input defaultValue={user.company.email} size="lg" {...register('company_email', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Button type="submit" size="lg" colorScheme="brand" isLoading={isLoading}>
						Save Changes
					</Button>
				</Flex>
			</form>
		</Modal>
	)
}

const AddModal = ({ user, unit }) => {
	const disclosure = useDisclosure()
	const queryClient = useQueryClient()

	const {
		register,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const addMutation = useMutation((data) => api.update('/units/add', unit._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('units')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Unit updated successfully." />
			})
		}
	})

	const onSubmit = (data) => {
		setIsLoading(true)

		addMutation.mutate({
			user: {
				id: user._id
			},
			unit: {
				id: unit._id
			},
			name: data.name,
			contact: data.contact,
			company: {
				name: data.company_name,
				email: data.company_email
			}
		})
	}

	return (
		<Modal
			size="xl"
			header="off"
			toggle={(onOpen) => (
				<IconButton
					variant="tinted"
					borderRadius="full"
					colorScheme="brand"
					icon={<FiPlus size={16} />}
					onClick={() => {
						clearErrors()
						reset()
						onOpen()
					}}
				/>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<Text fontSize={20} fontWeight="semibold" color="accent-1">
						Profile Details
					</Text>

					<FormControl isInvalid={errors.name}>
						<FormLabel>
							Name <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<Input defaultValue={user.name} size="lg" {...register('name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl>
						<FormLabel>
							Email Address <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<Input value={user.email} size="lg" cursor="not-allowed" readOnly />
					</FormControl>

					<FormControl isInvalid={errors.contact}>
						<FormLabel>
							Contact <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<Input type="number" defaultValue={user.contact} size="lg" {...register('contact', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<Divider />

					<Text fontSize={20} fontWeight="semibold" color="accent-1">
						Company Details
					</Text>

					<FormControl isInvalid={errors.company_name}>
						<FormLabel>
							Name <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<Input defaultValue={user.company.name} size="lg" {...register('company_name', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.company_email}>
						<FormLabel>
							Email Address <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<Input defaultValue={user.company.email} size="lg" {...register('company_email', { required: true })} />
					</FormControl>

					<Button type="submit" size="lg" colorScheme="brand" isLoading={isLoading}>
						Submit
					</Button>
				</Flex>
			</form>
		</Modal>
	)
}

const UsersModal = ({ unit }) => {
	const disclosure = useDisclosure()
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('users'))

	return (
		<Modal title="Add Tenant" size="xl" toggle={(onOpen) => <IconButton variant="tinted" borderRadius="full" colorScheme="brand" icon={<FiPlus size={16} />} onClick={onOpen} />} disclosure={disclosure}>
			<Table
				data={users}
				fetched={isUsersFetched}
				th={[]}
				td={(user) => (
					<Tr key={user._id}>
						<Td>
							<Flex justify="space-between" align="center" gap={6}>
								<Flex flex={1} align="center" gap={3}>
									<Avatar h={10} w={10} name={user.name} src={user.image} />

									<Flex flex={1} direction="column">
										<Text fontSize="sm" fontWeight="medium" lineHeight={5} color="accent-1" noOfLines={1}>
											{user.name}
										</Text>

										<Text fontSize="sm" lineHeight={5} noOfLines={1}>
											{user.email}
										</Text>
									</Flex>
								</Flex>

								<Flex>
									<AddModal user={user} unit={unit} />
								</Flex>
							</Flex>
						</Td>
					</Tr>
				)}
				filters={(user) => {
					return user.filter((user) => user.role === 'User')
				}}
				settings={{
					searchWidth: 'full'
				}}
			/>
		</Modal>
	)
}

const Tenant = ({ user, unit }) => {
	return (
		<Card>
			{unit.tenant.id ? (
				<Flex justify="space-between" align="center" gap={6}>
					<Flex flex={1} align="center" gap={3}>
						<Avatar h={10} w={10} name={user.name} src={user.image} />

						<Flex flex={1} direction="column">
							<Text fontSize="sm" fontWeight="medium" lineHeight={5} color="accent-1" noOfLines={1}>
								{user.name}
							</Text>

							<Text fontSize="sm" lineHeight={5} noOfLines={1}>
								{user.email}
							</Text>
						</Flex>
					</Flex>

					<Flex>
						<ViewModal user={user} />
					</Flex>
				</Flex>
			) : (
				<Flex justify="space-between" align="center" gap={6}>
					<Flex flex={1} align="center" gap={3}>
						<SkeletonCircle h={10} w={10} />

						<Flex flex={1} direction="column" gap={2}>
							<Skeleton h={2} w={32} />
							<Skeleton h={2} w={24} />
						</Flex>
					</Flex>

					<Flex>
						<UsersModal unit={unit} />
					</Flex>
				</Flex>
			)}
		</Card>
	)
}

export default Tenant
