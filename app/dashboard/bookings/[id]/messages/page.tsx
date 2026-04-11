import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import MessagesClient from '@/components/MessagesClient';

export default async function BookingMessagesPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/sign-in');

  const supabase = createClient();

  // Fetch booking
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, traveler_id, companion_id, service_offerings(title)')
    .eq('id', params.id)
    .single();

  if (!booking) {
    notFound();
  }

  // Check authorization
  const isTraveler = booking.traveler_id === user.id;
  const isCompanion = booking.companion_id?.toString() === user.id;

  if (!isTraveler && !isCompanion) {
    redirect('/');
  }

  // Fetch or create message thread
  let { data: thread } = await supabase
    .from('message_threads')
    .select('id')
    .eq('booking_id', booking.id)
    .single();

  if (!thread) {
    // Create thread
    const { data: newThread } = await supabase
      .from('message_threads')
      .insert({
        booking_id: booking.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    thread = newThread;
  }

  // Fetch messages
  const { data: messages = [] } = await supabase
    .from('messages')
    .select('*, users(full_name, avatar_url)')
    .eq('thread_id', thread.id)
    .order('created_at', { ascending: true });

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/dashboard/bookings/${booking.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Messages</h1>
          <p className="text-muted-foreground">{booking.service_offerings?.title}</p>
        </div>
      </div>

      {/* Messages */}
      <Card className="mb-6 flex h-96 flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg: any) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.author_id === user.id ? 'flex-row-reverse' : ''}`}
              >
                <img
                  src={msg.users?.avatar_url || 'https://via.placeholder.com/32'}
                  alt={msg.users?.full_name}
                  className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                />
                <div
                  className={`rounded-lg p-3 max-w-xs ${
                    msg.author_id === user.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    msg.author_id === user.id
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  }`}>
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <MessagesClient threadId={thread.id} />
        </div>
      </Card>
    </main>
  );
}
