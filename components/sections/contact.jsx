import { AspectRatio, Button, chakra, Flex, FormControl, FormErrorMessage, Grid, GridItem, Input, Text, Textarea } from '@chakra-ui/react'

const Contact = () => {
	return (
		<chakra.section pt={100} id="contact">
			<Flex direction={{ base: 'column-reverse', lg: 'row' }} gap={12}>
				<Flex flex={1}>
					<Flex flex={1} direction="column" gap={6}>
						<Flex direction="column">
							<Text fontSize={32} fontWeight="bold" color="accent-1">
								Get In Touch
							</Text>

							<Text color="accent-1">We are here for you! How can we help?</Text>
						</Flex>

						<chakra.form h="full">
							<Grid templateRows="auto auto 1fr auto" gap={6} h="full">
								<GridItem>
									<FormControl>
										<Input placeholder="Enter your full name" size="lg" />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>
								</GridItem>

								<GridItem>
									<FormControl>
										<Input placeholder="Enter your email address" size="lg" />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>
								</GridItem>

								<GridItem>
									<FormControl h="full">
										<Textarea placeholder="Enter your message" size="lg" h="full" />
										<FormErrorMessage>This field is required.</FormErrorMessage>
									</FormControl>
								</GridItem>

								<GridItem>
									<Button size="lg" colorScheme="brand" w="full">
										Send Message
									</Button>
								</GridItem>
							</Grid>
						</chakra.form>
					</Flex>
				</Flex>

				<Flex flex={1.5}>
					<chakra.div h="full" w="full">
						<AspectRatio ratio={1}>
							<chakra.iframe borderRadius={12} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2692.8185271820553!2d120.98124085484186!3d14.449494509032753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397cd805184dcb7%3A0x1d468d1a11d3ba73!2sTSVJ%20Center!5e0!3m2!1sen!2sph!4v1672726653032!5m2!1sen!2sph" />
						</AspectRatio>
					</chakra.div>
				</Flex>
			</Flex>
		</chakra.section>
	)
}

export default Contact
