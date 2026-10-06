// ========== DADOS DOS PRODUTOS ==========
// Array contendo a lista de produtos disponíveis na loja.
// Cada produto é um objeto com propriedades: id, name, price, oldPrice, image, category, description, rating.
const products = [
  {
    id: 1,                          // Identificador único do produto (número)
    name: 'Camisa Polo Azul',       // Nome do produto (string)
    price: 89.90,                   // Preço atual (número com duas casas decimais)
    oldPrice: 119.90,               // Preço antigo (para mostrar desconto) – pode ser null
    image: 'assets/img/camisa-polo-azul.jpg', // Caminho da imagem (será substituído por picsum nos demais)
    category: 'masculino',          // Categoria do produto (usada para filtros)
    description: 'Camisa polo em algodão penteado, azul marinho, com gola e punhos em ribana. Perfeita para um visual casual e elegante.', // Descrição detalhada
    rating: 4.5                     // Avaliação (escala de 0 a 5)
  },
  {
    id: 2,
    name: 'Tênis Esportivo Branco',
    price: 149.90,
    oldPrice: 199.90,
    image: 'https://picsum.photos/seed/2/300/200', // Imagem gerada dinamicamente via Lorem Picsum
    category: 'esportes',
    description: 'Tênis leve com amortecimento premium, solado aderente e cabedal em malha respirável. Ideal para corrida e academia.',
    rating: 4.8
  },
  {
    id: 3,
    name: 'Jaqueta Jeans Feminina',
    price: 179.90,
    oldPrice: 229.90,
    image: 'https://picsum.photos/seed/3/300/200',
    category: 'feminino',
    description: 'Jaqueta jeans clássica com ajuste na cintura, bolsos frontais e fechamento em zíper. Combina com qualquer look.',
    rating: 4.2
  },
  {
    id: 4,
    name: 'Relógio Prata Digital',
    price: 99.90,
    oldPrice: null,                 // Sem preço antigo (sem desconto)
    image: 'https://picsum.photos/seed/4/300/200',
    category: 'acessorios',
    description: 'Relógio digital com cronômetro, alarme, luz de fundo e resistência à água. Design moderno e pulseira em silicone.',
    rating: 4.0
  },
  {
    id: 5,
    name: 'Mochila Impermeável',
    price: 129.90,
    oldPrice: 159.90,
    image: 'https://picsum.photos/seed/5/300/200',
    category: 'acessorios',
    description: 'Mochila resistente à água com compartimento para notebook, bolsos internos e alças acolchoadas. Ideal para o dia a dia.',
    rating: 4.7
  },
  {
    id: 6,
    name: 'Calça Social Preta',
    price: 149.90,
    oldPrice: null,
    image: 'https://picsum.photos/seed/6/300/200',
    category: 'masculino',
    description: 'Calça social em tecido plano, preta, com corte slim e vinco central. Perfeita para eventos e trabalho.',
    rating: 4.3
  }
];

// ========== VARIÁVEIS DE ESTADO ==========
// Armazena a categoria atualmente selecionada (inicia com 'all' – todos os produtos)
let currentCategory = 'all';
// Array que representa o carrinho de compras, contendo produtos com quantidade (quantity)
let cart = [];

// ========== ELEMENTOS DOM (com verificação) ==========
// Seleciona os elementos HTML pelo ID e armazena em constantes para uso posterior.
const productsGrid = document.getElementById('productsGrid');          // Container onde os cards de produto serão renderizados
const productsTitle = document.getElementById('productsTitle');        // Título da seção de produtos (muda conforme filtro)
const productDetail = document.getElementById('product-detail');       // Seção de detalhe do produto (inicialmente oculta)
const productDetailContent = document.getElementById('product-detail-content'); // Conteúdo interno da seção de detalhe
const backToProducts = document.getElementById('back-to-products');     // Botão para voltar à lista de produtos
const cartOverlay = document.getElementById('cartOverlay');            // Overlay (fundo escuro) do carrinho
const cartItemsDiv = document.getElementById('cartItems');             // Div onde os itens do carrinho são listados
const cartTotalPrice = document.getElementById('cartTotalPrice');       // Elemento que exibe o total do carrinho
const cartCount = document.getElementById('cartCount');                // Selo com a quantidade total de itens no carrinho
const cartIcon = document.getElementById('cartIcon');                  // Ícone do carrinho (abre o sidebar)
const closeCart = document.getElementById('closeCart');                // Botão de fechar o carrinho (X)
const clearCartBtn = document.getElementById('clearCartBtn');          // Botão "Limpar" carrinho
const checkoutBtn = document.getElementById('checkoutBtn');            // Botão "Finalizar Compra"
const searchInput = document.getElementById('searchInput');            // Campo de entrada da barra de pesquisa
const searchBtn = document.getElementById('searchBtn');                // Botão de pesquisa (lupa)
const navMenu = document.getElementById('navMenu');                   // Lista de navegação do menu
const menuToggle = document.getElementById('menuToggle');              // Botão hambúrguer para mobile

// Verifica se todos os elementos DOM foram encontrados. Se algum estiver faltando, exibe erro no console e uma mensagem na tela.
if (!productsGrid || !productsTitle || !productDetail || !productDetailContent || !backToProducts ||
    !cartOverlay || !cartItemsDiv || !cartTotalPrice || !cartCount || !cartIcon || !closeCart ||
    !clearCartBtn || !checkoutBtn || !searchInput || !searchBtn || !navMenu || !menuToggle) {
  // Caso algum elemento não exista, imprime erro no console
  console.error('❌ Algum elemento DOM não foi encontrado! Verifique o HTML.');
  // Substitui o conteúdo da página por uma mensagem de erro amigável
  document.body.innerHTML = `
    <div style="text-align:center; padding:50px; color:red;">
      <h1>Erro ao carregar a página</h1>
      <p>Verifique o console para mais detalhes (F12).</p>
    </div>
  `;
} else {
  // ========== FUNÇÕES ==========

  /**
   * Função principal que renderiza os produtos na grade.
   @param {string} category - Categoria a ser filtrada ('all' ou nome da categoria)
    @param {string} searchTerm - Termo de busca (filtra pelo nome do produto)
   */
  function renderProducts(category = 'all', searchTerm = '') {
    // Limpa o conteúdo atual da grade de produtos
    productsGrid.innerHTML = '';

    // Filtra os produtos com base na categoria e no termo de busca
    const filtered = products.filter(p => {
      // Verifica se a categoria corresponde (ou se é 'all')
      const matchCategory = category === 'all' || p.category === category;
      // Verifica se o nome do produto contém o termo de busca (case insensitive)
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      // Retorna true apenas se ambos os critérios forem atendidos
      return matchCategory && matchSearch;
    });

    // Mapeia nomes legíveis para as categorias (usado no título da seção)
    const categoryNames = {
      'all': 'Todos os Produtos',
      'masculino': 'Masculino',
      'feminino': 'Feminino',
      'infantil': 'Infantil',
      'acessorios': 'Acessórios',
      'esportes': 'Esportes'
    };
    // Atualiza o título da seção: se houver busca, exibe "Resultados para ...", senão usa o nome da categoria
    productsTitle.textContent = searchTerm ? `Resultados para "${searchTerm}"` : categoryNames[category] || 'Produtos';

    // Se nenhum produto foi encontrado, exibe uma mensagem
    if (filtered.length === 0) {
      productsGrid.innerHTML = `<p style="text-align:center; grid-column:1/-1; color:var(--gray); padding:40px 0;">Nenhum produto encontrado.</p>`;
      return;
    }

    // Itera sobre cada produto filtrado e cria um card HTML
    filtered.forEach(product => {
      // Cria um elemento <div> para o card
      const card = document.createElement('div');
      card.className = 'product-card';   // Adiciona a classe CSS para estilização

      // Preenche o conteúdo do card com template literal
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}"
             onerror="this.src='https://via.placeholder.com/300x200/cccccc/ffffff?text=Produto'">
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="rating">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '★' : ''} (${product.rating})</div>
          <div>
            <span class="price">R$ ${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn-add" data-id="${product.id}">Adicionar</button>
            <button class="btn-detail" data-id="${product.id}">Detalhes</button>
          </div>
        </div>
      `;

      // Adiciona o card à grade de produtos
      productsGrid.appendChild(card);
    });

    // Após adicionar os cards, atribui eventos aos botões "Adicionar" e "Detalhes"
    // Seleciona todos os botões com classe 'btn-add'
    document.querySelectorAll('.btn-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();            // Impede que o clique propague para elementos pai (evita conflitos)
        const id = parseInt(btn.dataset.id); // Obtém o ID do produto armazenado no atributo data-id
        addToCart(id);                   // Chama a função para adicionar ao carrinho
      });
    });

    // Seleciona todos os botões com classe 'btn-detail'
    document.querySelectorAll('.btn-detail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        showProductDetail(id);           // Chama a função para exibir os detalhes do produto
      });
    });
  }

  /**
   * Altera a categoria atual e atualiza a interface.
   * @param {string} category - Nova categoria selecionada
   */
  function setCategory(category) {
    currentCategory = category;          // Atualiza a variável de estado
    // Itera sobre os itens de categoria (na grade de categorias) e adiciona/remove a classe 'active'
    document.querySelectorAll('.category-item').forEach(el => {
      el.classList.toggle('active', el.dataset.category === category);
    });
    // Fecha o menu de navegação mobile (se estiver aberto)
    navMenu.classList.remove('open');
    // Se a seção de detalhe estiver visível, oculta-a e mostra a grade novamente
    if (productDetail.style.display !== 'none') {
      productDetail.style.display = 'none';
      productsGrid.style.display = 'grid';
    }
    // Renderiza os produtos com a nova categoria e mantém o termo de busca atual
    renderProducts(category, searchInput.value);
  }

  /**
   * Exibe a tela de detalhes de um produto específico.
   * @param {number} productId - ID do produto a ser detalhado
   */
  function showProductDetail(productId) {
    // Busca o produto no array 'products' pelo ID
    const product = products.find(p => p.id === productId);
    if (!product) return;    // Se não encontrar, sai da função

    // Oculta a grade de produtos e exibe a seção de detalhe
    productsGrid.style.display = 'none';
    productDetail.style.display = 'block';
    // Rola a página para o topo para que o usuário veja os detalhes
    window.scrollTo(0, 0);

    // Preenche o conteúdo da seção de detalhe com informações do produto
    productDetailContent.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start;">
        <img src="${product.image}" alt="${product.name}"
             style="width:100%; border-radius:var(--radius); background:var(--light-gray);"
             onerror="this.src='https://via.placeholder.com/600x400/cccccc/ffffff?text=Produto'">
        <div>
          <h2>${product.name}</h2>
          <div style="color:#f1c40f; font-size:1.2rem; margin:10px 0;">
            ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 >= 0.5 ? '★' : ''} (${product.rating})
          </div>
          <div style="font-size:2rem; font-weight:700; color:var(--primary);">
            R$ ${product.price.toFixed(2)}
            ${product.oldPrice ? `<span style="font-size:1rem; color:var(--gray); text-decoration:line-through; margin-left:15px;">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
          </div>
          <p style="margin:20px 0; line-height:1.6; color:var(--text);">${product.description}</p>
          <p style="font-weight:600;"><i class="fas fa-tag"></i> Categoria: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
          <button class="btn-add" data-id="${product.id}" style="margin-top:20px; background:var(--primary); color:white; border:none; padding:12px 30px; border-radius:var(--radius); font-weight:600; cursor:pointer; transition:var(--transition);">Adicionar ao carrinho</button>
        </div>
      </div>
    `;

    // Adiciona evento ao botão "Adicionar ao carrinho" dentro da tela de detalhes
    productDetailContent.querySelector('.btn-add').addEventListener('click', () => {
      addToCart(product.id);
    });
  }

  // ========== EVENTOS ==========

  // Evento do botão "Voltar" na tela de detalhes: oculta detalhes e mostra a grade novamente
  backToProducts.addEventListener('click', () => {
    productDetail.style.display = 'none';
    productsGrid.style.display = 'grid';
    // Re-renderiza os produtos com a categoria atual e termo de busca
    renderProducts(currentCategory, searchInput.value);
  });

  // Evento de clique nos itens da grade de categorias (filtro visual)
  document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', () => {
      setCategory(item.dataset.category);   // Chama setCategory com a categoria do item
    });
  });

  // Evento de clique nos links do menu de navegação (também filtram por categoria)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();                  // Impede o comportamento padrão do link (recarregar página)
      const category = link.dataset.category;
      if (category) setCategory(category);  // Se houver atributo data-category, aplica o filtro
    });
  });

  // ========== CARRINHO ==========

  /**
   * Adiciona um produto ao carrinho. Se já existir, incrementa a quantidade.
   * @param {number} productId - ID do produto a ser adicionado
   */
  function addToCart(productId) {
    // Busca o produto no array 'products'
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Verifica se o produto já está no carrinho
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      // Se já existe, incrementa a quantidade em 1
      existingItem.quantity += 1;
    } else {
      // Se não existe, adiciona ao carrinho com quantidade 1 (cria uma cópia do produto com spread)
      cart.push({ ...product, quantity: 1 });
    }
    // Atualiza a interface do carrinho (contador, lista, total)
    updateCartUI();
    // Exibe um alerta simples para feedback ao usuário
    alert(`${product.name} adicionado ao carrinho!`);
  }

  /**
   * Remove um produto do carrinho completamente.
   * @param {number} productId - ID do produto a ser removido
   */
  function removeFromCart(productId) {
    // Filtra o carrinho mantendo apenas os itens com ID diferente do informado
    cart = cart.filter(item => item.id !== productId);
    // Atualiza a interface do carrinho
    updateCartUI();
  }

  /**
   * Limpa todos os itens do carrinho.
   */
  function clearCart() {
    cart = [];                // Esvazia o array do carrinho
    updateCartUI();           // Atualiza a interface
  }

  /**
   * Atualiza a interface do carrinho: contador, lista de itens e total.
   */
  function updateCartUI() {
    // Calcula o total de itens (soma das quantidades)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    // Atualiza o selo com a quantidade total
    cartCount.textContent = totalItems;

    // Se o carrinho estiver vazio, exibe mensagem e zera o total
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `<p style="text-align:center; color: var(--gray);">Seu carrinho está vazio.</p>`;
      cartTotalPrice.textContent = 'R$ 0,00';
      return;
    }

    // Variável para construir o HTML dos itens e acumular o total
    let html = '';
    let total = 0;

    // Itera sobre cada item do carrinho
    cart.forEach(item => {
      const subtotal = item.price * item.quantity;  // Subtotal do item (preço * quantidade)
      total += subtotal;                            // Acumula no total geral
      // Cria o HTML do item com imagem, nome, preço, quantidade e botão remover
      html += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60/cccccc/ffffff?text=?'">
          <div class="cart-item-details">
            <h4>${item.name}</h4>
            <div><span class="item-price">R$ ${item.price.toFixed(2)}</span> x ${item.quantity}</div>
          </div>
          <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
        </div>
      `;
    });

    // Insere o HTML dos itens no container
    cartItemsDiv.innerHTML = html;
    // Atualiza o total do carrinho
    cartTotalPrice.textContent = `R$ ${total.toFixed(2)}`;

    // Adiciona eventos de clique aos botões "remover" de cada item
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        removeFromCart(id);   // Chama a função de remoção
      });
    });
  }

  /**
   * Abre o sidebar do carrinho (adiciona a classe 'open' ao overlay).
   */
  function openCart() {
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';   // Impede a rolagem da página enquanto o carrinho está aberto
  }

  /**
   * Fecha o sidebar do carrinho (remove a classe 'open').
   */
  function closeCartFn() {
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';         // Restaura a rolagem da página
  }

  // Evento de clique no ícone do carrinho para abrir o sidebar
  cartIcon.addEventListener('click', (e) => {
    e.preventDefault();        // Previne o comportamento padrão do link
    openCart();
  });

  // Evento de clique no botão "X" para fechar o carrinho
  closeCart.addEventListener('click', closeCartFn);

  // Evento de clique no overlay (fundo escuro) – fecha o carrinho se clicar fora do sidebar
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) closeCartFn();
  });

  // Evento do botão "Limpar" – limpa o carrinho
  clearCartBtn.addEventListener('click', clearCart);

  // Evento do botão "Finalizar Compra" – simula finalização
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    alert('Compra finalizada com sucesso! (simulação)');
    clearCart();                // Limpa o carrinho após a compra
    closeCartFn();              // Fecha o sidebar
  });

  // ========== BUSCA ==========

  /**
   * Filtra os produtos com base no termo de busca atual e re-renderiza.
   */
  function filterProductsBySearch() {
    renderProducts(currentCategory, searchInput.value);
  }

  // Evento de clique no botão de pesquisa (lupa)
  searchBtn.addEventListener('click', filterProductsBySearch);

  // Evento de tecla pressionada no campo de busca – se for "Enter", executa a busca
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filterProductsBySearch();
  });

  // ========== MENU HAMBURGER ==========

  // Evento de clique no botão hambúrguer para abrir/fechar o menu de navegação em mobile
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // ========== INICIALIZAR ==========

  // Renderiza todos os produtos ao carregar a página (categoria 'all', sem busca)
  renderProducts('all', '');
  // Atualiza a interface do carrinho (inicialmente vazio)
  updateCartUI();
}
