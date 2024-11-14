'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}

function CheckoutContent() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [ticketCount, setTicketCount] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('jazzcash');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const tickets = searchParams.get('tickets');
        if (tickets) {
            setTicketCount(parseInt(tickets, 10));
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        console.log('Submitting form with data:', {
            ...formData,
            paymentMethod,
            ticketCount,
        });

        try {
            console.log('Sending request to:', `/api/payment/${paymentMethod}`);
            const response = await fetch(`/api/payment/${paymentMethod}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: 850 * ticketCount,
                    phone: e.target.phone.value,
                    email: e.target.email.value,
                    orderId: Date.now().toString(),
                    type: 'wallet',
                }),
            });

            const data = await response.json();
            console.log('Received response:', data);

            if (data.success) {
                console.log('Payment successful, redirecting to:');
            } else {
                console.error('Payment failed:', data.message);
                toast({
                    title: 'Payment Failed',
                    description:
                        data.message ||
                        'Something went wrong. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            toast({
                title: 'Error',
                description: 'Failed to process payment. Please try again.',
            });
        }

        setIsProcessing(false);
    };

    return (
        <div className='max-w-4xl mx-auto p-6 space-y-8'>
            <form onSubmit={handleSubmit}>
                <Card className='bg-gray-800 border-gray-700 text-gray-200'>
                    <CardHeader>
                        <CardTitle>Payment Details</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='space-y-2'>
                            <Label htmlFor='paymentMethod'>
                                Select Payment Method
                            </Label>
                            <RadioGroup
                                defaultValue='jazzcash'
                                onValueChange={setPaymentMethod}
                                className='grid grid-cols-2 gap-4'
                            >
                                <div>
                                    <RadioGroupItem
                                        value='jazzcash'
                                        id='jazzcash'
                                        className='peer sr-only'
                                    />
                                    <Label
                                        htmlFor='jazzcash'
                                        className='flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800 p-4 hover:bg-gray-700 hover:text-white peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500'
                                    >
                                        <img
                                            src='/jazzcash-logo.png'
                                            alt='JazzCash'
                                            className='h-12 mb-2'
                                        />
                                        JazzCash
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem
                                        value='easypaisa'
                                        id='easypaisa'
                                        className='peer sr-only'
                                    />
                                    <Label
                                        htmlFor='easypaisa'
                                        className='flex flex-col items-center justify-between rounded-md border-2 border-gray-700 bg-gray-800 p-4 hover:bg-gray-700 hover:text-white peer-data-[state=checked]:border-emerald-500 [&:has([data-state=checked])]:border-emerald-500'
                                    >
                                        <img
                                            src='/easypaisa-logo.png'
                                            alt='EasyPaisa'
                                            className='h-12 mb-2'
                                        />
                                        EasyPaisa
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='name'>Full Name</Label>
                            <Input
                                id='name'
                                required
                                className='bg-gray-700 border-gray-600'
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='email'>Email</Label>
                            <Input
                                id='email'
                                type='email'
                                required
                                className='bg-gray-700 border-gray-600'
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='phone'>Phone Number</Label>
                            <Input
                                id='phone'
                                type='tel'
                                required
                                className='bg-gray-700 border-gray-600'
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </div>

                        <Button
                            type='submit'
                            className='w-full bg-emerald-500 hover:bg-emerald-600'
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
