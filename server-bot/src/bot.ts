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
const checkGarmentStatusDeclaration = {
    name: "check_garment_status",
    description: "Busca en la base de datos el estado de la prenda de un cliente buscando por coincidencia aproximada de su nombre o teléfono.",
    parameters: {
      type: "OBJECT",
      properties: {
        clientQuery: {
          type: "STRING",
          description: "Nombre o teléfono extraído del cliente para buscar su orden."
        }
      },
      required: ["clientQuery"]
    }
};

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    tools: [{
        functionDeclarations: [checkGarmentStatusDeclaration]
    }]
});

async function handleFunctionCall(callConfig: any) {
    if (callConfig.name === "check_garment_status") {
        const query = callConfig.args.clientQuery as string;
        console.log(`[IA-TOOL] Ejecutando búsqueda en BD para: "${query}"`);
        
        // Buscar en Prisma
        const order = await prisma.order.findFirst({
            where: {
                OR: [
                    { clientName: { contains: query } },
                    { clientPhone: { contains: query } }
                ]
            }
        });

        if (order) {
            return {
                encontrado: true,
                prenda: order.garmentName,
                estado: order.status,
                fechaEntrega: order.deliveryDate,
                arreglo: order.repairType
            };
        } else {
            return { encontrado: false, mensaje: "No se encontraron órdenes para ese cliente." };
        }
    }
    return null;
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
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
            console.log('🦊 Zenco AI Bot conectado y leyendo la BD!');
        }
    });

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if(!msg.message || msg.key.fromMe) return;

        const remoteJid = msg.key.remoteJid;
        if(!remoteJid) return;

        const textMessage = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";
        if (!textMessage) return;

        console.log(`[📞] ${msg.pushName} (${remoteJid}): ${textMessage}`);

        try {
            await sock.readMessages([msg.key]);
            await sock.sendPresenceUpdate('composing', remoteJid);
            
            // Establecer un Chat para manejar memoria a corto plazo
            const chat = model.startChat();
            
            // System prompt + envio de mensaje
            let result = await chat.sendMessage(`
                Eres Ana, dueña de Zenco (arreglos de ropa e indumentaria). Eres amable y profesional.
                Si te preguntan por un arreglo, extrae su nombre del mensaje o usa su teléfono (${remoteJid}) 
                para usar la función check_garment_status y responderles en base a esos datos reales.
                
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
            console.error("Error AI:", error);
            await sock.sendMessage(remoteJid, { text: "Ups, estoy organizando el taller. 🦊 En un ratito te respondo." });
        }
    });
}

connectToWhatsApp();
