import React from 'react';
import { Image, ImageStyle, StyleProp, View } from 'react-native';

type BrandMarkProps = {
  size?: number;
  style?: StyleProp<ImageStyle>;
  showBackground?: boolean;
  fill?: boolean;
};

export function BrandMark({
  size = 64,
  style,
  showBackground = false,
  fill = false,
}: BrandMarkProps) {
  const containerStyle = fill
    ? { width: '100%' as const, height: '100%' as const }
    : { width: size, height: size };

  const imageStyle = fill
    ? { width: '100%' as const, height: '100%' as const }
    : { width: size, height: size };

  const icon = (
    <View style={[containerStyle, { alignItems: 'center', justifyContent: 'center' }]}>
      <Image
        source={require('../../assets/icon.png')}
        style={[
          imageStyle,
          style,
        ]}
        resizeMode="contain"
      />
    </View>
  );

  if (!showBackground) {
    return icon;
  }

  return (
    <View
      style={{
        ...containerStyle,
        borderRadius: Math.round(size * 0.25),
        overflow: 'hidden',
      }}
    >
      {icon}
    </View>
  );
}