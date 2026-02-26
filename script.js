const btnPedido = document.getElementById("btnPedido");
const listaCarrinho = document.getElementById("listaCarrinho");
const totalElemento = document.getElementById("total");
const finalizarBtn = document.getElementById("finalizar");
const limparCarrinhoBtn = document.getElementById("limparCarrinho");
const estadoVazio = document.getElementById("estadoVazio");
const cartBadgeDesktop = document.getElementById("cartBadgeDesktop");
const cartBadgeMobile = document.getElementById("cartBadgeMobile");
const toastMensagem = document.getElementById("toastMensagem");
const toastElement = document.getElementById("addToast");

const addToast = toastElement ? new bootstrap.Toast(toastElement, { delay: 1800 }) : null;

// Load cart from localStorage or initialize empty
let carrinhoItens = JSON.parse(localStorage.getItem("carrinhoItens")) || [];

// Function to save cart to localStorage
function salvarCarrinho() {
  localStorage.setItem("carrinhoItens", JSON.stringify(carrinhoItens));
}

function formatarMoeda(valor) {
  return valor.toFixed(2).replace(".", ",");
}

function atualizarBadges() {
  const quantidade = carrinhoItens.length;
  cartBadgeDesktop.textContent = quantidade;
  cartBadgeMobile.textContent = quantidade;
}

function atualizarEstadoVazio() {
  estadoVazio.style.display = carrinhoItens.length === 0 ? "block" : "none";
}

function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let total = 0;

  carrinhoItens.forEach((item, index) => {
    total += item.preco;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <div class="carrinho-item-info">
        <span class="carrinho-item-nome">${item.nome}</span>
        <span class="carrinho-item-preco">R$ ${formatarMoeda(item.preco)}</span>
      </div>
      <button class="btn btn-sm btn-outline-light btn-remover" data-index="${index}" aria-label="Remover ${item.nome}">
        <i class="bi bi-x-lg"></i>
      </button>
    `;

    listaCarrinho.appendChild(li);
  });

  totalElemento.textContent = formatarMoeda(total);
  atualizarEstadoVazio();
  atualizarBadges();
  salvarCarrinho();
}

function mostrarToast(mensagem) {
  if (!addToast) return;
  toastMensagem.textContent = mensagem;
  addToast.show();
}

btnPedido.addEventListener("click", () => {
  document.getElementById("cardapio").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".addBtn").forEach((botao) => {
  botao.addEventListener("click", () => {
    const nome = botao.dataset.nome;
    const preco = parseFloat(botao.dataset.preco);

    carrinhoItens.push({ nome, preco });
    atualizarCarrinho();
    mostrarToast(`${nome} adicionado ao carrinho.`);
  });
});

listaCarrinho.addEventListener("click", (event) => {
  const botaoRemover = event.target.closest(".btn-remover");
  if (!botaoRemover) return;

  const index = Number(botaoRemover.dataset.index);
  const itemRemovido = carrinhoItens[index];

  carrinhoItens.splice(index, 1);
  atualizarCarrinho();
  if (itemRemovido) {
    mostrarToast(`${itemRemovido.nome} removido do carrinho.`);
  }
});

limparCarrinhoBtn.addEventListener("click", () => {
  if (carrinhoItens.length === 0) {
    mostrarToast("Seu carrinho já está vazio.");
    return;
  }

  carrinhoItens = [];
  atualizarCarrinho();
  mostrarToast("Carrinho limpo com sucesso.");
});

finalizarBtn.addEventListener("click", () => {
  if (carrinhoItens.length === 0) {
    mostrarToast("Seu carrinho está vazio.");
    return;
  }

  // Redirect to payment page
  window.location.href = "index2.html";
});

// Function to get cart items (for payment page)
function getCarrinhoItens() {
  return carrinhoItens;
}

// Function to get cart total (for payment page)
function getCarrinhoTotal() {
  return carrinhoItens.reduce((acc, item) => acc + item.preco, 0);
}

document.querySelectorAll(".click-animate").forEach((elemento) => {
  elemento.addEventListener("click", () => {
    elemento.classList.add("clicked");
    setTimeout(() => elemento.classList.remove("clicked"), 170);
  });
});

atualizarCarrinho();
