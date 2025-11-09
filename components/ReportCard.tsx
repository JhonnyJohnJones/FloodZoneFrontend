// não usado


import { Report } from "../context/reportContext";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ReportCardProps {
  report: Report;
  onPress?: () => void;
  onMenuPress?: () => void;
}

const getCardColors = (incident: Report["incidentType"]) => {
  switch (incident) {
    case "Alagamento":
      return ["#1E3A8A", "#3B82F6"];
    case "Enchente":
      return ["#DC2626", "#EF4444"];
    default:
      return ["#6B7280", "#9CA3AF"];
  }
};

export default function ReportCard({ report, onPress, onMenuPress }: ReportCardProps) {
  const colors = getCardColors(report.incidentType);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialIcons name="report" size={24} color="#fff" />
            <Text style={styles.code}>#{report.id}</Text>
          </View>

          {onMenuPress && (
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
              <MaterialIcons name="more-vert" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.type}>{report.incidentType}</Text>
          <Text style={styles.address} numberOfLines={2}>
            {report.locationText}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <MaterialIcons name="calendar-today" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.date}>{formatDate(report.createdAt)}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: { padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  code: { fontSize: 16, fontWeight: "700", color: "#fff" },
  menuButton: { padding: 4 },
  content: { marginBottom: 12 },
  type: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 4 },
  address: { fontSize: 14, color: "rgba(255,255,255,0.9)", lineHeight: 20 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  date: { fontSize: 12, color: "rgba(255,255,255,0.8)" },
});
