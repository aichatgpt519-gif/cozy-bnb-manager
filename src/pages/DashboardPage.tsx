import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarCheck, Hotel, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const mockBookings = [
  { id: '1', roomTitle: 'Deluxe King Room', checkIn: '2026-04-20', checkOut: '2026-04-23', total: 660, status: 'confirmed' as const },
  { id: '2', roomTitle: 'Standard Comfort Room', checkIn: '2026-03-10', checkOut: '2026-03-12', total: 240, status: 'completed' as const },
];

const stats = [
  { label: 'Total Bookings', value: '156', icon: CalendarCheck, color: 'text-primary' },
  { label: 'Revenue', value: '$42,800', icon: DollarSign, color: 'text-success' },
  { label: 'Rooms', value: '24', icon: Hotel, color: 'text-accent' },
  { label: 'Guests', value: '89', icon: Users, color: 'text-gold' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-heading text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-secondary ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Booking History */}
        <Card className="mt-8 border-border">
          <CardHeader>
            <CardTitle className="font-heading">Your Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBookings.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
                  <div>
                    <p className="font-semibold text-foreground">{b.roomTitle}</p>
                    <p className="text-sm text-muted-foreground">{b.checkIn} → {b.checkOut}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">${b.total}</span>
                    <Badge variant={b.status === 'confirmed' ? 'default' : 'secondary'}>
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
