import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { signIn, signOut } from 'next-auth/react'
import { Avatar, Button, chakra, Flex, Icon, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { FiBox, FiLogOut, FiMoon, FiSun } from 'react-icons/fi'
import { Google } from 'components/_logos'

const Header = ({ session, isAdmin, isTenant, onSidebarOpen }) => {
	const router = useRouter()
	const { toggleColorMode } = useColorMode()
	const colorModeIcon = useColorModeValue(<FiMoon size={16} fill="currentColor" />, <FiSun size={16} fill="currentColor" />)
	const [isScrolling, setIsScrolling] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', () => {
				setIsScrolling(window.pageYOffset > 0)
			})
		}
	}, [])

	return (
		<chakra.header bg="white" position="sticky" top={0} shadow={isScrolling && 'sm'} transition=".4s" zIndex={99} _dark={{ bg: isScrolling ? 'surface' : 'system', border: 'none', shadow: isScrolling && 'dark-xl' }}>
			<Flex align="center" gap={6} mx="auto" px={6} h="72px" w="full" maxW={isAdmin ? 1536 : 1280}>
				<Flex justify="start" align="center" outline="1px solid transparent">
					<Flex align="center" gap={2} color="accent-1" cursor="pointer">
						<Icon as={FiBox} boxSize={6} />

						<Text fontSize="lg" fontWeight="semibold" lineHeight={6}>
							TSVJ CENTER
						</Text>
					</Flex>
				</Flex>

				<Flex flex={1} justify="end" align="center" outline="1px solid transparent">
					<Flex display={{ base: 'none', lg: isAdmin ? 'none' : 'flex' }} align="center" gap={8} mr={8}>
						<NextLink href="/">
							<Link as="span">Home</Link>
						</NextLink>

						<NextLink href="/#units">
							<Link as="span" active={router.pathname.includes('units') ? 1 : 0}>
								Units
							</Link>
						</NextLink>

						<NextLink href="/#blogs">
							<Link as="span" active={router.pathname.includes('blogs') ? 1 : 0}>
								Blogs
							</Link>
						</NextLink>

						<NextLink href="/#company">
							<Link as="span" active={router.pathname.includes('company') ? 1 : 0}>
								Company
							</Link>
						</NextLink>

						<NextLink href="/#contact">
							<Link as="span" active={router.pathname.includes('contact') ? 1 : 0}>
								Call Us
							</Link>
						</NextLink>
					</Flex>

					{session ? (
						<Menu>
							<MenuButton>
								<Avatar h={10} w={10} name={session.user.name} src={session.user.image} />
							</MenuButton>

							<MenuList minW={256}>
								<MenuItem onClick={() => router.push('/profile')}>
									<Flex align="center" gap={3}>
										<Avatar name={session.user.name} src={session.user.image} />
										<Text>{session.user.name}</Text>
									</Flex>
								</MenuItem>

								<MenuDivider />

								<MenuItem icon={<FiLogOut size={16} />} onClick={() => signOut()}>
									Sign Out
								</MenuItem>
							</MenuList>
						</Menu>
					) : (
						<Button
							colorScheme="brand"
							leftIcon={
								<Flex bg="white" justify="center" align="center" borderRadius="full" h={6} w={6}>
									<Google size={16} />
								</Flex>
							}
							onClick={() => signIn('google')}
						>
							Sign in
						</Button>
					)}
				</Flex>
			</Flex>
		</chakra.header>
	)
}

export default Header
