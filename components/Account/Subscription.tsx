import { Card, Image, Text, Badge, Button, Group, Flex, Box, Space, Textarea, Loader, Title } from '@mantine/core';
import { FC, useState, useEffect } from 'react';
import { Price, Product, ProductWithPrice } from '@/types/user';
import { useUser } from '@/utils/app/useUser';
import { SegmentedControl } from '@mantine/core';
import { getStripe } from '@/utils/app/stripe-client';
import { postData } from '@/utils/app/helpers';
import { useRouter } from 'next/router';
import { getActiveProductsWithPrices } from '@/utils/app/supabase-client';

type BillingInterval = 'year' | 'month';

const Subscription = () => {
    
    const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
    const { user, isLoading, subscription } = useUser();
    const [products, setProducts] = useState<ProductWithPrice[]>([]);
    const [priceIdLoading, setPriceIdLoading] = useState<string>();
    const router = useRouter();
    
    const setSeg = (value) => {
        setBillingInterval(value);
    }
    useEffect(() => {
        const fetchData = async() => {
            const res = await getActiveProductsWithPrices();
            setProducts(res);
        }
        fetchData();
    }, []);
    const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);
        const return_url = window.location.href;
        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { 
                    price: price,
                    return_url: return_url
                 }
            });
            const stripe = await getStripe();
            stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
            return alert((error as Error)?.message);
        } finally {
            setPriceIdLoading(undefined);
        }
    };
    return (
        <Box
            sx={(theme) => ({
                padding: theme.spacing.xs,
            })}
        >
            <SegmentedControl
                value={billingInterval}
                onChange={setSeg}
                data={[
                    { label: 'Montly billing', value: 'month' },
                    { label: 'Yearly billing', value: 'year' },
                ]}
            />

            {products.length > 0 ? (
                <Flex
                    gap={`sm`}
                    sx={(theme) => ({
                        padding: theme.spacing.md
                    })}
                >
                    {products.map((product, key) => {
                        const price = product?.prices?.find(
                            (price) => price.interval === billingInterval
                        );
                        if (!price) return null;
                        const priceString = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: price.currency,
                            minimumFractionDigits: 0
                        }).format((price?.unit_amount || 0) / 100);

                        return (
                            <Card shadow="sm" padding="lg" radius="md" withBorder key={key}>
                                <Group position="apart" >
                                    <Text weight={500} sx={(theme) =>({
                                        fontSize: '25px'
                                    })}>{product.name}</Text>
                                </Group>
                                <Space />
                                <Text size="md" color="dimmed" >
                                    {product.description}
                                </Text>
                                <Space />
                                <Group
                                    spacing={0}
                                >
                                    <Text
                                        sx={(theme) => ({
                                            fontSize: '40px',
                                            marginTop: '20px',
                                            
                                        })}
                                        className='font-extrabold'
                                    >
                                        {priceString}
                                    </Text>
                                    <Text
                                        sx={(theme) => ({
                                            paddingTop: '40px'
                                        })}
                                    >
                                        /{billingInterval}
                                    </Text>
                                </Group>
                                <Space />
                                <Button
                                    variant="outline" color="blue" fullWidth mt="md" radius="md"
                                    onClick={() => handleCheckout(price)}
                                    disabled={priceIdLoading?true:false}
                                >
                                    {
                                        priceIdLoading?
                                        <Loader size={`sm`} variant="dots"/>:'Subscribe'
                                    }
                                </Button>
                            </Card>
                        );
                    })}
                </Flex>
            ) : (
                <Box></Box>
            )}
        </Box>
    );
};
export default Subscription;
