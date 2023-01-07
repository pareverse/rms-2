import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import api from 'instance'
import { AspectRatio, Button, chakra, Container, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Image, Input, InputGroup, InputLeftElement, Select, Spinner, Text, useToast } from '@chakra-ui/react'
import { FiUser } from 'react-icons/fi'
import Card from 'components/_card'
import Toast from 'components/_toast'

const Reserve = () => {
	const router = useRouter()
	const { id } = router.query

	const { data: session } = useSession()
	const queryClient = useQueryClient()
	const { data: user, isFetched: isUserFetched } = useQuery(['user'], () => api.get('/users', session.user.id), { enabled: session ? true : false })
	const { data: unit, isFetched: isUnitFetched } = useQuery(['unit'], () => api.get('/units', id))

	const {
		register,
		watch,
		setValue,
		formState: { errors },
		handleSubmit
	} = useForm()

	const [image, setImage] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

	const handleImage = (e) => {
		const file = e.target.files[0]

		const handleImage = (e) => {
			const file = e.target.files[0]

			if (!file) {
				toast({
					position: 'top',
					render: () => <Toast status="error" title="Error" description="File does not exists." />
				})

				return
			}

			if (file.size > 5120 * 5120) {
				toast({
					position: 'top',
					render: () => <Toast status="error" title="Error" description="Largest image size is 5mb." />
				})

				return
			}

			if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
				toast({
					position: 'top',
					render: () => <Toast status="error" title="Error" description="Image format is incorrect." />
				})

				return
			}

			setImage(file)
		}

		setImage(file)
	}

	const addMutation = useMutation((data) => api.update('/units/reserve', id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('units')
			setIsLoading(false)
			router.push('/profile')

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Unit rented successfully." />
			})
		}
	})

	const onSubmit = async (data) => {
		if (!image) {
			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast status="error" title="Error" description="Please attach proof of payment." />
			})

			return
		}

		setIsLoading(true)

		let res = null

		for (const item of [image]) {
			const formData = new FormData()

			formData.append('file', item)
			formData.append('upload_preset', 'uploads')

			res = await axios.post('https://api.cloudinary.com/v1_1/commence/image/upload', formData)
		}

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
			},
			price: unit.price,
			duration: Number(data.duration),
			method: data.method,
			proof: res.data.secure_url
		})
	}

	if (!isUserFetched || !isUnitFetched) {
		return (
			<Container>
				<Spinner color="brand.default" />
			</Container>
		)
	}

	return (
		<Container>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid templateColumns="1fr 384px" alignItems="start" gap={6}>
					<GridItem display="grid" gap={6}>
						<Card>
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

									<Input defaultValue={user.contact} size="lg" {...register('contact', { required: true })} />
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
							</Flex>
						</Card>

						<Card>
							<Flex direction="column" gap={6}>
								<Text fontSize={20} fontWeight="semibold" color="accent-1">
									Rental Fee
								</Text>

								<FormControl>
									<FormLabel>Price</FormLabel>

									<InputGroup>
										<InputLeftElement pt={1} pl={1}>
											₱
										</InputLeftElement>

										<Input value={unit.price / 2} size="lg" readOnly />
									</InputGroup>
								</FormControl>

								<FormControl isInvalid={errors.duration}>
									<FormLabel>Duration</FormLabel>

									<Select placeholder="Select" size="lg" {...register('duration')}>
										<chakra.option value={1}>1 Day</chakra.option>
										<chakra.option value={2}>2 Days</chakra.option>
										<chakra.option value={3}>3 Days</chakra.option>
										<chakra.option value={4}>4 Days</chakra.option>
										<chakra.option value={5}>5 Days</chakra.option>
										<chakra.option value={6}>6 Days</chakra.option>
										<chakra.option value={7}>7 Days</chakra.option>
										<chakra.option value={8}>8 Days</chakra.option>
										<chakra.option value={9}>9 Days</chakra.option>
										<chakra.option value={10}>10 Days</chakra.option>
										<chakra.option value={11}>11 Days</chakra.option>
										<chakra.option value={12}>12 Days</chakra.option>
										<chakra.option value={13}>13 Days</chakra.option>
										<chakra.option value={14}>14 Days</chakra.option>
										<chakra.option value={15}>15 Days</chakra.option>
									</Select>

									<FormErrorMessage>This field is required.</FormErrorMessage>
								</FormControl>

								<FormControl>
									<FormLabel>Total Price</FormLabel>

									<InputGroup>
										<InputLeftElement pt={1} pl={1}>
											₱
										</InputLeftElement>

										<Input value={watch('duration') ? (unit.price / 2 / Number(watch('duration'))).toFixed(2) : ''} size="lg" readOnly />
									</InputGroup>
								</FormControl>
							</Flex>
						</Card>
					</GridItem>

					<GridItem display="grid" gap={6}>
						<Card>
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
							</Flex>
						</Card>

						<Card>
							<Flex direction="column" gap={6}>
								<FormControl isInvalid={errors.method}>
									<FormLabel>
										Payment Method <chakra.span color="red.default">*</chakra.span>
									</FormLabel>

									<Select placeholder="Select" size="lg" {...register('method', { required: true })}>
										<chakra.option value="Cash">Cash</chakra.option>
										<chakra.option value="GCash">GCash</chakra.option>
										<chakra.option value="PayPal">PayPal</chakra.option>
									</Select>

									<FormErrorMessage>This field is required.</FormErrorMessage>
								</FormControl>

								{watch('method') === 'Cash' && (
									<FormControl isInvalid={errors.cash_amount}>
										<InputGroup>
											<InputLeftElement pt={1} pl={1}>
												₱
											</InputLeftElement>

											<Input type="number" size="lg" {...register('cash_amount', { required: true })} />
										</InputGroup>

										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>
								)}

								{watch('method') === 'GCash' && (
									<>
										<FormControl>
											<FormLabel>Account</FormLabel>

											<InputGroup>
												<InputLeftElement pt={1} pl={1}>
													<FiUser size={16} />
												</InputLeftElement>

												<Input value="TSVJ Center." size="lg" readOnly />
											</InputGroup>
										</FormControl>

										<FormControl>
											<FormLabel>Account Number</FormLabel>

											<InputGroup>
												<InputLeftElement pt={1} pl={1}>
													#
												</InputLeftElement>

												<Input value="09123456789" size="lg" readOnly />
											</InputGroup>
										</FormControl>
									</>
								)}

								<FormControl isInvalid={errors.proof}>
									<FormLabel>
										Proof of Payment <chakra.span color="red.default">*</chakra.span>
									</FormLabel>

									<Input type="file" size="lg" onChange={handleImage} />

									<FormErrorMessage>This field is required.</FormErrorMessage>
								</FormControl>

								<Button type="submit" size="lg" colorScheme="brand" isLoading={isLoading}>
									Rent Now
								</Button>
							</Flex>
						</Card>
					</GridItem>
				</Grid>
			</form>
		</Container>
	)
}

export default Reserve
