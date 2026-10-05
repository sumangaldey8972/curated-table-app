import { supabase } from './supabaseClient';
import { Post } from '../types';

export interface FeedRealtimeHandlers {
  onNewPost: (post: Post) => void;
  onUpdatePost?: (post: Post) => void;
  onDeletePost?: (payload: { id?: string; deletedPostId?: string }) => void;
}

/**
 * Subscribe to Supabase Realtime Broadcast events for the 'feed' channel.
 * Returns an unsubscribe teardown function.
 */
export function subscribeToFeedRealtime(handlers: FeedRealtimeHandlers): () => void {
  const channel = supabase.channel('feed', {
    config: { broadcast: { self: false, ack: false } },
  });

  channel
    .on('broadcast', { event: 'new_post' }, ({ payload }) => {
      console.log('[Supabase Realtime] Received "new_post" broadcast:', payload?.id || payload?._id);
      if (payload && (payload.id || payload._id)) {
        const post: Post = {
          ...payload,
          id: String(payload.id || payload._id),
          tag: payload.tag || 'General',
        };
        handlers.onNewPost(post);
      }
    })
    .on('broadcast', { event: 'update_post' }, ({ payload }) => {
      console.log('[Supabase Realtime] Received "update_post" broadcast:', payload?.id || payload?._id);
      if (payload && (payload.id || payload._id) && handlers.onUpdatePost) {
        const post: Post = {
          ...payload,
          id: String(payload.id || payload._id),
          tag: payload.tag || 'General',
        };
        handlers.onUpdatePost(post);
      }
    })
    .on('broadcast', { event: 'delete_post' }, ({ payload }) => {
      console.log('[Supabase Realtime] Received "delete_post" broadcast:', payload);
      if (payload && handlers.onDeletePost) {
        handlers.onDeletePost(payload);
      }
    })
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log('[Supabase Realtime] Connected to feed channel.');
      } else {
        console.log(`[Supabase Realtime] Channel status: ${status}`, err || '');
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}

