import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  FlatList,
} from "react-native";
import MapView, { Marker, Heatmap, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import axios from "axios";
import { useHeatmap, HeatmapPoint } from "@/context/HeatmapContext";
import { AZURE_MAPS_KEY } from "@env";

// Chave do Azure Maps, recomendado: variáveis de ambiente/proxy backend em produção!
// const AZURE_MAPS_KEY = "";

// Interface para resultado de busca Azure Maps
interface SearchResult {
  position: {
    lat: number;
    lon: number;
  };
  address: {
    freeformAddress: string;
  };
  poi?: {
    name: string;
  };
}

export default function MapScreen() {
  const mapRef = useRef<MapView | null>(null);

  const [region, setRegion] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Contexto do heatmap
  const { heatmapData, loading: loadingHeatmap, error: heatmapError, fetchData: fetchHeatmap } = useHeatmap();

  // Inicialização: localização e heatmap
  useEffect(() => {
    (async () => {
      const pos = await initializeMap();
      if (pos) {
        await fetchHeatmap(pos.latitude, pos.longitude);
      }
    })();
  }, []);

  // ---- Funções de inicialização ----
  const initializeMap = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Não foi possível acessar localização.");
        const fallback = { latitude: -23.5438, longitude: -46.5610 };
        setRegion({ ...fallback, latitudeDelta: 0.05, longitudeDelta: 0.05 });
        return fallback;
      }

      const pos = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      setRegion({ ...coords, latitudeDelta: 0.02, longitudeDelta: 0.02 });
      return coords; 
    } catch {
      const fallback = { latitude: -23.5438, longitude: -46.5610 };
      setRegion({ ...fallback, latitudeDelta: 0.05, longitudeDelta: 0.05 });
      return fallback;
    }
  };

  // ---- Autocomplete Azure Maps ----
  useEffect(() => {
    if (searchQuery.length < 3) {
      setShowResults(false);
      setSearchResults([]);
      return;
    }
    const fetchAutocomplete = async () => {
      setAutocompleteLoading(true);
      try {
        const url = `https://atlas.microsoft.com/search/address/json?api-version=1.0&subscription-key=${AZURE_MAPS_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&typeahead=true&limit=5`;
        const res = await axios.get(url);
        setSearchResults(res.data.results);
        setShowResults(true);
      } catch (err) {
        setSearchResults([]);
        setShowResults(false);
      } finally {
        setAutocompleteLoading(false);
      }
    };
    const timeout = setTimeout(fetchAutocomplete, 400); // debounce
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // ---- Busca ao pressionar "Buscar" ou Enter ----
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const url = `https://atlas.microsoft.com/search/fuzzy/json?api-version=1.0&subscription-key=${AZURE_MAPS_KEY}&query=${encodeURIComponent(
        searchQuery.trim()
      )}&limit=1`;
      const result = await axios.get(url);
      if (!result.data.results || !result.data.results.length) {
        Alert.alert("Nenhum resultado", "Nenhum local encontrado.");
        return;
      }
      const pos = result.data.results[0].position;
      animateToLocation(pos.lat, pos.lon);
      setShowResults(false);
    } catch (err) {
      Alert.alert("Erro", "Falha ao buscar local.");
    } finally {
      setSearching(false);
    }
  };

  // ---- Selecionar resultado do autocomplete ----
  const selectSearchResult = (result: SearchResult) => {
    animateToLocation(result.position.lat, result.position.lon);
    setShowResults(false);
    setSearchQuery(result.address.freeformAddress);
  };

  // ---- Anima para a localização especificada ----
  const animateToLocation = (lat: number, lon: number) => {
    const newRegion = {
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(newRegion);
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 500);
    }
    fetchHeatmap(lat, lon);
  };

  // ---- UI ----
  if (!region) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 8 }}>Carregando localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerSubtitle}>Flood Zone</Text>
        </View>
      </View>

      {/* Busca e Autocomplete */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={22} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o endereço ou lugar"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            onSubmitEditing={searchLocation}
          />
          {autocompleteLoading && (
            <ActivityIndicator size="small" color="#3B82F6" style={{ marginLeft: 8 }} />
          )}
          {searchQuery ? (
            <TouchableOpacity onPress={() => { setSearchQuery(""); setShowResults(false); }}>
              <MaterialIcons name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.searchButton, searching && { opacity: 0.6 }]}
          onPress={searchLocation}
          disabled={searching}
        >
          <MaterialIcons name="search" size={18} color="#fff" />
          <Text style={styles.searchButtonText}>{searching ? "Buscando..." : "Buscar"}</Text>
        </TouchableOpacity>
        {/* Lista de resultados (autocomplete) */}
        {showResults && searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <FlatList
              data={searchResults}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultItem}
                  onPress={() => selectSearchResult(item)}
                >
                  <MaterialIcons name="place" size={20} color="#3B82F6" />
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultName}>
                      {item.poi?.name || "Local"}
                    </Text>
                    <Text style={styles.resultAddress}>
                      {item.address.freeformAddress}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.resultsList}
            />
          </View>
        )}
        
        {/* Erro Heatmap */}
        {heatmapError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{heatmapError}</Text>
            <TouchableOpacity onPress={() => fetchHeatmap(region?.latitude, region?.longitude)}>
              <Text style={styles.errorReload}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Mapa */}
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
        >
          {/* Heatmap azul */}
          {heatmapData.length > 0 && (
            <Heatmap
              points={heatmapData}
              radius={40}
              opacity={0.7}
              gradient={{
                colors: [
                  "rgba(0, 0, 255, 0)",
                  "rgba(65, 105, 225, 0.5)",
                  "rgba(30, 144, 255, 0.7)",
                  "rgba(0, 191, 255, 0.9)",
                  "rgba(0, 0, 255, 1)",
                ],
                startPoints: [0, 0.25, 0.5, 0.75, 1.0],
                colorMapSize: 256,
              }}
            />
          )}
          {/* Marker da posição atual */}
          <Marker
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            title="Sua Localização"
          />
        </MapView>
      )}
      {/* Overlay de carregamento heatmap */}
      {loadingHeatmap && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text style={styles.loadingText}>Carregando mapa de calor...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ... os mesmos estilos da resposta anterior ...
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, backgroundColor: "white", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  headerTextContainer: { alignItems: "center" },
  headerTitle: { fontSize: 14, fontWeight: "400", color: "#6B7280", letterSpacing: 1 },
  headerSubtitle: { fontSize: 22, fontWeight: "700", color: "#3B82F6", letterSpacing: 1 },
  searchContainer: { padding: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#F3F4F6", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 16, marginLeft: 8, color: "#1F2937" },
  searchButton: { backgroundColor: "#3B82F6", borderRadius: 12, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 },
  searchButtonText: { color: "#fff", fontSize: 15, fontWeight: "600", marginLeft: 8 },
  resultsContainer: { marginTop: 10, backgroundColor: "#fff", borderRadius: 12, maxHeight: 180, borderWidth: 1, borderColor: "#E5E7EB" },
  resultsList: { maxHeight: 180 },
  resultItem: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  resultTextContainer: { flex: 1, marginLeft: 12 },
  resultName: { fontSize: 14, fontWeight: "600", color: "#1F2937" },
  resultAddress: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  errorContainer: { marginTop: 8, alignItems: "center" },
  errorText: { color: "#DC2626", fontSize: 14 },
  errorReload: { color: "#3B82F6", marginTop: 4, textDecorationLine: "underline", fontSize: 13 },
  loadingOverlay: { position: "absolute", bottom: 20, alignSelf: "center", backgroundColor: "white", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  loadingText: { fontSize: 14, color: "#6B7280" },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" }
});
