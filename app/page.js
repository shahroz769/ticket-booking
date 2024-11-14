// new
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Minus,
    Plus,
    MapPin,
    Calendar,
    Clock,
    ChevronRight,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    X,
    CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster, toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import banner from '@/assets/images/banner.jpeg';
import ahmedRauf from '@/assets/images/speakers/ahmedRauf.png';
import kiranNayab from '@/assets/images/speakers/kiranNayab.png';
import maryamRao from '@/assets/images/speakers/maryamRao.png';
import mushPanjwani from '@/assets/images/speakers/mushPanjwani.png';
import saadAfridi from '@/assets/images/speakers/saadAfridi.png';
import saadLakhi from '@/assets/images/speakers/saadLakhi.png';
import usamaGhori from '@/assets/images/speakers/usamaGhori.png';
import usmanSaleem from '@/assets/images/speakers/usmanSaleem.png';
import wajihUdDin from '@/assets/images/speakers/wajihUdDin.png';

export default function Page() {
    const [activeTab, setActiveTab] = useState('tickets');
    const [ticketCount, setTicketCount] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('jazzcash');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [transactionDetails, setTransactionDetails] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const [isListEventModalOpen, setIsListEventModalOpen] = useState(false);
    const ticketPrice = 13;

    const speakers = [
        {
            name: 'Ahmed Rauf',
            title: 'Founder',
            handle: '@telemartofficalpage',
            image: ahmedRauf,
        },
        {
            name: 'Saad Afridi',
            title: 'CEO',
            handle: '@scentsnstories',
            image: saadAfridi,
        },
        {
            name: 'Saad Lakhi',
            title: 'Founder',
            handle: '@SRL Commercify',
            image: saadLakhi,
        },
        {
            name: 'Mush Panjwani',
            title: 'Founder',
            handle: '@Coffee Wagera',
            image: mushPanjwani,
        },
        {
            name: 'Usman Saleem',
            title: 'CEO',
            handle: '@Khazanay',
            image: usmanSaleem,
        },
        {
            name: 'Maryam Rao',
            title: 'Consultant Trainer',
            handle: '@SBCG',
            image: maryamRao,
        },
        {
            name: 'Kiran Nayab',
            title: 'Event Host',
            handle: '',
            image: kiranNayab,
        },
        {
            name: 'Wajih Uddin',
            title: 'Speaker',
            handle: '@Youth Club',
            image: wajihUdDin,
        },
        {
            name: 'Usama Ghori',
            title: 'Comedian',
            handle: '',
            image: usamaGhori,
        },
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setPaymentError(null);

        try {
            const response = await fetch(`/api/payment/${paymentMethod}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: ticketPrice * ticketCount,
                    phone: formData.phone,
                    email: formData.email,
                    orderId: Date.now().toString(),
                    type: 'wallet',
                }),
            });

            const data = await response.json();

            if (data.success) {
                setPaymentSuccess(true);
                setTransactionDetails(data.data);

                // Save transaction data to MongoDB
                const saveResponse = await fetch('/api/save-transaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        paymentMethod,
                        ticketCount,
                        amountPaid: ticketPrice * ticketCount,
                        transactionId: data.data.txnNo,
                    }),
                });

                const saveData = await saveResponse.json();

                if (saveData.success) {
                    toast.success('Payment Successful!', {
                        description:
                            'Your payment has been processed and saved successfully.',
                        duration: 5000,
                    });
                } else {
                    console.error(
                        'Failed to save transaction data:',
                        saveData.message
                    );
                    toast.error('Payment Processed', {
                        description:
                            'Payment successful, but there was an issue saving your data. Please contact support.',
                        duration: 5000,
                    });
                }
            } else {
                setPaymentError(
                    data.message || 'Something went wrong. Please try again.'
                );
                toast.error('Payment Failed', {
                    description:
                        data.message ||
                        'Something went wrong. Please try again.',
                });
                setPaymentSuccess(false);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            setPaymentError('Failed to process payment. Please try again.');
            toast.error('Error', {
                description: 'Failed to process payment. Please try again.',
            });
            setPaymentSuccess(false);
        }

        setIsProcessing(false);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
        });
        setPaymentSuccess(false);
        setPaymentError(null);
        setTransactionDetails(null);
        setIsModalOpen(false);
    };

    return (
        <div className='min-h-screen bg-black text-white flex flex-col'>
            {/* Navbar */}
            <nav className='border-b border-gray-800'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center h-16'>
                        <div className='flex items-center'>
                            <Link
                                href='/'
                                className='text-2xl font-bold text-emerald-400'
                            >
                                BookKrlo
                            </Link>
                            <div className='hidden md:block ml-10'>
                                <div className='flex items-center space-x-4'>
                                    <Link
                                        href='/'
                                        className='text-gray-300 hover:text-white px-3 py-2'
                                    >
                                        Events
                                    </Link>
                                    <Link
                                        href='/'
                                        className='text-gray-300 hover:text-white px-3 py-2'
                                    >
                                        About
                                    </Link>
                                    <Link
                                        href='/'
                                        className='text-gray-300 hover:text-white px-3 py-2'
                                    >
                                        Contact
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <Button
                            className='bg-emerald-500 hover:bg-emerald-600 rounded-full'
                            onClick={() => setIsListEventModalOpen(true)}
                        >
                            List Your Event
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Event Banner */}
            <div className='fill max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 relative w-full rounded-3xl overflow-hidden'>
                <div className='rounded-3xl overflow-hidden'>
                    <Image
                        src={banner}
                        alt='Event banner'
                        objectFit='cover'
                        priority
                        className='rounded-3xl overflow-hidden'
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className='flex-grow'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
                    {/* Event Title and Details */}
                    <div>
                        <h1 className='text-4xl font-bold mb-2 text-emerald-400'>
                            InspireCon'24
                        </h1>
                        <h2 className='text-xl mb-4'>
                            Inspiring Journeys from Vision to Reality.
                        </h2>
                        <div className='flex flex-col items-start space-y-2 text-gray-200'>
                            <div className='flex items-center'>
                                <Calendar className='w-5 h-5 mr-2' />
                                <span>26 Nov 2024</span>
                            </div>
                            <div className='flex items-center'>
                                <Clock className='w-5 h-5 mr-2' />
                                <span>08:30 pm</span>
                            </div>
                            <div className='flex items-center'>
                                <MapPin className='w-5 h-5 mr-2' />
                                <span>
                                    Main Auditorium, UIT University, Karachi
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tabbed Interface */}
                    <Tabs defaultValue='tickets' className='w-full'>
                        <TabsList className='w-full grid grid-cols-3 rounded-full bg-gray-800'>
                            <TabsTrigger
                                value='tickets'
                                className='rounded-full'
                            >
                                Tickets
                            </TabsTrigger>
                            <TabsTrigger
                                value='details'
                                className='rounded-full'
                            >
                                Event Details
                            </TabsTrigger>
                            <TabsTrigger
                                value='location'
                                className='rounded-full'
                            >
                                Location
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value='tickets'>
                            <Card className='bg-gray-800 border-gray-700 rounded-3xl'>
                                <CardContent className='p-6'>
                                    <div className='space-y-6'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <h3 className='text-lg font-semibold text-gray-200'>
                                                    Standard Ticket
                                                </h3>
                                                <p className='text-gray-300'>
                                                    Rs {ticketPrice}
                                                </p>
                                            </div>
                                            <div className='flex items-center space-x-4'>
                                                <Button
                                                    variant='outline'
                                                    size='icon'
                                                    onClick={() =>
                                                        setTicketCount(
                                                            Math.max(
                                                                1,
                                                                ticketCount - 1
                                                            )
                                                        )
                                                    }
                                                    className='rounded-full border-gray-700'
                                                >
                                                    <Minus className='h-4 w-4' />
                                                </Button>
                                                <span className='w-8 text-center text-gray-200'>
                                                    {ticketCount}
                                                </span>
                                                <Button
                                                    variant='outline'
                                                    size='icon'
                                                    onClick={() =>
                                                        setTicketCount(
                                                            ticketCount + 1
                                                        )
                                                    }
                                                    className='rounded-full border-gray-700'
                                                >
                                                    <Plus className='h-4 w-4' />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className='border-t border-gray-700 pt-4'>
                                            <div className='flex justify-between text-lg font-semibold text-gray-200'>
                                                <span>Total Amount</span>
                                                <span>
                                                    Rs{' '}
                                                    {ticketCount * ticketPrice}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            className='w-full bg-emerald-500 hover:bg-emerald-600 rounded-full'
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            Proceed to Checkout
                                            <ChevronRight className='ml-2 h-4 w-4' />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value='details'>
                            <Card className='bg-gray-800 border-gray-700 rounded-3xl'>
                                <CardContent className='p-6 space-y-4'>
                                    <h3 className='text-2xl font-bold text-emerald-400'>
                                        About the Event
                                    </h3>
                                    <p className='text-gray-200'>
                                        This event aims to foster a culture of
                                        entrepreneurial thinking, motivate
                                        aspiring entrepreneurs, and explore key
                                        norms that drive success in today's
                                        dynamic economy. Through InspireCon, we
                                        are committed to guiding the next
                                        generation of changemakers, offering
                                        valuable industry insights, and sharing
                                        the personal stories of successful
                                        industry icons about how they began
                                        their journeys and achieved their goals.
                                    </p>
                                    <div className='space-y-2'>
                                        <p className='text-gray-200'>
                                            <strong>Date:</strong> 26 Nov 2024
                                        </p>
                                        <p className='text-gray-200'>
                                            <strong>Gates Open:</strong> 8:00 PM
                                        </p>
                                        <p className='text-gray-200'>
                                            <strong>Event Time:</strong> 8:30 -
                                            11:30 PM
                                        </p>
                                        <p className='text-gray-200'>
                                            <strong>Venue:</strong> Main
                                            Auditorium, UIT University, Karachi
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value='location'>
                            <Card className='bg-gray-800 border-gray-700 rounded-3xl'>
                                <CardContent className='p-6 space-y-4'>
                                    <div className='flex items-center mb-4'>
                                        <MapPin className='text-white w-5 h-5 mr-2' />
                                        <span className='text-gray-200'>
                                            Main Auditorium, UIT University,
                                            Karachi
                                        </span>
                                    </div>
                                    <div className='h-[400px] w-full bg-gray-800 rounded-3xl overflow-hidden'>
                                        <iframe
                                            src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14472.50780329386!2d67.1088845!3d24.9277448!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb338c700571b09%3A0xd86779b29e77f36a!2sUIT%20University!5e0!3m2!1sen!2s!4v1731139443563!5m2!1sen!2s'
                                            width='100%'
                                            height='100%'
                                            style={{ border: 0 }}
                                            allowFullScreen=''
                                            loading='lazy'
                                            referrerPolicy='no-referrer-when-downgrade'
                                            className='rounded-3xl'
                                        ></iframe>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* Speakers Section with rounded corners */}
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                        <h2 className='text-3xl font-bold mb-8'>
                            <span className='text-emerald-400'>Tentative Speakers</span>
                        </h2>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                            {speakers.map((speaker, index) => (
                                <Card
                                    key={index}
                                    className='bg-gray-800 border-gray-700 rounded-3xl'
                                >
                                    <CardContent className='p-4'>
                                        <div className='aspect-square relative mb-4 rounded-3xl overflow-hidden'>
                                            <Image
                                                src={speaker.image}
                                                alt={speaker.name}
                                                layout='fill'
                                                objectFit='cover'
                                                sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw'
                                            />
                                        </div>
                                        <h3 className='text-lg font-bold text-gray-200 break-words hyphens-auto'>
                                            {speaker.name}
                                        </h3>
                                        <p className='text-sm text-emerald-400 break-words'>
                                            {speaker.title}
                                        </p>
                                        {speaker.handle && (
                                            <p className='text-xs text-gray-400 break-words'>
                                                {speaker.handle}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className='bg-gray-800 border-t border-gray-700'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                        <div>
                            <h3 className='text-lg font-semibold mb-4'>
                                Socials
                            </h3>
                            <div className='flex space-x-4'>
                                <Facebook className='w-6 h-6 text-gray-300 hover:text-white cursor-pointer' />
                                <Instagram className='w-6 h-6 text-gray-300 hover:text-white cursor-pointer' />
                                <Linkedin className='w-6 h-6 text-gray-300 hover:text-white cursor-pointer' />
                                <Twitter className='w-6 h-6 text-gray-300 hover:text-white cursor-pointer' />
                            </div>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold mb-4'>
                                Resources
                            </h3>
                            <ul className='space-y-2'>
                                <li>
                                    <Link
                                        href='/'
                                        className='text-gray-300 hover:text-white'
                                    >
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href='/'
                                        className='text-gray-300 hover:text-white'
                                    >
                                        Terms
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href='/'
                                        className='text-gray-300 hover:text-white'
                                    >
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href='/'
                                        className='text-gray-300 hover:text-white'
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className='text-lg font-semibold mb-4'>
                                Contact
                            </h3>
                            <p className='text-gray-300'>
                                Email : bookkrlo.info@gmail.com
                            </p>
                            {/* <p className='text-gray-300'>
                                WhatsApp: 0309 2502772
                            </p> */}
                        </div>
                        <div>
                            <Link
                                href='/'
                                className='text-2xl font-bold text-emerald-400'
                            >
                                BookKrlo
                            </Link>
                            <p className='text-gray-300 mt-2'>
                                Tickets anywhere anytime!
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Checkout Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className='bg-gray-800 border-gray-700 text-gray-200 rounded-3xl'>
                    <DialogHeader>
                        <DialogTitle>
                            {paymentSuccess ? 'Payment Successful' : 'Checkout'}
                        </DialogTitle>
                    </DialogHeader>
                    {paymentSuccess ? (
                        <div className='space-y-4'>
                            <div className='flex items-center justify-center'>
                                <CheckCircle className='text-emerald-500 w-16 h-16' />
                            </div>
                            <h3 className='text-xl font-semibold text-center'>
                                Thank you for your purchase!
                            </h3>
                            <div className='space-y-2'>
                                <p>
                                    <strong>Transaction ID:</strong>{' '}
                                    {transactionDetails.txnNo}
                                </p>
                                <p>
                                    <strong>Amount Paid:</strong> Rs{' '}
                                    {ticketCount * ticketPrice}
                                </p>
                                <p>
                                    <strong>Payment Method:</strong>{' '}
                                    {paymentMethod === 'jazzcash'
                                        ? 'JazzCash'
                                        : 'EasyPaisa'}
                                </p>
                                <p>
                                    <strong>Tickets:</strong> {ticketCount}
                                </p>
                                <p>
                                    <strong>Email:</strong> {formData.email}
                                </p>
                            </div>
                            <p className='text-sm text-gray-400'>
                                Your tickets and receipt have been sent to your
                                email. Please check your inbox (and spam folder)
                                for details.
                            </p>
                            <Button
                                className='w-full bg-emerald-500 hover:bg-emerald-600 rounded-full'
                                onClick={resetForm}
                            >
                                Close
                            </Button>
                        </div>
                    ) : paymentError ? (
                        <div className='space-y-4'>
                            <div className='flex items-center justify-center'>
                                <X className='text-red-500 w-16 h-16' />
                            </div>
                            <h3 className='text-xl font-semibold text-center'>
                                Payment Failed
                            </h3>
                            <p className='text-center'>{paymentError}</p>
                            <Button
                                className='w-full bg-emerald-500 hover:bg-emerald-600 rounded-full'
                                onClick={() => setPaymentError(null)}
                            >
                                Try Again
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className='space-y-6'>
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
                                    className='bg-gray-700 border-gray-600 rounded-full'
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
                                    className='bg-gray-700 border-gray-600 rounded-full'
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
                                    className='bg-gray-700 border-gray-600 rounded-full'
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <p className='text-sm text-gray-400'>
                                Please use the phone number registered with your{' '}
                                {paymentMethod === 'jazzcash'
                                    ? 'JazzCash'
                                    : 'EasyPaisa'}{' '}
                                account.
                            </p>

                            <Button
                                type='submit'
                                className='w-full bg-emerald-500 hover:bg-emerald-600 rounded-full'
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* List Your Event Modal */}
            <Dialog
                open={isListEventModalOpen}
                onOpenChange={setIsListEventModalOpen}
            >
                <DialogContent className='bg-gray-800 border-gray-700 text-gray-200 rounded-3xl'>
                    <DialogHeader>
                        <DialogTitle>List Your Event</DialogTitle>
                        <DialogDescription className='text-gray-200'>
                            For registration, contact bookkrlo.info@gmail.com
                        </DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4 py-4'>
                        <p>
                            Please reach out to us via email to list your event.
                            We'll be happy to assist you with the process.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsListEventModalOpen(false)}
                        className='bg-emerald-500 hover:bg-emerald-600 rounded-full'
                    >
                        Close
                    </Button>
                </DialogContent>
            </Dialog>

            <Toaster position='top-right' />
        </div>
    );
}
