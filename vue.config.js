const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // ... outras configurações do servidor ...

    // Adiciona uma regra para servir arquivos da pasta 'assets'
    static: {
      directory: path.join(__dirname, 'public'), // Diretório raiz para arquivos estáticos
      serveIndex: true, 
      watch: true,      // Assiste por mudanças nos arquivos (opcional)
    },
  },
  // Configuração para copiar arquivos da pasta 'assets' para 'dist' durante o build
  // Configuração para servir arquivos da pasta 'assets'
  chainWebpack: config => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src')); // Define o alias '@' para a pasta 'src' (se você estiver usando)

    // Adiciona a pasta 'assets' à lista de diretórios estáticos
    config.devServer.set('static', [
      path.join(__dirname, 'public'),
      path.join(__dirname, 'assets'),
    ]);
  },

})
