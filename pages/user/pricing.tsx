import Subscription from "@/components/Account/Subscription";
import { getServerUser } from "@/utils/app/useUser";
import {
  Box,
  Title,
  Card,
} from "@mantine/core";
import { GetServerSideProps } from "next";
import dynamic from 'next/dynamic'

// const Subscription = dynamic(() => import('@/components/Account/Subscription'), { ssr: true })
const Pricing = ({user, userData}) => {
  return (
    <Box>
      <Card shadow="sm" mt={20} padding="lg" radius="md" withBorder>
        <Card.Section>
          <Title order={1} ></Title>
        </Card.Section>
        <Box sx={(theme) => ({
          padding: theme.spacing.lg,
        })}>
          <Subscription userData={userData}/>
        </Box>
      </Card>
    </Box>
  )
}


export default Pricing;

export const getServerSideProps : GetServerSideProps = async (ctx) => {
  let user = await getServerUser(ctx);
  return user;
}

