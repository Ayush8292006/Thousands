import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';

// Native (Android / iOS) product video — expo-video.
// Web ke liye ProductVideo.web.js (HTML <video>) use hota hai.
export default function ProductVideo({ uri, width, height, radius = 20 }) {
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const togglePlay = () => {
    if (playing) player.pause();
    else player.play();
    setPlaying(!playing);
  };
  const toggleMute = () => {
    player.muted = !muted;
    setMuted(!muted);
  };

  return (
    <View style={[styles.box, { width, height, borderRadius: radius }]}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      <Controls playing={playing} muted={muted} onPlay={togglePlay} onMute={toggleMute} />
    </View>
  );
}

export function Controls({ playing, muted, onPlay, onMute }) {
  return (
    <View style={styles.controls} pointerEvents="box-none">
      <Pressable style={styles.btn} onPress={onPlay} accessibilityLabel={playing ? 'Pause video' : 'Play video'}>
        <Ionicons name={playing ? 'pause' : 'play'} size={16} color="#fff" />
      </Pressable>
      <Pressable style={styles.btn} onPress={onMute} accessibilityLabel={muted ? 'Unmute' : 'Mute'}>
        <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={16} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#111', overflow: 'hidden', alignSelf: 'center' },
  controls: { position: 'absolute', left: 12, bottom: 12, flexDirection: 'row', gap: 8 },
  btn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
});
