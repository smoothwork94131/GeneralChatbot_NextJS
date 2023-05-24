import Layout from "@/components/Account/Layout";
import { FC, useEffect} from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { 
  Box,
  Title,
  Card,
  Flex
 } from "@mantine/core";
import Subscription from "@/components/Account/Subscription";
interface Props {

}
const Pricing:FC<Props> = () => {
  
  const user = useUser();

  useEffect(()=> {
    if(!user) {
      window.location.href='/signin';
    }
  },[])
  return (
    <Layout childrenSize='70%'>
      {/* <Subscription products={products}/> */}
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