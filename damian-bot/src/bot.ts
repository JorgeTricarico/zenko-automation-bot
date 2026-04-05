import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');

// 1. Declaración de Herramientas (Functions) para la IA
const checkAppointmentStatusDeclaration = {
    name: "check_appointment_status",
    description: "Busca en la base de datos el estado de la cita de un cliente buscando por su nombre o teléfono para confirmar fecha, hora y servicio.",
    parameters: {
      type: "OBJECT",
      properties: {
        clientQuery: {
          type: "STRING",
          description: "Nombre o teléfono del cliente para buscar su turno."
        }
      },
      required: ["clientQuery"]
    }
};

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    tools: [{
        functionDeclarations: [checkAppointmentStatusDeclaration]
    }]
});

async function handleFunctionCall(callConfig: any) {
    if (callConfig.name === "check_appointment_status") {
        const query = callConfig.args.clientQuery as string;
        console.log(`[💆-TOOL] Ejecutando búsqueda en BD de citas para: "${query}"`);
        
        // Buscar en Prisma Appointments
        const appointment = await prisma.appointment.findFirst({
            where: {
                OR: [
                    { clientName: { contains: query } },
                    { clientPhone: { contains: query } }
                ]
            }
        });

        if (appointment) {
            return {
                encontrado: true,
                servicio: appointment.service,
                estado: appointment.status,
                fecha: appointment.date,
                hora: appointment.time,
                notas: appointment.notes
            };
        } else {
            return { encontrado: false, mensaje: "No se encontraron citas programadas para ese nombre o teléfono." };
        }
    }
    return null;
}

async function connectToWhatsApp() {
    // Usar una carpeta separada para las credenciales de Damian
    const { state, saveCreds } = await useMultiFileAuthState('damian_auth_info');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }) as any
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if(shouldReconnect) connectToWhatsApp();
        } else if(connection === 'open') {
            console.log('🧘 Damian AI Bot conectado y gestionando la agenda!');
        }
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if(!msg.message || msg.key.fromMe) return;

        const remoteJid = msg.key.remoteJid;
        if(!remoteJid) return;

        const textMessage = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        if (!textMessage) return;

        console.log(`[💆] ${msg.pushName} (${remoteJid}): ${textMessage}`);

        try {
            await sock.readMessages([msg.key]);
            await sock.sendPresenceUpdate('composing', remoteJid);
            
            // Establecer un Chat para manejar memoria a corto plazo
            const chat = model.startChat();
            
            // System prompt + envio de mensaje
            let result = await chat.sendMessage(`
                Eres Damián, experto masajista profesional. Tienes un consultorio de masajes bienestar. 
                Eres calmado, educado y servicial.
                Ayuda a los clientes con sus dudas sobre masajes (Descontracturante, Relajante, Deportivo, Drenaje Linfático).
                Si te preguntan por su turno o cita, usa la función check_appointment_status enviando su nombre o su teléfono (${remoteJid}).
                
                Mensaje del usuario: ${textMessage}
            `);

            const functionCall = result.response.functionCalls()?.[0];
            
            if (functionCall) {
                // La IA decidió consultar la Base de Datos
                const apiResponse = await handleFunctionCall(functionCall);
                
                // Enviar el resultado de la DB a la IA para que redacte la respuesta final
                result = await chat.sendMessage([{
                    functionResponse: {
                        name: functionCall.name,
                        response: apiResponse
                    }
                }]);
            }

            const finalResponse = result.response.text();
            
            await sock.sendPresenceUpdate('paused', remoteJid);
            await sock.sendMessage(remoteJid, { text: finalResponse });
            
        } catch (error) {
            console.error("Error AI Damian:", error);
            await sock.sendMessage(remoteJid, { text: "Hola, soy Damián. En este momento estoy en una sesión, te respondo apenas termine. 🙏" });
        }
    });
}

connectToWhatsApp();
