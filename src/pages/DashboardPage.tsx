import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useBookings } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarCheck, Hotel, DollarSign, Users, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

function AdminDashboard() {
  const { data: rooms = [], isLoading: roomsLoading } = useRooms();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const queryClient = useQueryClient();
  const [roomDialog, setRoomDialog] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('standard');
  const [capacity, setCapacity] = useState('2');
  const [amenities, setAmenities] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const resetForm = () => {
    setTitle(''); setDescription(''); setPrice(''); setType('standard');
    setCapacity('2'); setAmenities(''); setImageUrl(''); setEditingRoom(null);
  };

  const openEdit = (room: any) => {
    setEditingRoom(room);
    setTitle(room.title);
    setDescription(room.description);
    setPrice(String(room.price));
    setType(room.type);
    setCapacity(String(room.capacity));
    setAmenities(room.amenities.join(', '));
    setImageUrl(room.images[0] || '');
    setRoomDialog(true);
  };

  const handleSaveRoom = async () => {
    if (!title || !price) { toast.error('Title and price are required'); return; }
    setSaving(true);
    const roomData = {
      title,
      description,
      price: Number(price),
      type,
      capacity: Number(capacity),
      amenities: amenities.split(',').map(a => a.trim()).filter(Boolean),
      images: imageUrl ? [imageUrl] : [],
      availability: true,
    };

    if (editingRoom) {
      const { error } = await supabase.from('rooms').update(roomData).eq('id', editingRoom.id);
      if (error) toast.error(error.message); else toast.success('Room updated!');
    } else {
      const { error } = await supabase.from('rooms').insert(roomData);
      if (error) toast.error(error.message); else toast.success('Room added!');
    }
    setSaving(false);
    setRoomDialog(false);
    resetForm();
    queryClient.invalidateQueries({ queryKey: ['rooms'] });
  };

  const handleDeleteRoom = async (id: string) => {
    if (!confirm('Delete this room?')) return;
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) toast.error(error.message); else toast.success('Room deleted');
    queryClient.invalidateQueries({ queryKey: ['rooms'] });
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    const { error } = await supabase.from('rooms').update({ availability: !current }).eq('id', id);
    if (error) toast.error(error.message);
    queryClient.invalidateQueries({ queryKey: ['rooms'] });
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) toast.error(error.message); else toast.success('Booking updated');
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  };

  const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.totalPrice, 0);
  const occupiedRooms = rooms.filter(r => !r.availability).length;

  const stats = [
    { label: 'Total Bookings', value: String(bookings.length), icon: CalendarCheck, color: 'text-primary' },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-success' },
    { label: 'Total Rooms', value: String(rooms.length), icon: Hotel, color: 'text-accent-foreground' },
    { label: 'Occupied', value: String(occupiedRooms), icon: Users, color: 'text-gold' },
  ];

  if (roomsLoading || bookingsLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Manage rooms, bookings, and monitor performance</p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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

      {/* Room Management */}
      <Card className="mt-8 border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading">Room Management</CardTitle>
          <Dialog open={roomDialog} onOpenChange={(open) => { setRoomDialog(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button variant="hero" size="sm"><Plus className="mr-2 h-4 w-4" /> Add Room</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-heading">{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <Input placeholder="Room Title" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-md border border-border bg-background p-3 text-sm text-foreground min-h-[80px]" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Price per night" type="number" value={price} onChange={e => setPrice(e.target.value)} />
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="suite">Suite</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="Capacity" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} />
                <Input placeholder="Amenities (comma separated)" value={amenities} onChange={e => setAmenities(e.target.value)} />
                <Input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
                <Button variant="hero" className="w-full" onClick={handleSaveRoom} disabled={saving}>
                  {saving ? 'Saving...' : editingRoom ? 'Update Room' : 'Add Room'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map(room => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.title}</TableCell>
                  <TableCell className="capitalize">{room.type}</TableCell>
                  <TableCell>${room.price}/night</TableCell>
                  <TableCell>
                    <Badge
                      variant={room.availability ? 'default' : 'destructive'}
                      className="cursor-pointer"
                      onClick={() => handleToggleAvailability(room.id, room.availability)}
                    >
                      {room.availability ? 'Available' : 'Booked'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(room)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteRoom(room.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Management */}
      <Card className="mt-8 border-border">
        <CardHeader>
          <CardTitle className="font-heading">All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No bookings yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map(b => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.roomTitle}</TableCell>
                    <TableCell>{b.checkInDate}</TableCell>
                    <TableCell>{b.checkOutDate}</TableCell>
                    <TableCell>${b.totalPrice}</TableCell>
                    <TableCell>
                      <Badge variant={b.status === 'confirmed' ? 'default' : b.status === 'cancelled' ? 'destructive' : 'secondary'}>
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select onValueChange={(v) => handleUpdateBookingStatus(b.id, v)}>
                        <SelectTrigger className="w-[130px]"><SelectValue placeholder="Update" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirm</SelectItem>
                          <SelectItem value="cancelled">Cancel</SelectItem>
                          <SelectItem value="completed">Complete</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function UserDashboard() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useBookings();

  if (isLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <>
      <h1 className="font-heading text-3xl font-bold text-foreground">My Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>

      <Card className="mt-8 border-border">
        <CardHeader>
          <CardTitle className="font-heading">Your Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">You haven't made any bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-4">
                  <div>
                    <p className="font-semibold text-foreground">{b.roomTitle}</p>
                    <p className="text-sm text-muted-foreground">{b.checkInDate} → {b.checkOutDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">${b.totalPrice}</span>
                    <Badge variant={b.status === 'confirmed' ? 'default' : b.status === 'cancelled' ? 'destructive' : 'secondary'}>
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        {isAdmin ? <AdminDashboard /> : <UserDashboard />}
      </div>
      <Footer />
    </div>
  );
}
