class Lista {

    constructor() {
        this.itens = JSON.parse(localStorage.getItem('itens')) || [];
        this.codigoDeBarras = this.itens.length > 0 ? Math.max(...this.itens.map(item => item.codigoDeBarras)) + 1 : 1;
    }
    adicionarItem(item) {
        item.codigoDeBarras = this.codigoDeBarras++;
        this.itens.push(item);
        this.salvarItensNoLocalStorage();
    }
    removerItem(item) {
        const index = this.itens.findIndex(i => i.codigoDeBarras === item.codigoDeBarras);
        if (index !== -1) {
            this.itens.splice(index, 1);
            this.salvarItensNoLocalStorage();
        }
    }
    salvarItensNoLocalStorage() {
        localStorage.setItem('itens', JSON.stringify(this.itens));
    }
    renderizarLista() {
        const listaContainer = document.getElementById('lista');
        listaContainer.innerHTML = '';
        this.itens.forEach((item, index) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
              <td>${item.nomeOuCodigo}</td>
              <td>${item.preco.toFixed(2)}</td>
              <td>${item.quantidade}</td>
              <td>${(item.preco * item.quantidade).toFixed(2)}</td>
              <td><button class="done-Button" data-id="${item.codigoDeBarras}" style="background-color: ${localStorage.getItem(`doneButton${index}`) === 'true' ? '#c6ff00' : ''}">✔</button></td>
              <td><button data-id="${item.codigoDeBarras}" class="remover-button">X</button></td>
            `;
            listaContainer.appendChild(linha);
        });

        document.querySelectorAll(".done-Button").forEach((doneButton, index) => {
            doneButton.addEventListener("click", (event) => {
                const currentColor = window.getComputedStyle(event.target).backgroundColor;
                const activeColor = 'rgb(198, 255, 0)';
                if (currentColor === activeColor) {
                    event.target.style.backgroundColor = "";
                    localStorage.removeItem(`doneButton${index}`);
                } else {
                    event.target.style.backgroundColor = "#c6ff00";
                    localStorage.setItem(`doneButton${index}`, 'true');
                }
            });
        });

        const removerButtons = document.querySelectorAll('.remover-button');
        removerButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = parseInt(button.getAttribute('data-id'));
                const item = this.itens.find(item => item.codigoDeBarras === id);
                if (item) {
                    this.removerItem(item);
                    this.renderizarLista();
                }
            });
        });
    }
}
const form = document.getElementById('form');
const nomeOuCodigoInput = document.getElementById('nomeOuCodigo');
const precoInput = document.getElementById('preco');
const quantidadeInput = document.getElementById('quantidade');
const lista = new Lista();
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nomeOuCodigo = nomeOuCodigoInput.value.trim();
    const preco = parseFloat(precoInput.value);
    const quantidade = parseInt(quantidadeInput.value);
    if (nomeOuCodigo !== '' && !isNaN(preco) && !isNaN(quantidade)) {
        const item = {
            nomeOuCodigo,
            preco,
            quantidade,
            comprado: false
        };
        lista.adicionarItem(item);
        lista.renderizarLista();
        nomeOuCodigoInput.value = '';
        precoInput.value = '';
        quantidadeInput.value = '';
    }
});
lista.renderizarLista();