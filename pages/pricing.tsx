import Layout from "@/components/Account/Layout";
import { GetStaticPropsResult } from 'next';
import { Product, ProductWithPrice } from "@/types/user";
import { FC,useEffect,useState } from 'react';
import { getActiveProductsWithPrices } from '@/utils/app/supabase-client';
import { useUser } from '@supabase/auth-helpers-react';
import { useMediaQuery } from "@mantine/hooks";
import { getSubscriptions } from "@/utils/app/supabase-client";
import { 
  Box,
  Title,
  Card,
  Group,
  Text,
  Button,
  Flex
 } from "@mantine/core";
import Subscription from "@/components/Account/Subscription";
interface Props {

}

const Pricing:FC<Props> = () => {
  
  const user = useUser();
  const [subscription, setSubscription] = useState([]);
  const [products, setProducts] = useState<Product[]>();
  const isMobile = useMediaQuery(`(max-width: 800px)`);

  useEffect(() => {
    const fetchData = async() => {
      if(user) {
        const subscription_ = await getSubscriptions(user);
        const products_ = await getActiveProductsWithPrices();
        console.log(subscription_);
        setProducts(products_);
        setSubscription(subscription_);
      }
    }
    fetchData();
  }, []);

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
              <Subscription />    
            </Box>
          </Flex>
        </Card>
      </Box>
    </Layout>
  )
}


export default Pricing;