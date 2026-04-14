import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Booking } from '@/types/hotel';

export function useBookings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map((b: any) => ({
        id: b.id,
        userId: b.user_id,
        roomId: b.room_id,
        roomTitle: b.room_title,
        checkInDate: b.check_in_date,
        checkOutDate: b.check_out_date,
        totalPrice: Number(b.total_price),
        status: b.status,
        createdAt: b.created_at,
      }));
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: {
      userId: string;
      roomId: string;
      roomTitle: string;
      checkInDate: string;
      checkOutDate: string;
      totalPrice: number;
    }) => {
      const { error } = await supabase.from('bookings').insert({
        user_id: booking.userId,
        room_id: booking.roomId,
        room_title: booking.roomTitle,
        check_in_date: booking.checkInDate,
        check_out_date: booking.checkOutDate,
        total_price: booking.totalPrice,
        status: 'confirmed',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
