// não usado


import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabType = 'home' | 'search' | 'add' | 'profile';

interface Tab {
  id: TabType;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface TabBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

const tabs: Tab[] = [
  { id: 'home', label: 'Início', icon: 'home' },
  { id: 'search', label: 'Busca', icon: 'search' },
  { id: 'add', label: 'Central', icon: 'add' },
  { id: 'profile', label: 'Perfil', icon: 'person' },
];

export default function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const insets = useSafeAreaInsets();

  const renderTab = (tab: Tab) => {
    const isActive = activeTab === tab.id;
    const isCenter = tab.id === 'add';

    if (isCenter) {
      return (
        <TouchableOpacity
          key={tab.id}
          style={styles.centerTab}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.8}
        >
          <View style={styles.centerTabButton}>
            <MaterialIcons 
              name={tab.icon} 
              size={28} 
              color="white" 
            />
          </View>
          <Text style={[styles.tabLabel, styles.centerTabLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tab}
        onPress={() => onTabPress(tab.id)}
        activeOpacity={0.7}
      >
        <MaterialIcons 
          name={tab.icon} 
          size={24} 
          color={isActive ? '#3BF679FF' : '#9CA3AF'} 
        />
        <Text style={[
          styles.tabLabel,
          { color: isActive ? '#3B82F6' : '#9CA3AF' }
        ]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      { 
        paddingBottom: Platform.select({
          ios: insets.bottom + 8,
          android: insets.bottom + 8,
          default: 8
        })
      }
    ]}>
      {tabs.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  centerTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  centerTabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  centerTabLabel: {
    color: '#3B82F6',
    marginTop: 8,
  },
});