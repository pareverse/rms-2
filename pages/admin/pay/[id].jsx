import { Container, Grid, GridItem } from '@chakra-ui/react'
import Card from 'components/_card'

const Pay = () => {
	return (
		<Container>
			<Grid gap={6} gridTemplateColumns="1fr 384px">
				<GridItem>
					<Card></Card>
				</GridItem>

				<GridItem>
					<Card></Card>
				</GridItem>
			</Grid>
		</Container>
	)
}

export default Pay
