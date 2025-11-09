import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ProfileHeader from '../../components/ProfileHeader';
import UserInfoCard from '../../components/UserInfoCard';
import { useAuth } from '../../context/authContext';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({ email: '', nome: '' });

  useEffect(() => {
    if (user) {
      setUserInfo({
        email: user.email || '',
        nome: user.nome || '',
      });
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <UserInfoCard userInfo={userInfo} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { flex: 1 },
  contentContainer: { paddingBottom: 20 },
});
