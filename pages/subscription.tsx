import { Box } from '@mantine/core';
import { FC, useState } from 'react';
import { ProductWithPrice } from '@/types/user';

import { getActiveProductsWithPrices } from '@/utils/app/supabase-client';
import { GetStaticPropsResult } from 'next';
import SubscriptionPage from '@/components/Account/Subscription';

interface Props {
    products: ProductWithPrice[];
}

const Subscription: FC<Props> = ({ products }) => {
    return (
        <Box>
            <SubscriptionPage products={products}/>
        </Box>
    )
};

export default Subscription;
export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    const products = await getActiveProductsWithPrices();
    return {
      props: {
        products
      },
      revalidate: 60
    };
}
  
