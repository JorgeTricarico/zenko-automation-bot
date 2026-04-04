import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando sembrado (seed) de la Base de Datos SQLite...");

  await prisma.order.createMany({
    data: [
      { id: 'ORD-001', clientName: 'María G.', clientPhone: '11-4567-8901', garmentName: 'Campera de Cuero', repairType: 'cierre', description: 'Cambiar cierre frontal completo, metálico YKK.', status: 'en_proceso', deliveryDate: '2026-04-05', price: 15000 },
      { id: 'ORD-002', clientName: 'Juan P.', clientPhone: '11-1234-5678', garmentName: 'Pantalón de Vestir', repairType: 'dobladillo', description: 'Hacer dobladillo, achicar 2cm de largo.', status: 'recibido', deliveryDate: '2026-04-06', price: 5000 },
      { id: 'ORD-003', clientName: 'Sofía L.', clientPhone: '11-9876-5432', garmentName: 'Vestido de Fiesta', repairType: 'diseño', description: 'Ajustar la cintura y modificar el escote.', status: 'listo', deliveryDate: '2026-04-04', price: 35000 },
    ]
  });

  await prisma.financialEntry.createMany({
    data: [
      { id: 'FIN-1', date: '2026-04-01', type: 'income', category: 'Arreglos', amount: 4500, description: 'Camisa Carlos M.' },
      { id: 'FIN-2', date: '2026-04-02', type: 'expense', category: 'Insumos', amount: 15000, description: 'Compra de Hilos y Cierres YKK' }
    ]
  });

  console.log("¡Sembrado completado!");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
