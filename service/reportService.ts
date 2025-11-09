import api from '../api/api';
import { IReport } from '../types/reports';

const DIRECTORY = '/reportes'

const ENDPOINTS = {
  report: DIRECTORY+'/reportar',       
  heatmap: DIRECTORY+'/heatmap', 
};

export const reportService = {
  async create(report: Omit<IReport, 'idr'|'idusuario'|'data'> & { horario?: string }): Promise<IReport> {
    const res = await api.post(ENDPOINTS.report, report);
    return res.data;
  },

  async getHeatmap(latitude: number, longitude: number) {
    const res = await api.get(ENDPOINTS.heatmap, { params: { latitude, longitude }});
    return res.data.points;
  },
};
