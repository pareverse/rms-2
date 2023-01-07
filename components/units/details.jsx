import { useState } from 'react'
import NextLink from 'next/link'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import api from 'instance'
import { AspectRatio, Button, chakra, Container, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Icon, IconButton, Image, Input, InputGroup, InputLeftElement, Select, SimpleGrid, Skeleton, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { FiPlus, FiSearch, FiX } from 'react-icons/fi'
import Card from 'components/_card'
import Modal from 'components/_modal'
import Toast from 'components/_toast'

const EditModal = ({ unit }) => {
	const disclosure = useDisclosure()
	const queryClient = useQueryClient()

	const {
		register,
		watch,
		formState: { errors },
		clearErrors,
		reset,
		handleSubmit
	} = useForm()

	const [image, setImage] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const toast = useToast()

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

	const editMutation = useMutation((data) => api.update('/units', unit._id, data), {
		onSuccess: () => {
			queryClient.invalidateQueries('units')
			setIsLoading(false)
			disclosure.onClose()

			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast title="Success" description="Unit added successfully." />
			})
		}
	})

	const onSubmit = async (data) => {
		if (!image) {
			toast({
				position: 'top',
				duration: 1000,
				render: () => <Toast status="error" title="Error" description="Please attach image." />
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

		editMutation.mutate({
			image: res.data.secure_url,
			...data
		})
	}

	return (
		<Modal
			size="xl"
			header="off"
			toggle={(onOpen) => (
				<Button
					variant="tinted"
					size="lg"
					colorScheme="brand"
					onClick={() => {
						setImage(unit.image)
						clearErrors()
						reset()
						onOpen()
					}}
				>
					Edit
				</Button>
			)}
			disclosure={disclosure}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Flex direction="column" gap={6}>
					<chakra.div position="relative">
						{image && <IconButton position="absolute" right={0} borderRadius="full" size="xs" colorScheme="brand" zIndex={1} icon={<FiX size={12} />} onClick={() => setImage(null)} />}

						{image ? (
							<AspectRatio position="relative" mt={-6} mx={-6} ratio={16 / 9}>
								<Image alt="unit" src={typeof image === 'object' ? URL.createObjectURL(image) : image} />
							</AspectRatio>
						) : (
							<AspectRatio mt={-6} mx={-6} ratio={16 / 9}>
								<Flex bg="canvas-1" position="relative" align="center" direction="column" gap={2} px={6} py={12}>
									<chakra.input type="file" position="absolute" top={0} left={0} h="full" w="full" opacity={0} cursor="pointer" onChange={handleImage} />
									<Icon as={FiPlus} boxSize={6} />

									<Text fontSize="sm" fontWeight="medium">
										Add Image
									</Text>
								</Flex>
							</AspectRatio>
						)}
					</chakra.div>

					<FormControl isInvalid={errors.number}>
						<FormLabel>
							Unit <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<Input type="number" defaultValue={unit.number} size="lg" {...register('number', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.type}>
						<FormLabel>
							Type <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<Select placeholder="Select" defaultValue={unit.type} size="lg" {...register('type', { required: true })}>
							<chakra.option value="Single">Single</chakra.option>
							<chakra.option value="Attached">Attached</chakra.option>
						</Select>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.sqm}>
						<FormLabel>
							Sqm <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<Input size="lg" defaultValue={unit.sqm} {...register('sqm', { required: true })} />
						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.type}>
						<FormLabel>
							Status <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<Select placeholder="Select" defaultValue={unit.status} size="lg" {...register('status', { required: true })}>
							<chakra.option value="Occupied">Occupied</chakra.option>
							<chakra.option value="Reserved">Reserved</chakra.option>
							<chakra.option value="Vacant">Vacant</chakra.option>
						</Select>

						<FormErrorMessage>This field is required.</FormErrorMessage>
					</FormControl>

					<FormControl isInvalid={errors.price}>
						<FormLabel>
							Price <chakra.span color="red.default">*</chakra.span>
						</FormLabel>

						<InputGroup>
							<InputLeftElement pt={1} pl={1}>
								₱
							</InputLeftElement>

							<Input type="number" defaultValue={unit.price} size="lg" {...register('price', { required: true })} />
						</InputGroup>
					</FormControl>

					<Flex direction="column" gap={3}>
						<Button type="submit" size="lg" colorScheme="brand" isLoading={isLoading}>
							Submit
						</Button>

						<Button size="lg" onClick={disclosure.onClose}>
							Close
						</Button>
					</Flex>
				</Flex>
			</form>
		</Modal>
	)
}

const Details = ({ unit }) => {
	const { data: session } = useSession()

	return (
		<Card>
			<Flex direction="column" gap={6}>
				<AspectRatio mt={-6} mx={-6} ratio={16 / 9}>
					<Image alt="unit" src={unit.image} />
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

					<Divider />

					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							Advance
						</Text>

						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							{unit.advance} Months left
						</Text>
					</Flex>

					<Flex justify="space-between" align="center" gap={6}>
						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							Deposit
						</Text>

						<Text fontSize="sm" fontWeight="medium" color="accent-1">
							₱{unit.deposit.toFixed(2)}
						</Text>
					</Flex>
				</Flex>

				{session.user.role === 'Admin' && (
					<Flex direction="column" gap={3}>
						<EditModal unit={unit} />
					</Flex>
				)}
			</Flex>
		</Card>
	)
}

export default Details
