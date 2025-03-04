// This file is a fallback for using Heroicons on Android and web.
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, Platform, StyleProp, ViewStyle } from 'react-native';
import {
  ChevronRightIcon,
  CodeBracketIcon,
  HomeIcon,
  PaperAirplaneIcon,
} from 'react-native-heroicons/solid';

import {
  BeakerIcon,
  ChartBarIcon,
  QueueListIcon,
  UserCircleIcon
} from 'react-native-heroicons/outline';

// Add your SFSymbol to Heroicons mappings here.
const MAPPING = {
  // See SF Symbols in the SF Symbols app on Mac.
  'house.fill': HomeIcon,
  'paperplane.fill': PaperAirplaneIcon,
  'chevron.left.forwardslash.chevron.right': CodeBracketIcon,
  'chevron.right': ChevronRightIcon,
  'list.bullet': QueueListIcon,
  'chart.bar': ChartBarIcon,
  'person.crop.circle': UserCircleIcon,
  'testtube.2': BeakerIcon,
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentType<{ color?: string; size?: number; style?: StyleProp<ViewStyle> }>
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and Heroicons on Android and web. 
 * This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to Heroicons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Use SFSymbols on iOS if available
  if (Platform.OS === 'ios') {
    // Import and use SFSymbols component here if needed
    return null; // Replace with actual SFSymbols implementation
  }

  const Icon = MAPPING[name];
  if (!Icon) {
    console.warn(`No icon mapping found for "${name}"`);
    return null;
  }

  return <Icon color={color as string} size={size} style={style} />;
}