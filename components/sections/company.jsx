import { chakra, Flex, Image, Text } from '@chakra-ui/react'

const Company = () => {
	return (
		<chakra.section pt={100} id="company">
			<Flex direction={{ base: 'column-reverse', lg: 'row' }} gap={12}>
				<Flex flex={1}>
					<Flex direction="column" gap={3}>
						<Text fontSize={32} fontWeight="bold" color="accent-1">
							TSVJ Center
						</Text>

						<Text color="accent-1">Is designed to provide a comfortable dwelling space that contributes to a higher level of performance at work and in school.</Text>

						<Text color="accent-1">Perfect for Students, Young Professionals, and WFH Employees alike! 😍 Visit our page and book your stay now!</Text>

						<Text color="accent-1">The area is a walking distance from many Major landmarks: Las Pinas City Hall, SM Center Las Pinas, Vista Mall Las Pinas, University of Perpetual Help, Perpetual Help Medical Center, STI Academic Center.</Text>

						<Text color="accent-1">✅ We believe that a comfortable dwelling space contributes to a higher level of performance at work and in school.</Text>

						<Text color="accent-1">📍 TSVJ Center consists of Law Offices, Photocopy Centers, Food Stalls, and many other commercial services, with a unique feature of having dual access that caters to residents of Crispina Avenue and clients of the Las Pinas City Hall Complex.</Text>

						<Text color="accent-1">✅ Ideal for: Convenience Store, Korean Grocery, Laundry, Bills Payment Services, Gym.</Text>

						<Text color="accent-1">✅ Location: Lot 3-A Crispina Avenue, Las Pinas Village, Pamplona 3, Las Pinas City.</Text>

						<Text color="accent-1">Call us # 09222207595</Text>

						<Text color="accent-1">LAS PINAS CITY-COMMERCIAL SPACE FOR LEASE (110 SQM.)</Text>
					</Flex>
				</Flex>

				<Flex flex={1}>
					<Image borderRadius={12} alt="company" src="/assets/company.jpg" />
				</Flex>
			</Flex>
		</chakra.section>
	)
}

export default Company
