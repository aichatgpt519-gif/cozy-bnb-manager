import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Room } from '@/types/hotel';

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async (): Promise<Room[]> => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data || []).map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        price: Number(r.price),
        type: r.type,
        capacity: r.capacity,
        amenities: r.amenities || [],
        images: r.images || [],
        availability: r.availability,
        rating: Number(r.rating),
      }));
    },
  });
}
