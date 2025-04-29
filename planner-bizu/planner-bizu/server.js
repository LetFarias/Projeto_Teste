const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

let eventos = [];
let contas = [];

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rota para adicionar eventos
app.post("/eventos", (req, res) => {
    const evento = req.body;
    eventos.push(evento);
    res.status(201).json(evento);
});

// Rota para listar os eventos
app.get("/eventos", (req, res) => {
    res.json(eventos);
});

// Rota para deletar um evento
app.delete("/eventos/:index", (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < eventos.length) {
        eventos.splice(index, 1);
        res.status(200).json({ message: "Evento deletado com sucesso" });
    } else {
        res.status(404).json({ message: "Evento não encontrado" });
    }
});

// Rota principal que serve o HTML
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Rotas para contas
app.post("/contas", (req, res) => {
    const conta = req.body;
    contas.push(conta);
    res.status(201).json(conta);
});

app.get("/contas", (req, res) => {
    const contasOrdenadas = [...contas].sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento));
    res.json(contasOrdenadas);
});

app.delete("/contas/:index", (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < contas.length) {
        contas.splice(index, 1);
        res.status(200).json({ message: "Conta deletada com sucesso" });
    } else {
        res.status(404).json({ message: "Conta não encontrada" });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando em http://0.0.0.0:${port}`);
});