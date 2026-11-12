import React, { useRef, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Web (Vercel) product video — plain HTML <video>, koi extra package nahi.
export default function ProductVideo({ uri, width, height, radius = 20 }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.pause();
    else v.play().catch(() => {});
    setPlaying(!playing);
  };
  const toggleMute = () => {
    const v = ref.current;
    if (v) v.muted = !muted;
    setMuted(!muted);
  };

  return (
    <View style={[styles.box, { width, height, borderRadius: radius }]}>
      {React.createElement('video', {
        ref,
        src: uri,
        autoPlay: true,
        muted: true,
        loop: true,
        playsInline: true,
        style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
      })}
      <View style={styles.controls} pointerEvents="box-none">
        <Pressable style={styles.btn} onPress={togglePlay} accessibilityLabel={playing ? 'Pause video' : 'Play video'}>
          <Ionicons name={playing ? 'pause' : 'play'} size={16} color="#fff" />
        </Pressable>
        <Pressable style={styles.btn} onPress={toggleMute} accessibilityLabel={muted ? 'Unmute' : 'Mute'}>
          <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#111', overflow: 'hidden', alignSelf: 'center' },
  controls: { position: 'absolute', left: 12, bottom: 12, flexDirection: 'row', gap: 8 },
  btn: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
});
