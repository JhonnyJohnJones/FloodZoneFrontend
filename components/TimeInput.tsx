// não usado


import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

interface TimeInputProps {
  value: string;
  onTimeChange: (time: string) => void;
  placeholder?: string;
}

export function TimeInput({ value, onTimeChange, placeholder = "00:00" }: TimeInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedDate) {
      setDate(selectedDate);
      const timeString = formatTime(selectedDate);
      onTimeChange(timeString);
    }
  };

  const showTimePicker = () => {
    setShowPicker(true);
  };

  return (
    <View>
      <TouchableOpacity style={styles.timeButton} onPress={showTimePicker}>
        <MaterialIcons name="access-time" size={20} color="#666" />
        <Text style={[styles.timeText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  placeholderText: {
    color: '#999',
  },
});