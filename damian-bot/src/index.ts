import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- ROUTES PARA CITAS (APPOINTMENTS) ---

// Obtener todas las citas
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: { date: 'asc' }
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener citas' });
  }
});

// Crear una nueva cita
app.post('/api/appointments', async (req, res) => {
  try {
    const data = req.body;
    const newAppointment = await prisma.appointment.create({
      data: {
        id: `APT-${Math.floor(Math.random() * 10000)}`,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        service: data.service,
        duration: data.duration,
        date: data.date,
        time: data.time,
        status: data.status || 'pendiente',
        price: data.price,
        notes: data.notes
      }
    });
    res.json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cita' });
  }
});

// Actualizar estado de cita
app.put('/api/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar status de cita' });
  }
});

// --- ROUTES PARA FINANZAS ---
app.get('/api/finances', async (req, res) => {
  try {
    const finances = await prisma.financialEntry.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(finances);
  } catch (error) {
    res.status(500).json({ error: 'Error de finanzas' });
  }
});

app.listen(PORT, () => {
  console.log(`🧘 Damian's Backend API corriendo en http://localhost:${PORT}`);
  console.log(`Para integrar el Bot con Whatsapp, ejecuta también bot.ts`);
});
