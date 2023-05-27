import { 
  Box,
  Title,
  Card,
 } from "@mantine/core";
import dynamic from 'next/dynamic'

const Subscription = dynamic(() => import('@/components/Account/Subscription'), { ssr: false })
const Pricing = () => {
  return (
    <Box>
      <Card shadow="sm" mt={20} padding="lg" radius="md" withBorder>
        <Card.Section>
          <Title  order={1} ></Title>
        </Card.Section>
          <Box sx={(theme)=> ({
            padding: theme.spacing.lg,
          })}>
            <Subscription />  
          </Box>
      </Card>
    </Box>
  )
}


export default Pricing;
