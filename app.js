const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public')); // Serve arquivos estáticos (CSS, etc.)
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
      // Se o registro for bem-sucedido, redireciona para a página de sucesso
      return res.redirect('/success');
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
  res.render('success'); // Renderiza a página de sucesso
});

// Rota para o redirecionamento
app.get('/redirect', (req, res) => {
  const redirectURL = 'https://game-mara.vercel.app/'; // URL para onde deseja redirecionar
  res.redirect(redirectURL); // Redireciona para o link específico
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
