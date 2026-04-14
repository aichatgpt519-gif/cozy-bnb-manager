import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Shield, Clock, Loader2 } from 'lucide-react';
import heroImage from '@/assets/hero-hotel.jpg';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import { useRooms } from '@/hooks/useRooms';

const features = [
  { icon: Star, title: 'Premium Quality', desc: 'World-class amenities and service in every room.' },
  { icon: Shield, title: 'Secure Booking', desc: 'Your reservations are safe and guaranteed.' },
  { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock concierge at your service.' },
];

export default function Index() {
  const { data: rooms = [], isLoading } = useRooms();
  const featuredRooms = rooms.filter((r) => r.availability).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Grand Haven Hotel lobby" className="h-full w-full object-cover" width={1600} height={800} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-xl">
            <h1 className="font-heading text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Welcome to <br /><span className="text-gold">Grand Haven</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">Experience unparalleled luxury and comfort. Your perfect escape begins here.</p>
            <div className="mt-8 flex gap-3">
              <Button variant="hero" size="lg" asChild><Link to="/rooms">Explore Rooms</Link></Button>
              <Button variant="outline" size="lg" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                <Link to="/register">Join Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center rounded-lg border border-border bg-card p-8 text-center shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-card-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">Featured Rooms</h2>
            <p className="mt-2 text-muted-foreground">Discover our most popular accommodations</p>
          </div>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredRooms.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i} />
              ))}
            </div>
          )}
          <div className="mt-10 text-center">
            <Button variant="outline" size="lg" asChild><Link to="/rooms">View All Rooms</Link></Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
