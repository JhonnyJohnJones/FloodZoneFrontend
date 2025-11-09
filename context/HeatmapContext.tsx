import React, { createContext, useContext, useState, useCallback } from "react";
import { reportService } from "../service/reportService";

export interface HeatmapPoint {
  latitude: number;
  longitude: number;
  weight?: number;
}

interface HeatmapContextType {
  heatmapData: HeatmapPoint[];
  loading: boolean;
  error: string | null;
  fetchData: (latitude?: number, longitude?: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const HeatmapContext = createContext<HeatmapContextType | undefined>(undefined);

export const HeatmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (latitude?: number, longitude?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getHeatmap(latitude ?? 0, longitude ?? 0);
      const validatedData = (Array.isArray(data) ? data : [])
        .filter(
          (p) =>
            p &&
            typeof p.latitude === "number" &&
            typeof p.longitude === "number" &&
            !isNaN(p.latitude) &&
            !isNaN(p.longitude)
        )
        .map((p) => ({
          latitude: Number(p.latitude),
          longitude: Number(p.longitude),
          weight: p.weight ? Number(p.weight) : 1,
        }));
      setHeatmapData(validatedData);
    } catch {
      setError("Erro ao carregar dados do mapa de calor.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(() => fetchData(), [fetchData]);

  return (
    <HeatmapContext.Provider value={{ heatmapData, loading, error, fetchData, refreshData }}>
      {children}
    </HeatmapContext.Provider>
  );
};

export const useHeatmap = () => {
  const context = useContext(HeatmapContext);
  if (!context) throw new Error("useHeatmap deve ser usado dentro do HeatmapProvider");
  return context;
};
