import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface UserInfo {
  email: string;
  nome: string;
}

interface UserInfoCardProps {
  userInfo: UserInfo;
  onEditPress: () => void;
}

export default function UserInfoCard({ userInfo, onEditPress }: UserInfoCardProps) {
  return (
    <View style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={40} color="#fff" />
          </View>
          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="camera-alt" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{userInfo.nome}</Text>
      </View>

      {/* Email Section */}
      <View style={styles.infoSection}>
        <View style={styles.fieldRow}>
          <View style={styles.fieldInfo}>
            <Text style={styles.fieldLabel}>Email:</Text>
            <Text style={styles.fieldValue}>{userInfo.email}</Text>
          </View>

          <TouchableOpacity style={styles.changeButton} onPress={onEditPress}>
            <Text style={styles.changeButtonText}>ALTERAR DADOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Name Section */}
      <View style={styles.infoSection}>
        <Text style={styles.fieldLabel}>Nome:</Text>
        <Text style={styles.fieldValue}>{userInfo.nome}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#9e9e9e",
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ff5722",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  infoSection: {
    marginBottom: 20,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  fieldInfo: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
  },
  changeButton: {
    backgroundColor: "#1D8B42FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
