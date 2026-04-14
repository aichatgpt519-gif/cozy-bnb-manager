import { useParams, useNavigate } from 'react-router-dom';
import { useRooms } from '@/hooks/useRooms';
import { useCreateBooking } from '@/hooks/useBookings';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, CalendarIcon, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: rooms = [], isLoading } = useRooms();
  const createBooking = useCreateBooking();
  const room = rooms.find((r) => r.id === id);
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
          <p className="text-muted-foreground">Room not found.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const total = nights > 0 ? nights * room.price : 0;

  const handleBook = async () => {
    if (!user) {
      toast.error('Please sign in to book a room.');
      navigate('/login');
      return;
    }
    if (!checkIn || !checkOut || nights <= 0) {
      toast.error('Please select valid check-in and check-out dates.');
      return;
    }
    try {
      await createBooking.mutateAsync({
        userId: user.id,
        roomId: room.id,
        roomTitle: room.title,
        checkInDate: format(checkIn, 'yyyy-MM-dd'),
        checkOutDate: format(checkOut, 'yyyy-MM-dd'),
        totalPrice: total,
      });
      toast.success(`Booking confirmed! ${room.title} for ${nights} night(s). Total: $${total}`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Booking failed');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="overflow-hidden rounded-lg">
                <img src={room.images[0]} alt={room.title} className="aspect-video w-full object-cover" />
              </div>
              <div className="mt-6">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-heading text-3xl font-bold text-foreground">{room.title}</h1>
                  <Badge variant={room.availability ? 'default' : 'destructive'}>
                    {room.availability ? 'Available' : 'Booked'}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 text-gold fill-current" /> {room.rating}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Up to {room.capacity} guests</span>
                  <span className="capitalize">{room.type}</span>
                </div>
                <p className="mt-4 text-muted-foreground leading-relaxed">{room.description}</p>
                <div className="mt-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground">Amenities</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {room.amenities.map((a) => (
                      <span key={a} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                        <Check className="h-3 w-3 text-success" /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="sticky top-20 border-border">
                <CardHeader>
                  <CardTitle className="font-heading">Book This Room</CardTitle>
                  <div className="mt-1">
                    <span className="text-3xl font-bold text-primary">${room.price}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Check-in</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('mt-1 w-full justify-start text-left', !checkIn && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkIn ? format(checkIn, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(date) => date < new Date()} className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground">Check-out</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn('mt-1 w-full justify-start text-left', !checkOut && 'text-muted-foreground')}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOut ? format(checkOut, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(date) => date <= (checkIn || new Date())} className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {nights > 0 && (
                    <div className="rounded-lg bg-secondary p-4 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">${room.price} × {nights} night(s)</span><span className="font-semibold text-foreground">${total}</span></div>
                      <div className="mt-2 border-t border-border pt-2 flex justify-between font-bold text-foreground">
                        <span>Total</span><span>${total}</span>
                      </div>
                    </div>
                  )}

                  <Button variant="hero" size="lg" className="w-full" onClick={handleBook} disabled={!room.availability || createBooking.isPending}>
                    {createBooking.isPending ? 'Booking...' : room.availability ? 'Confirm Booking' : 'Currently Unavailable'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
