import type { Room } from '@/types/hotel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface RoomCardProps {
  room: Room;
  index?: number;
}

export default function RoomCard({ room, index = 0 }: RoomCardProps) {
  const typeLabels: Record<string, string> = {
    standard: 'Standard',
    deluxe: 'Deluxe',
    suite: 'Suite',
    penthouse: 'Penthouse',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={room.images[0]}
            alt={room.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant={room.availability ? 'default' : 'destructive'} className="text-xs">
              {room.availability ? 'Available' : 'Booked'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {typeLabels[room.type]}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <h3 className="font-heading text-lg font-semibold text-card-foreground">{room.title}</h3>
            <div className="flex items-center gap-1 text-gold">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{room.rating}</span>
            </div>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{room.description}</p>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Up to {room.capacity} guests</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">${room.price}</span>
              <span className="text-sm text-muted-foreground"> / night</span>
            </div>
            <Button variant="hero" size="sm" asChild disabled={!room.availability}>
              <Link to={`/rooms/${room.id}`}>
                {room.availability ? 'Book Now' : 'Unavailable'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
