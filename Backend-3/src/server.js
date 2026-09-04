const express = require('express');

require('dotenv').config();

const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'API de apoio a mulheres em situação de vulnerabilidade'
  });
});



app.get('/informacoes_direitos', async (req, res) => {
  try {
    const [informacoes] = await db.query(
      'SELECT * FROM informacoes_direitos ORDER BY id DESC'
    );

    res.json(informacoes);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao listar informações sobre direitos'
    });
  }
});


app.get('/informacoes_direitos/busca/:nome', async (req, res) => {
  try {
    const { nome } = req.params;

    const [informacoes] = await db.query(
      'SELECT * FROM informacoes_direitos WHERE nome LIKE ?',
      [`%${nome}%`]
    );

    if (informacoes.length === 0) {
      return res.status(404).json({
        message: 'Nenhuma informação sobre direitos encontrada'
      });
    }

    res.json(informacoes);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar informações sobre direitos'
    });
  }
});


app.get('/informacoes_direitos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [informacoes] = await db.query(
      'SELECT * FROM informacoes_direitos WHERE id = ?',
      [id]
    );

    if (informacoes.length === 0) {
      return res.status(404).json({
        message: 'Informação sobre direitos não encontrada'
      });
    }

    res.json(informacoes[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar informação sobre direitos'
    });
  }
});


app.post('/informacoes_direitos', async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;

    if (!nome || preco === undefined || preco === null || preco === '') {
      return res.status(400).json({
        message: 'Nome e valor são obrigatórios'
      });
    }

    if (Number(preco) < 0) {
      return res.status(400).json({
        message: 'O valor não pode ser negativo'
      });
    }

    const [resultado] = await db.query(
      'INSERT INTO informacoes_direitos (nome, preco, descricao) VALUES (?, ?, ?)',
      [nome, preco, descricao || null]
    );

    res.status(201).json({
      id: resultado.insertId,
      nome,
      preco,
      descricao: descricao || null
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao criar informação sobre direitos'
    });
  }
});


app.put('/informacoes_direitos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;

    if (!nome || preco === undefined || preco === null || preco === '') {
      return res.status(400).json({
        message: 'Nome e valor são obrigatórios'
      });
    }

    if (Number(preco) < 0) {
      return res.status(400).json({
        message: 'O valor não pode ser negativo'
      });
    }

    const [resultado] = await db.query(
      `UPDATE informacoes_direitos
       SET nome = ?, preco = ?, descricao = ?
       WHERE id = ?`,
      [nome, preco, descricao || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: 'Informação sobre direitos não encontrada'
      });
    }

    res.json({
      id,
      nome,
      preco,
      descricao: descricao || null
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao atualizar informação sobre direitos'
    });
  }
});


app.delete('/informacoes_direitos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await db.query(
      'DELETE FROM informacoes_direitos WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: 'Informação sobre direitos não encontrada'
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao remover informação sobre direitos'
    });
  }
});


 

app.get('/tecnologia_apoio', async (req, res) => {
  try {
    const [tecnologias] = await db.query(
      'SELECT * FROM tecnologia_apoio ORDER BY id'
    );

    res.json(tecnologias);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao listar tecnologias de apoio'
    });
  }
});


app.get('/tecnologia_apoio/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [tecnologias] = await db.query(
      'SELECT * FROM tecnologia_apoio WHERE id = ?',
      [id]
    );

    if (tecnologias.length === 0) {
      return res.status(404).json({
        message: 'Tecnologia de apoio não encontrada'
      });
    }

    res.json(tecnologias[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar tecnologia de apoio'
    });
  }
});


app.post('/tecnologia_apoio', async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        message: 'Nome é obrigatório'
      });
    }

    const valor = preco === undefined || preco === null || preco === ''
      ? 0
      : preco;

    if (Number(valor) < 0) {
      return res.status(400).json({
        message: 'O valor não pode ser negativo'
      });
    }

    const [resultado] = await db.query(
      'INSERT INTO tecnologia_apoio (nome, preco, descricao) VALUES (?, ?, ?)',
      [nome, valor, descricao || null]
    );

    res.status(201).json({
      id: resultado.insertId,
      nome,
      preco: valor,
      descricao: descricao || null
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao criar tecnologia de apoio'
    });
  }
});


app.put('/tecnologia_apoio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({
        message: 'Nome é obrigatório'
      });
    }

    const valor = preco === undefined || preco === null || preco === ''
      ? 0
      : preco;

    if (Number(valor) < 0) {
      return res.status(400).json({
        message: 'O valor não pode ser negativo'
      });
    }

    const [resultado] = await db.query(
      `UPDATE tecnologia_apoio
       SET nome = ?, preco = ?, descricao = ?
       WHERE id = ?`,
      [nome, valor, descricao || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: 'Tecnologia de apoio não encontrada'
      });
    }

    res.json({
      id,
      nome,
      preco: valor,
      descricao: descricao || null
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao atualizar tecnologia de apoio'
    });
  }
});


app.delete('/tecnologia_apoio/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await db.query(
      'DELETE FROM tecnologia_apoio WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: 'Tecnologia de apoio não encontrada'
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao remover tecnologia de apoio'
    });
  }
});



app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
