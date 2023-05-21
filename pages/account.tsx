import { Box } from "@mantine/core"
import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/utils/app/useUser';
import { postData } from '@/utils/app/helpers';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}
const Account = () => {
    return (
        <Box>
                
        </Box>
    )
}

export default Account;