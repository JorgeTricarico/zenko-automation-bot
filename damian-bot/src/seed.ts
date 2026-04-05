import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando sembrado (seed) de la Base de Datos para Damian...");

  await prisma.appointment.createMany({
    data: [
      { 
        id: 'APT-001', 
        clientName: 'Roberto Gómez', 
        clientPhone: '11-4444-5555', 
        service: 'Masaje Descontracturante', 
        duration: 60, 
        date: '2026-04-10', 
        time: '15:00', 
        status: 'confirmado', 
        price: 8000, 
        notes: 'Dolor lumbar crónico.' 
      },
      { 
        id: 'APT-002', 
        clientName: 'Elena Torres', 
        clientPhone: '11-2222-3333', 
        service: 'Masaje Deportivo', 
        duration: 90, 
        date: '2026-04-12', 
        time: '10:30', 
        status: 'pendiente', 
        price: 12000, 
        notes: 'Recuperación post-maratón.' 
      },
      { 
        id: 'APT-003', 
        clientName: 'Carla Ruiz', 
        clientPhone: '11-7777-8888', 
        service: 'Drenaje Linfático', 
        duration: 60, 
        date: '2026-04-05', 
        time: '18:00', 
        status: 'completado', 
        price: 9500 
      },
    ]
  });

  await prisma.financialEntry.createMany({
    data: [
      { id: 'FIN-D1', date: '2026-04-01', type: 'income', category: 'Masajes', amount: 8000, description: 'Sesión Roberto G.' },
      { id: 'FIN-D2', date: '2026-04-02', type: 'expense', category: 'Insumos', amount: 4500, description: 'Aceites esenciales de Lavanda' }
    ]
  });

  console.log("¡Sembrado de Damian completado!");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
