-- Run this SQL in Supabase Dashboard → SQL Editor

CREATE OR REPLACE VIEW vw_monthly_financial_summary AS
SELECT
  user_id,
  date_trunc('month', created_at)::date as mes,
  SUM(CASE WHEN tipo = 'Ingreso' THEN monto ELSE 0 END) as ventas_totales,
  SUM(CASE WHEN tipo = 'Egreso' THEN monto ELSE 0 END) as egresos_totales,
  COUNT(*) as num_transacciones
FROM cont_transacciones
GROUP BY user_id, date_trunc('month', created_at);