
import React, { useEffect, useState, useRef } from 'react';
interface PodcastWithRef extends Podcast {
  audioRef: React.RefObject<HTMLAudioElement>;
}
import { Card } from '@/components';
import { supabase } from '@/lib/supabase';

interface Podcast {
  id: string;
  title: string;
  description: string;
  speaker: string;
  audio_url: string;
  cover_image: string;
  published_at: string;
  duration?: string;
}

export default function Podcasts() {
  const [podcasts, setPodcasts] = useState<PodcastWithRef[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('published_at', { ascending: false });
      if (!error && data) {
        setPodcasts(
          data.map((pod: Podcast) => ({ ...pod, audioRef: React.createRef<HTMLAudioElement>() }))
        );
      } else {
        setPodcasts([]);
      }
      setLoading(false);
    };
    fetchPodcasts();
  }, []);

  // Pause all other audios when one is played
  // Pause all other audios when one is played
  useEffect(() => {
    podcasts.forEach(pod => {
      if (pod.id !== playingId && pod.audioRef.current) {
        pod.audioRef.current.pause();
        pod.audioRef.current.currentTime = 0;
      }
    });
  }, [playingId, podcasts]);

  const handlePlayPause = (podcast: PodcastWithRef) => {
    if (!podcast.audioRef.current) return;
    if (playingId === podcast.id) {
      podcast.audioRef.current.pause();
      setPlayingId(null);
    } else {
      // Pause all other audios first
      podcasts.forEach(pod => {
        if (pod.id !== podcast.id && pod.audioRef.current) {
          pod.audioRef.current.pause();
          pod.audioRef.current.currentTime = 0;
        }
      });
      podcast.audioRef.current.play();
      setPlayingId(podcast.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Podcasts</h1>
      {loading ? (
        <Card className="p-6 text-center text-gray-500">Loading podcasts...</Card>
      ) : podcasts.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">No podcast episodes found.</Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {podcasts.map(podcast => (
            <Card key={podcast.id} className="flex flex-col items-center p-4">
              {podcast.cover_image && (
                <img
                  src={podcast.cover_image}
                  alt={podcast.title}
                  className="w-32 h-32 rounded-lg object-cover mb-3 border"
                />
              )}
              <div className="font-semibold text-lg mb-1 text-gray-800 text-center">{podcast.title}</div>
              <div className="text-gray-600 text-sm mb-1 text-center">Speaker: {podcast.speaker}</div>
              {podcast.duration && (
                <div className="text-gray-500 text-xs mb-1">Duration: {podcast.duration}</div>
              )}
              <div className="text-xs text-gray-400 mb-1">Published: {new Date(podcast.published_at).toLocaleDateString()}</div>
              <div className="text-gray-700 text-sm mb-2 text-center line-clamp-3">{podcast.description}</div>
              <div className="w-full flex flex-col items-center mb-2">
                <button
                  className={`mb-2 px-4 py-2 rounded-full font-bold text-white ${playingId === podcast.id ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} transition`}
                  onClick={() => handlePlayPause(podcast)}
                  type="button"
                >
                  {playingId === podcast.id ? 'Pause' : 'Play'}
                </button>
                <audio
                  ref={podcast.audioRef}
                  controls
                  className="w-full rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onPlay={() => setPlayingId(podcast.id)}
                  onPause={() => setPlayingId(id => (id === podcast.id ? null : id))}
                  onEnded={() => setPlayingId(null)}
                >
                  <source src={podcast.audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
