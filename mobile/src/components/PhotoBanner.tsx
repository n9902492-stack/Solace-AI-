import { useEffect, useRef } from "react";
import { AccessibilityInfo, Animated, Image, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

const photos = {
  plant: { uri: "https://images.unsplash.com/photo-1572242596859-ddcf5aa0594a?auto=format&fit=crop&w=900&q=80" },
  forest: { uri: "https://images.unsplash.com/photo-1630081642167-b5052cd83314?auto=format&fit=crop&w=900&q=80" },
};

export default function PhotoBanner({ scene }: { scene: keyof typeof photos }) {
  const reveal = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let active = true;
    let animation: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (!active || reduced) return;
      reveal.setValue(0);
      animation = Animated.timing(reveal, { toValue: 1, duration: 320, useNativeDriver: true });
      animation.start();
    }).catch(() => {});
    return () => {
      active = false;
      animation?.stop();
    };
  }, [reveal]);

  return (
    <Animated.View style={[
      styles.frame,
      { opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] },
    ]}>
      <Image source={photos[scene]} style={styles.image} resizeMode="cover" accessible={false} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: { width: "100%", aspectRatio: 2.35, borderRadius: 22, overflow: "hidden", backgroundColor: colors.softIvory },
  image: { width: "100%", height: "100%" },
});
