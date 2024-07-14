let eventos = [];

function formatarMes(numero) {
  return numero < 10 ? `0${numero}` : numero;
}

function renderizarEventos() {
  const listaDeEventos = document.querySelector(".toDo-list tbody");
  listaDeEventos.replaceChildren();
  eventos.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
  eventos.forEach((evento, índice) => {
    const linha = document.createElement("tr");
    const cellNome = document.createElement("td");
    cellNome.textContent = evento.nome;

    const dataHora = new Date(evento.dataHora);
    const dia = formatarMes(dataHora.getDate());
    const mes = formatarMes(dataHora.getMonth() + 1);
    const ano = dataHora.getFullYear();
    const horas = formatarMes(dataHora.getHours());
    const minutos = formatarMes(dataHora.getMinutes());
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const horaFormatada = `${horas}:${minutos}h`;

    const cellData = document.createElement("td");
    cellData.textContent = dataFormatada;
    const cellHora = document.createElement("td");
    cellHora.textContent = horaFormatada;

    const cellFeito = document.createElement("td");
    const botaoFeito = document.createElement("button");
    botaoFeito.classList.add("doneButton");
    botaoFeito.textContent = '✔';
    if (evento.concluido) {
      botaoFeito.style.backgroundColor = '#64feda';
    }
    botaoFeito.addEventListener("click", () => {
      evento.concluido = !evento.concluido;
      salvarEventosNoLocalStorage();
      renderizarEventos();
    });
    cellFeito.appendChild(botaoFeito);

    const cellRemover = document.createElement("td");
    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "X";
    botaoRemover.classList.add("deleteButton");
    botaoRemover.addEventListener("click", () => {
      eventos.splice(índice, 1);
      salvarEventosNoLocalStorage();
      renderizarEventos();
    });
    cellRemover.appendChild(botaoRemover);

    linha.appendChild(cellNome);
    linha.appendChild(cellData);
    linha.appendChild(cellHora);
    linha.appendChild(cellFeito);
    linha.appendChild(cellRemover);
    listaDeEventos.appendChild(linha);
  });
}

function salvarEventosNoLocalStorage() {
  localStorage.setItem("eventos", JSON.stringify(eventos));
}

function carregarEventosDoLocalStorage() {
  const eventosString = localStorage.getItem("eventos");
  if (eventosString) {
    eventos = JSON.parse(eventosString);
    renderizarEventos();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarEventosDoLocalStorage();
});

document.querySelector(".add-button").addEventListener("click", () => {
  const elementoDeInputNome = document.querySelector(".name-input");
  const nome = elementoDeInputNome.value.trim();
  if (nome !== '') {
    const elementoDeInputDataHora = document.querySelector(".data-hora-input");
    const dataHora = elementoDeInputDataHora.value;
    if (dataHora !== '') {
      const evento = {
        nome,
        dataHora,
        concluido: false
      };
      eventos.push(evento);
      salvarEventosNoLocalStorage();
      renderizarEventos();
      elementoDeInputNome.value = '';
      elementoDeInputDataHora.value = '';
    }
  }
});