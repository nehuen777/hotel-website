import { DashboardService } from './dashboard.services.js';

export class DashboardController {
  static async getMétricas(req, res) {
    try {
      // 1. Extraemos las fechas que el frontend manda por la URL (?startDate=...&endDate=...)
      const { startDate, endDate } = req.query;

      // 2. Se las pasamos al servicio para que filtre la base de datos
      const metricas = await DashboardService.getMetricKpis(startDate, endDate);
      
      res.json(metricas);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}