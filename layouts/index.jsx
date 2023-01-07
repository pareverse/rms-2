import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { chakra, Flex, Spinner, useDisclosure } from '@chakra-ui/react'
import Header from './header'
import Sidebar from './sidebar'

const AppLayout = (props) => {
	const router = useRouter()
	const { data: session, status } = useSession()
	const isAdmin = session ? (session.user.role === 'Admin' ? true : false) : false
	const isTenant = session ? (session.user.role === 'Tenant' ? true : false) : false
	const { isOpen: isSidebarOpen, onOpen: onSidebarOpen, onClose: onSidebarClose } = useDisclosure()

	if (status === 'loading') {
		return (
			<Flex justify="center" align="center" h="100vh" w="full">
				<Spinner size="xl" thickness={2} speed="0.8s" emptyColor="canvas-1" color="brand.default" />
			</Flex>
		)
	} else {
		if (!isAdmin && router.pathname.includes('admin')) {
			router.push('/')
			return
		}

		if (isAdmin && !router.pathname.includes('admin')) {
			router.push('/admin/dashboard')
			return
		}

		return (
			<>
				<Header session={session} isAdmin={isAdmin} isTenant={isTenant} onSidebarOpen={onSidebarOpen} />

				<chakra.div mx="auto" h="auto" minH="calc(100vh - 72px)" w="full" maxW={isAdmin ? 1536 : 1280}>
					<Sidebar session={session} isAdmin={isAdmin} isTenant={isTenant} isSidebarOpen={isSidebarOpen} onSidebarClose={onSidebarClose} />

					<chakra.main ml={{ base: 0, lg: isAdmin ? 256 : 0 }} w={{ base: 'full', lg: isAdmin ? 'calc(100% - 256px)' : 'full' }}>
						{props.children}
					</chakra.main>
				</chakra.div>
			</>
		)
	}
}

export default AppLayout
