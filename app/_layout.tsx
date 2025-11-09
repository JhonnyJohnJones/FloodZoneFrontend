import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/authContext';
import { ReportsProvider } from '../context/reportContext';
import { HeatmapProvider } from '@/context/HeatmapContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ReportsProvider>
          <HeatmapProvider>
            <Stack
              screenOptions={{
                headerShown: false, 
                contentStyle: { backgroundColor: '#fff' },
              }}
              >
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </HeatmapProvider>
        </ReportsProvider>
       </AuthProvider>
    </SafeAreaProvider>
  );
}
