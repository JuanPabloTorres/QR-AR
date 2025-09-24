const https = require('https');
const fs = require('fs');
const path = require('path');
const next = require('next');
const selfsigned = require('selfsigned');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3443;

// Crear certificados autofirmados
console.log('🔐 Generando certificados SSL autofirmados...');

const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { 
  keySize: 2048,
  days: 365,
  algorithm: 'sha256',
  extensions: [{
    name: 'basicConstraints',
    cA: true,
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true,
  }, {
    name: 'subjectAltName',
    altNames: [{
      type: 2, // DNS
      value: 'localhost',
    }, {
      type: 2,
      value: '*.localhost',
    }, {
      type: 7, // IP
      ip: '127.0.0.1',
    }, {
      type: 7,
      ip: '192.168.0.7',
    }],
  }],
});

const httpsOptions = {
  key: pems.private,
  cert: pems.cert,
};

async function startServer() {
  try {
    console.log('🚀 Iniciando servidor Next.js con HTTPS...');
    
    const app = next({ dev, hostname, port });
    await app.prepare();
    
    const server = https.createServer(httpsOptions, app.getRequestHandler());
    
    server.listen(port, hostname, () => {
      console.log('✅ Servidor HTTPS iniciado exitosamente!');
      console.log(`📱 Local:   https://localhost:${port}`);
      console.log(`🌐 Network: https://192.168.0.7:${port}`);
      console.log('');
      console.log('🔒 NOTA: Tendrás que aceptar el certificado autofirmado en el navegador.');
      console.log('📱 En móvil: Ve a "Configuración Avanzada" -> "Continuar hacia el sitio"');
      console.log('');
      console.log('🎯 Para probar AR en móvil:');
      console.log(`   https://192.168.0.7:${port}/ar/test-message`);
    });
    
    server.on('error', (err) => {
      console.error('❌ Error del servidor HTTPS:', err);
    });
    
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();