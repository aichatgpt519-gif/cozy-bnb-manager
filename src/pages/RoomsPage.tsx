import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import { useRooms } from '@/hooks/useRooms';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';

export default function RoomsPage() {
  const { data: rooms = [], isLoading } = useRooms();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('price-asc');
  const [availOnly, setAvailOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = [...rooms];
    if (search) result = result.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
    if (typeFilter !== 'all') result = result.filter((r) => r.type === typeFilter);
    if (availOnly) result = result.filter((r) => r.availability);
    result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
    return result;
  }, [rooms, search, typeFilter, sortBy, availOnly]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-heading text-3xl font-bold text-foreground">Our Rooms</h1>
        <p className="mt-1 text-muted-foreground">Find your perfect stay</p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search rooms..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="deluxe">Deluxe</SelectItem>
              <SelectItem value="suite">Suite</SelectItem>
              <SelectItem value="penthouse">Penthouse</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Price: Low → High</SelectItem>
              <SelectItem value="price-desc">Price: High → Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={availOnly} onChange={(e) => setAvailOnly(e.target.checked)} className="accent-primary" />
            Available only
          </label>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((room, i) => (
                <RoomCard key={room.id} room={room} index={i} />
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="mt-12 text-center text-muted-foreground">No rooms match your criteria.</p>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
