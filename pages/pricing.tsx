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
import { useRouter } from 'next/router';

interface Props {

}

const Pricing:FC<Props> = () => {
  
  const user = useUser();
  const router = useRouter();

  if(!user) {
    router.replace("/signin");
  }

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