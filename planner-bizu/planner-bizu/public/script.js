
// Carregar eventos e contas quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarCompromissos();
    carregarContas();
});

// Função para mostrar abas
function mostrarAba(aba) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(aba).classList.add('active');
    document.querySelector(`button[onclick="mostrarAba('${aba}')"]`).classList.add('active');
}

// Funções para compromissos
function carregarCompromissos() {
    fetch("/eventos")
        .then(response => response.json())
        .then(eventos => {
            const listaEventos = document.getElementById("listaEventos");
            listaEventos.innerHTML = '';
            eventos.forEach((evento, index) => {
                const li = document.createElement("li");
                const data = new Date(evento.dataHora);
                li.innerHTML = `
                    ${evento.titulo} - ${data.toLocaleString('pt-BR')}
                    <button onclick="deletarEvento(${index})" class="delete-btn">Deletar</button>
                `;
                listaEventos.appendChild(li);
            });
        })
        .catch(error => console.error('Erro ao carregar eventos:', error));
}

function deletarEvento(index) {
    fetch(`/eventos/${index}`, { method: "DELETE" })
        .then(() => carregarCompromissos())
        .catch(error => console.error('Erro ao deletar evento:', error));
}

// Funções para contas
function carregarContas() {
    fetch("/contas")
        .then(response => response.json())
        .then(contas => {
            const listaContas = document.getElementById("listaContas");
            listaContas.innerHTML = '';
            let total = 0;

            contas.forEach((conta, index) => {
                total += parseFloat(conta.valor);
                const li = document.createElement("li");
                const data = new Date(conta.vencimento);
                li.innerHTML = `
                    ${conta.nome} - R$ ${parseFloat(conta.valor).toFixed(2)} - Vencimento: ${data.toLocaleDateString('pt-BR')}
                    <button onclick="deletarConta(${index})" class="delete-btn">Deletar</button>
                `;
                listaContas.appendChild(li);
            });

            document.getElementById("gastoMensal").textContent = `Total previsto: R$ ${total.toFixed(2)}`;
        })
        .catch(error => console.error('Erro ao carregar contas:', error));
}

function deletarConta(index) {
    fetch(`/contas/${index}`, { method: "DELETE" })
        .then(() => carregarContas())
        .catch(error => console.error('Erro ao deletar conta:', error));
}

// Configurar formulários
document.getElementById("eventoForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const titulo = document.getElementById("titulo").value;
    const dataHora = document.getElementById("dataHora").value;

    fetch("/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, dataHora })
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById("eventoForm").reset();
        carregarCompromissos();
    })
    .catch(error => console.error('Erro ao salvar evento:', error));
});

document.getElementById("contaForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = document.getElementById("nomeConta").value;
    const valor = document.getElementById("valorConta").value;
    const vencimento = document.getElementById("vencimentoConta").value;
    const categoria = document.getElementById("categoriaConta").value;

    fetch("/contas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, valor, vencimento, categoria })
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById("contaForm").reset();
        carregarContas();
    })
    .catch(error => console.error('Erro ao salvar conta:', error));
});
