import NextLink from 'next/link'
import { useQuery } from '@tanstack/react-query'
import api from 'instance'
import { AspectRatio, Avatar, Badge, chakra, Container, Flex, Image, Input, InputGroup, InputLeftElement, Select, SimpleGrid, Skeleton, Text } from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import Card from 'components/_card'

const Accounts = () => {
	const { data: users, isFetched: isUsersFetched } = useQuery(['users'], () => api.all('/users'))

	return (
		<Container>
			<Flex direction="column" gap={6}>
				<Text fontSize={32} fontWeight="bold" color="accent-1">
					Accounts
				</Text>

				<Flex justify="space-between" align="center" gap={3}>
					<Flex flex={1}>
						<InputGroup>
							<InputLeftElement pt={1} pl={1}>
								<FiSearch size={16} />
							</InputLeftElement>

							<Input size="lg" />
						</InputGroup>
					</Flex>

					<Select placeholder="Role" size="lg" w="auto">
						<chakra.option value="Admin">Admin</chakra.option>
						<chakra.option value="Tenant">Tenant</chakra.option>
						<chakra.option value="User">User</chakra.option>
					</Select>

					<Select placeholder="Status" size="lg" w="auto">
						<chakra.option value="Active">Active</chakra.option>
						<chakra.option value="Disabled">Disabled</chakra.option>
					</Select>
				</Flex>

				<SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={6}>
					{isUsersFetched
						? users.map((user) => (
								<NextLink href={`/admin/accounts/${1}`} key={user._id}>
									<Card>
										<Flex direction="column" gap={6}>
											<AspectRatio mt={-6} mx={-6} ratio={16 / 9}>
												{user.unit.id ? <Image alt="unit" src="/assets/unit.jpg" /> : <Skeleton />}
											</AspectRatio>

											<Flex direction="column" align="center" textAlign="center">
												<chakra.div position="relative" mt="-72px" mb={3}>
													<Avatar border="8px" size="xl" name={user.name} src={user.image} />
												</chakra.div>

												<Text fontWeight="medium" color="accent-1" noOfLines={1}>
													{user.name}
												</Text>

												<Text fontSize="sm" color="accent-1" noOfLines={1}>
													{user.email}
												</Text>

												<Flex align="center" gap={3} mt={3}>
													<Badge variant="tinted" colorScheme={user.role === 'Admin' ? 'yellow' : user.role === 'Tenant' ? 'brand' : user.role === 'User' && 'red'}>
														{user.role}
													</Badge>

													<Badge variant="tinted" colorScheme={user.status === 'Active' ? 'brand' : 'red'}>
														{user.status}
													</Badge>
												</Flex>
											</Flex>
										</Flex>
									</Card>
								</NextLink>
						  ))
						: [...Array(3)].map((data, index) => (
								<Card key={index}>
									<Flex direction="column" gap={6}>
										<AspectRatio mt={-6} mx={-6} ratio={16 / 9}>
											<Skeleton />
										</AspectRatio>

										<Flex direction="column" align="center" textAlign="center">
											<chakra.div position="relative" mt="-72px" mb={3}>
												<Avatar border="8px" borderColor="accent-1" size="xl" />
											</chakra.div>

											<Flex direction="column" align="center" gap={3}>
												<Skeleton borderRadius="full" h={2} w={48} />
												<Skeleton borderRadius="full" h={2} w={32} />
											</Flex>

											<Flex align="center" gap={3} mt={6}>
												<Skeleton borderRadius="full" h={7} w={16} />
												<Skeleton borderRadius="full" h={7} w={16} />
											</Flex>
										</Flex>
									</Flex>
								</Card>
						  ))}
				</SimpleGrid>
			</Flex>
		</Container>
	)
}

export default Accounts
