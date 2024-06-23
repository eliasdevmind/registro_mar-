const path = require('path');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Rota inicial para exibir o formulário
app.get('/', (req, res) => {
  res.render('form');
});

// Rota para processar o registro
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const response = await axios.post(process.env.URL_API, {
      email,
      username,
      password
    });

    console.log('API Response:', response.data);

    let message = response.data.msg || 'Resposta inesperada da API';

    if (message === 'Usuário registrado com sucesso') {
      // Se o registro for bem-sucedido, redireciona para a página de sucesso após 5 segundos
      setTimeout(() => {
        res.redirect('/success');
      }, 5000);
    } else {
      res.render('form', { message });
    }
  } catch (error) {
    console.error('Error Response:', error.response ? error.response.data : error.message);

    const message = error.response && error.response.data && (error.response.data.msg || error.response.data.detail || error.response.data.message)
      ? error.response.data.msg || error.response.data.detail || error.response.data.message
      : 'Erro na requisição';
    res.render('form', { message });
  }
});

// Rota para a página de sucesso
app.get('/success', (req, res) => {
  res.render('success');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
