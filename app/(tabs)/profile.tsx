import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import EditProfileModal from '../../components/EditProfileModal';
import ProfileHeader from '../../components/ProfileHeader';
import ReportsSection from '../../components/ReportsSection';
import UserInfoCard from '../../components/UserInfoCard';
import { useAuth } from '../../context/authContext';

export default function ProfileScreen() {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
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

  const handleSaveUserInfo = (updatedInfo: typeof userInfo) => {
    setUserInfo(updatedInfo);
    // TODO: Implement API call to update user info if needed
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <UserInfoCard userInfo={userInfo} onEditPress={() => setIsEditModalVisible(true)} />
        <ReportsSection />
      </ScrollView>
      <EditProfileModal visible={isEditModalVisible} onClose={() => setIsEditModalVisible(false)} userInfo={userInfo} onSave={handleSaveUserInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { flex: 1 },
  contentContainer: { paddingBottom: 20 },
});
