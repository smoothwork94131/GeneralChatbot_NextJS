import Layout from "@/components/Account/Layout";
import { GetStaticPropsResult } from 'next';
import Subscription from "@/components/Account/Subscription";
import { ProductWithPrice } from "@/types/user";
import { FC } from 'react';
import { getActiveProductsWithPrices } from '@/utils/app/supabase-client';
interface Props {
    products: ProductWithPrice[];
}

const Pricing:FC<Props> = ({products: products}) => {
  return (
    <Layout childrenSize='70%'>
      <Subscription products={products}/>
    </Layout>
  )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
    const products = await getActiveProductsWithPrices();
  
    return {
      props: {
        products
      },
      revalidate: 60
    };
  }
export default Pricing;