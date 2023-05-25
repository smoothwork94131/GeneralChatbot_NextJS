import { FC, useEffect} from 'react';
import { useUser } from "@/utils/app/useUser";
import { 
  Box,
  Title,
  Card,
  Flex
 } from "@mantine/core";

 import dynamic from 'next/dynamic'

const Subscription = dynamic(() => import('@/components/Account/Subscription'), { ssr: false })
const Layout = dynamic(() => import('@/components/Account/Layout'), { ssr: false })

interface Props {
  
}
const Pricing:FC<Props> = () => {
  return (
    <Layout childrenSize='70%'>
      <Box>
        <Card shadow="sm" mt={20} padding="lg" radius="md" withBorder>
          <Card.Section>
            <Title  order={1} ></Title>
          </Card.Section>
          <Flex>
            <Box sx={(theme)=> ({
              padding: theme.spacing.lg,
            })}>
              <Subscription closeModal={function(){}}/>  
            </Box>
          </Flex>
        </Card>
      </Box>
      
    </Layout>
  )
}


export default Pricing;