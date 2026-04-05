// Bot Mock para la Demo de Zenco
// Este archivo sirve como base y prueba de concepto para la futura 
// integración con Baileys (WhatsApp) y la Inteligencia Artificial.

console.log("🦊 Zenco AI Agent - Iniciando motores...");

export class NotificationAgent {
    
    constructor(private aiModel: string) {
        console.log(`[SYS] Agente configurado con modelo: ${aiModel}`);
    }

    async handleIncomingMessage(phone: string, text: string) {
        console.log(`[WA] Mensaje recibido de ${phone}: "${text}"`);
        
        // Simulación de búsqueda en base de datos de Zenco
        if (text.toLowerCase().includes('pedido') || text.toLowerCase().includes('arreglo')) {
            const mockDbStatus = this.simularBusquedaDb(phone);
            
            const responsePrompt = await this.generarRespuestaAI(mockDbStatus);
            this.sendReply(phone, responsePrompt);
        } else {
            this.sendReply(phone, "¡Hola! Soy el asistente de Zenco. 🦊 ¿En qué te puedo ayudar hoy con tus prendas?");
        }
    }

    private simularBusquedaDb(phone: string) {
        // En sprint futuro, esto consultará el backend real (ej. PostgreSQL o la misma API del Dashboard)
        return {
            cliente: "María G.",
            prenda: "Campera de Cuero",
            estado: "en_proceso",
            entrega: "Mañana"
        };
    }

    private async generarRespuestaAI(context: any) {
        // Simular latencia de AI (OpenAI o Claude)
        return new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve(`¡Hola ${context.cliente}! He revisado la base de datos de nuestro taller. Tu ${context.prenda} está actualmente *en proceso*. No te preocupes, mantendremos la fecha de entrega para ${context.entrega}. ¿Deseas que Ana te envíe una foto del avance?`);
            }, 800);
        });
    }

    private sendReply(phone: string, msg: string) {
        console.log(`[WA-SEND] a ${phone}: ${msg}`);
    }
}

// Inicialización
const bot = new NotificationAgent("gpt-4o-mini");

// Ejemplo de Flujo:
setTimeout(() => {
    bot.handleIncomingMessage("11-4567-8901", "Hola, quería saber cómo va mi pedido del arreglo de cuero.");
}, 1500);
