import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- ROUTES PARA PRENDAS (ORDENES) ---

// Obtener todas las prendas
app.get('/api/garments', async (req, res) => {
  try {
    const garments = await prisma.order.findMany({
      orderBy: { deliveryDate: 'asc' }
    });
    res.json(garments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener prendas' });
  }
});

// Crear una nueva prenda (orden)
app.post('/api/garments', async (req, res) => {
  try {
    const data = req.body;
    const newGarment = await prisma.order.create({
      data: {
        id: `ORD-${Math.floor(Math.random() * 10000)}`, // Provisional ID generator
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        garmentName: data.garmentName,
        repairType: data.repairType,
        description: data.description,
        status: data.status || 'recibido',
        deliveryDate: data.deliveryDate,
        price: data.price
      }
    });
    res.json(newGarment);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear orden' });
  }
});

// Actualizar estado de prenda
app.put('/api/garments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// --- OTRAS RUTAS (Finanzas, etc) ---
app.get('/api/finances', async (req, res) => {
  try {
    const finances = await prisma.financialEntry.findMany();
    res.json(finances);
  } catch (error) {
    res.status(500).json({ error: 'Error de finanzas' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Zenco Backend API corriendo en http://localhost:${PORT}`);
  console.log(`Para integrar el Bot con Whatsapp, ejecuta también bot.ts`);
});
