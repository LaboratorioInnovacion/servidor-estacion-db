// server.js
const express = require('express');
const mqtt = require('mqtt');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------
// CONFIGURACIÓN DEL BROKER MQTT PARA DATOS
// ---------------------------
const MQTT_DATA_HOST = "5b89b77699514c54af8285b7c1b73dd1.s1.eu.hivemq.cloud";  // Reemplaza con el host de tu broker de datos
const MQTT_DATA_PORT = 8883;                       // Reemplaza con el puerto adecuado
const MQTT_DATA_USER = "Augustodelcampo97";              // Reemplaza con el usuario
const MQTT_DATA_PASS = "Augustodelcampo97";             // Reemplaza con la contraseña

const mqttOptions = {
  host: MQTT_DATA_HOST,
  port: MQTT_DATA_PORT,
  protocol: 'mqtts',
  username: MQTT_DATA_USER,
  password: MQTT_DATA_PASS
};

const mqttClient = mqtt.connect(mqttOptions);

// Array para almacenar los mensajes recibidos (puedes usar una DB en producción)
let messages = [];

// ---------------------------
// CONEXIÓN Y SUSCRIPCIÓN AL TÓPICO
// ---------------------------
mqttClient.on('connect', () => {
  console.log("Conectado al broker MQTT de datos meteorológicos");
  mqttClient.subscribe("esp32/data", (err) => {
    if (err) {
      console.error("Error al suscribirse al tópico esp32/data:", err);
    } else {
      console.log("Suscrito al tópico esp32/data");
    }
  });
});

mqttClient.on('message', (topic, message) => {
  const msg = message.toString();
  console.log("Mensaje recibido en", topic, ":", msg);
  // Guardar el mensaje con la fecha de recepción
  messages.push({
    topic,
    message: msg,
    receivedAt: new Date()
  });
});

mqttClient.on('error', (err) => {
  console.error("Error en la conexión MQTT:", err);
});

// ---------------------------
// SERVIDOR EXPRESS
// ---------------------------

// Endpoint para visualizar los mensajes recibidos
app.get('/', (req, res) => {
  res.json(messages);
});

app.listen(PORT, () => {
  console.log(`Servidor Node corriendo en http://localhost:${PORT}`);
});
