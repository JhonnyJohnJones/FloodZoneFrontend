import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useReports } from "../context/reportContext";

export default function ReportsSection() {
  const { reports } = useReports();

  if (reports.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Meus reports:</Text>
        <Text style={{ color: "#999" }}>Nenhum report criado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Meus reports:</Text>

      <View style={styles.reportsGrid}>
        {reports.slice(0, 5).map((report) => {
          const color = report.incidentType === "Enchente" ? "#B02727FF" : "#3B82F6";

          return (
            <View key={report.id} style={styles.reportCard}>
              <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <MaterialIcons name="water" size={24} color="#fff" />
              </View>

              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>{report.incidentType}</Text>
                <Text style={styles.reportSubtitle}>{report.locationText}</Text>
                <Text style={styles.reportDescription}>{report.description}</Text>
              </View>

              <View style={[styles.statusDot, { backgroundColor: color }]} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  reportsGrid: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  reportSubtitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 11,
    color: "#999",
    lineHeight: 14,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
