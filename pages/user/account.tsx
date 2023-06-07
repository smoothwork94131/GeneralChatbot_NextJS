import { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import { useUser } from '@/utils/app/useUser';
import { postData } from '@/utils/app/helpers';


import {
  Title,
  Card,
  Box,
  Text,
  Button,
  Flex,
  Loader,
  Divider
} from "@mantine/core";
import { useRouter } from 'next/router';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

const Account = ({ user }: { user: User }) => {
  const { isLoading, subscription } = useUser();
  // const [subscription, setSubscription] = useState<Subscription>();
  
  const router = useRouter();

  if(!user) {
    router.replace('/user/signin');
  }
  const redirectToCustomerPortal = async () => {
    // setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link',
        data: {
          return_url: `${window.location.href}`
        }
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    // setLoading(false);
  };
  // useEffect(() => {
  //   setLoading(true);
  //   const fetchData = async () => {
  //     const subscription_ = await getSubscriptions(user);
  //     if (subscription_.length > 0) {
  //       setSubscription(subscription_[0]);
  //     } 
  //     setLoading(false);
  //   }
  //   fetchData();
  // }, [])

  // useEffect(() => {
  //   if (subscription) {
  //     setLoading(false);
  //   }
  // }, [subscription]);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
      <Box>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={2}>Your Plan</Title>
          {
              isLoading?
              <Loader variant='dots' mt={20} ml={20}/>:
              <Box>
                <Text size="sm" color="dimmed">
                {
                  subscription
                    ? `You are currently on the ${subscription?.prices?.products?.name}.`
                    : 'You are currently on the Free plan'
                }
              </Text>
              <Title 
                order={4}
                sx={(theme) => ({
                  marginTop: '15px'
                })}>
                {isLoading ? (
                  <div className="h-12 mb-2 text-center">
                    <Loader variant='dots' />
                  </div>
                ) : subscription ? (
                  `${subscriptionPrice}/${subscription?.prices?.interval}`
                ) : (
                  <Link href="/user/pricing" ><Button variant='outline'>Choose your plan</Button></Link>
                )}
              </Title>
              <Divider my="sm" variant="dashed" />
              <Flex
                justify='space-between'
                align='center'
              >
                <Text>

                </Text>
                <Button className='bg-sky-500/100'
                  disabled={isLoading || !subscription}
                  onClick={() => {
                    redirectToCustomerPortal()
                  }}
                >
                  Open Customer Portal
                </Button>
              </Flex>
              </Box>
          }
          
          
        </Card>
        <Card shadow="sm" padding="lg" radius="md" withBorder mt={20}>
          <Title order={2}>Your Email</Title>
          <Text size="sm" color="dimmed">

          </Text>
          <Title
            order={4}
            sx={(theme) => ({
              marginTop: '15px'
            })}>
            {user ? user.email : undefined}
          </Title>
          <Divider my="sm" variant="dashed" />
          <Flex
            justify='space-between'
            align='center'
          >
            <Text>
              We will email you to verify the change.
            </Text>
          </Flex>
        </Card>
      </Box>

  )
}
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/user/signin',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  };
};
export default Account;