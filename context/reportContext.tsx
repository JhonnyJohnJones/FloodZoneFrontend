import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { reportService } from "../service/reportService";
import { IReport } from "../types/reports";

interface ReportContextType {
  reports: IReport[];
  loading: boolean;
  error: string | null;
  addReport: (
    report: Omit<IReport, "idr" | "idusuario" | "data"> & { horario?: string }
  ) => Promise<void>;
}

const ReportsContext = createContext<ReportContextType>({} as ReportContextType);

export const useReports = () => useContext(ReportsContext);

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Criar um novo reporte
  const addReport = useCallback(
    async (
      report: Omit<IReport, "idr" | "idusuario" | "data"> & { horario?: string }
    ) => {
      setLoading(true);
      setError(null);
      try {
        const newReport = await reportService.create(report);
        setReports((prev) => [newReport, ...prev]);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Erro ao criar reporte");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <ReportsContext.Provider
      value={{
        reports,
        loading,
        error,
        addReport
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};
