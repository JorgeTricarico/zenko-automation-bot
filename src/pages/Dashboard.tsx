import React, { useEffect, useState } from 'react';
import { fetchGarments, fetchFinances, DBGarment, DBFinance } from '../services/api';

export default function Dashboard() {
  const [garments, setGarments] = useState<DBGarment[]>([]);
  const [finances, setFinances] = useState<DBFinance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchGarments(), fetchFinances()])
      .then(([gData, fData]) => {
        setGarments(gData);
        setFinances(fData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar data del dashboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando dashboard...</div>;

  const pendingGarments = garments.filter(g => g.status !== 'entregado');
  const urgentGarments = pendingGarments.filter(g => new Date(g.deliveryDate) <= new Date('2026-04-06')).sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());
  
  const totalIncome = finances.filter(f => f.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = finances.filter(f => f.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpenses;

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    return new Date(dateStr).toLocaleDateString('es-AR', options);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'recibido': return <span className="badge pending">Recibido</span>;
      case 'en_proceso': return <span className="badge urgent">En Proceso</span>;
      case 'listo': return <span className="badge completed">Listo</span>;
      default: return <span className="badge">Entregado</span>;
    }
  };

  return (
    <div>
      <div className="flex-between">
        <div>
          <h1>Hola, Ana 👋</h1>
          <p className="subtitle">Aquí tienes el resumen de tu taller al día de hoy.</p>
        </div>
        <button className="btn btn-primary">+ Nueva Orden</button>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '40px' }}>
        <div className="card">
          <div className="stat-title">Prendas Pendientes</div>
          <div className="stat-value">{pendingGarments.length}</div>
          <div className="stat-trend positive">↑ 2 desde ayer</div>
        </div>
        <div className="card">
          <div className="stat-title">Balance Mensual</div>
          <div className="stat-value">${balance.toLocaleString()}</div>
          <div className="stat-trend">Ingresos: ${totalIncome.toLocaleString()}</div>
        </div>
        <div className="card">
          <div className="stat-title">Próximos a Vencer</div>
          <div className="stat-value" style={{ color: 'var(--urgent-color)'}}>{urgentGarments.length}</div>
          <div className="stat-trend">Atención requerida</div>
        </div>
      </div>

      <h2>Prioritarios: Próximas Entregas</h2>
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Prenda</th>
                <th>Arreglo</th>
                <th>Estado</th>
                <th>Entrega</th>
              </tr>
            </thead>
            <tbody>
              {urgentGarments.map(g => (
                <tr key={g.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{g.clientName}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{g.clientPhone}</div>
                  </td>
                  <td>{g.garmentName}</td>
                  <td style={{ textTransform: 'capitalize' }}>{g.repairType}</td>
                  <td>{getStatusBadge(g.status)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--urgent-color)' }}>{formatDate(g.deliveryDate)}</td>
                </tr>
              ))}
              {urgentGarments.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No hay entregas urgentes próximas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
