import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
    TextInput,
    PasswordInput,
    Paper,
    Group,
    PaperProps,
    Button,
    Divider,
    Checkbox,
    Anchor,
    Stack,
    Text
} from '@mantine/core';
import { IconBrandGithub } from '@tabler/icons-react';
import { supabase } from '@/utils/app/supabase-client';
import { useState, FC } from 'react';
import { useRouter } from 'next/router';

interface Props {
    modalType: string,
    closeModal: ()=>void;
}

export const AuthenticationForm:FC<Props> = ({modalType, closeModal}) => {

    let toggleGroup = ['Sign In', 'Sign Up'] ;
    const router = useRouter();
    if(modalType == 'signup') {
        toggleGroup = ['Sign Up', 'Sign In'];
    }

    const [type, toggle] = useToggle(toggleGroup);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    const Auth = async( type ) => {
        const email = form.values.email;
        const password = form.values.password;
        
        if(type == "Sign In") {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if(error) {  
                setErrorMessage(error.message);
                return;
            }   
            if(window.location.pathname == "/signin") {
                router.replace("/pricing");
            } else {
                closeModal();
            }
        }  else if( type == "Sign Up") {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            if(error) {  
                setErrorMessage(error.message);
                return;
            }
            closeModal();
        }
        
    }

    const AuthWidthProvider = async(provider) => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
        })
    }
    return (
        
        <Paper radius="md" p="xl" withBorder >
            <Group grow mb="md" mt="md">
                <Button  variant="default" color="gray"  leftIcon={<IconBrandGithub />} onClick={() => {AuthWidthProvider('github')}}>{type} with GitHub </Button>
            </Group>
            <Divider label="Or continue with email" labelPosition="center" my="lg" />
            <form onSubmit={form.onSubmit(() => { })}>
                <Stack>
                    {type === 'Sign Up' && (
                        <TextInput
                            label="Name"
                            placeholder="Your name"
                            value={form.values.name}
                            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                            radius="md"
                        />
                    )}

                    <TextInput
                        required
                        label="Email"
                        placeholder="hello@mantine.dev"
                        value={form.values.email}
                        onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        error={form.errors.email && 'Invalid email'}
                        radius="md"
                    />

                    <PasswordInput
                        required
                        label="Password"
                        placeholder="Your password"
                        value={form.values.password}
                        onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                        error={form.errors.password && 'Password should include at least 6 characters'}
                        radius="md"
                    />

                    {type === 'register' && (
                        <Checkbox
                            label="I accept terms and conditions"
                            checked={form.values.terms}
                            onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                        />
                    )}
                </Stack>

                <Group position="apart" mt="xl">
                    <Anchor
                        component="button"
                        type="button"
                        color="dimmed"
                        onClick={() => toggle()}
                        size="xs"
                    >
                        {type === 'Sign Up'
                            ? 'Already have an account? Sign In'
                            : "Don't have an account? Sign Up"}
                        
                    </Anchor>
                    
                    <Text sx={(theme) =>({
                        color: theme.colors.red,
                        fontSize: theme.fontSizes.sm
                    })}>
                        {errorMessage}
                    </Text>
                    <Button  variant="outline" onClick={()=>{Auth(type)}}>{type}</Button>
                </Group>
            </form>
         
        </Paper>
    );
}