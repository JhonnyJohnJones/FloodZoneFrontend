// não usado



import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BottomNavigation() {
  const insets = useSafeAreaInsets();

  const tabs = [
    { icon: 'home', type: 'MaterialIcons' },
    { icon: 'search', type: 'MaterialIcons' },
    { icon: 'add-circle', type: 'MaterialIcons', isActive: true },
    { icon: 'history', type: 'MaterialIcons' },
    { icon: 'person', type: 'MaterialIcons' },
  ];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {tabs.map((tab, index) => (
        <TouchableOpacity key={index} style={styles.tab}>
          {tab.type === 'MaterialIcons' ? (
            <MaterialIcons 
              name={tab.icon as any} 
              size={24} 
              color={tab.isActive ? '#2196f3' : '#999'} 
            />
          ) : (
            <Ionicons 
              name={tab.icon as any} 
              size={24} 
              color={tab.isActive ? '#2196f3' : '#999'} 
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});