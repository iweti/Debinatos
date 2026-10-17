import type { DemoState, Product } from "../types/store";

// Fotos do Instagram da Debinatos; preços e estoque fictícios para demonstração.
const items: Array<[string, string, string, number, string, string, string]> = [
  [
    "terrario-ursos-polares",
    "Terrário Ursos Polares",
    "Decoração",
    3990,
    "terrario-ursos-polares",
    "Um pequeno cenário de inverno com ursos polares, detalhes delicados e tampa amadeirada para decorar seu cantinho.",
    "Pote de vidro e elementos decorativos",
  ],
  [
    "mini-aquario-urso",
    "Mini Aquário de Urso",
    "Decoração",
    2990,
    "mini-aquario-urso",
    "Um ursinho polar em uma garrafinha com cenário azul e tampa de cortiça. Um detalhe cheio de carinho para presentear.",
    "Garrafinha de vidro, cortiça e miniatura decorativa",
  ],
  [
    "mini-mundo-lampada",
    "Mini Mundo na Lâmpada",
    "Decoração",
    4490,
    "mini-mundo-lampada",
    "Um cenário de neve em um recipiente no formato de lâmpada, com ursos polares e detalhes verdes para iluminar a decoração.",
    "Recipiente decorativo e miniaturas",
  ],
  [
    "mini-aquario-fundo-do-mar",
    "Mini Aquário Fundo do Mar",
    "Decoração",
    5490,
    "mini-aquario-fundo-do-mar",
    "Tubarão, peixinho e vegetação em um cenário marinho dentro de um pote com tampa de cortiça. Uma peça decorativa sem animais vivos.",
    "Pote de vidro, cortiça e elementos decorativos",
  ],
  [
    "lapis-patinha",
    "Lápis com Pingente de Patinha",
    "Papelaria",
    1490,
    "lapis-patinha",
    "Lápis personalizados com pingentes de patinha e detalhes coloridos para levar um toque de fofura aos estudos. Valor fictício por unidade.",
    "Lápis de grafite e pingente decorativo",
  ],
  [
    "vidrinho-snoopy",
    "Vidrinho Decorativo Snoopy",
    "Decoração",
    4990,
    "vidrinho-snoopy",
    "Uma miniatura do Snoopy em um vidrinho cheio de cores e pequenos detalhes, para deixar a mesa ou a estante mais alegre.",
    "Recipiente de vidro, cortiça e miniatura decorativa",
  ],
  [
    "mini-aquario-dory",
    "Mini Aquário Dory",
    "Decoração",
    4590,
    "mini-aquario-dory",
    "A fofura da Dory em um cenário marinho com plantas e detalhes coloridos. Um pequeno universo para decorar e presentear.",
    "Pote de vidro, cortiça e elementos decorativos",
  ],
  [
    "mini-aquario-axolote",
    "Mini Aquário de Axolote",
    "Decoração",
    4990,
    "mini-aquario-axolote",
    "Um axolote em um potinho com plantas delicadas, pedrinhas coloridas e pérolas decorativas. Um aquário artesanal sem manutenção.",
    "Pote de vidro, cortiça e elementos decorativos",
  ],
  [
    "vidrinho-pinguim",
    "Vidrinho Decorativo Pinguim",
    "Decoração",
    3290,
    "vidrinho-pinguim",
    "Um pinguim em uma pequena garrafinha com tampa de cortiça e cenário delicado. Um mimo para transformar seu cantinho.",
    "Garrafinha de vidro, cortiça e miniatura decorativa",
  ],
  [
    "lapis-monstros",
    "Lápis Mike e Sulivan",
    "Papelaria",
    1290,
    "lapis-monstros",
    "Os monstrinhos Mike e Sulivan deixam a escrita muito mais divertida nestes lápis personalizados. Valor fictício por unidade.",
    "Lápis de grafite e ponteira decorativa",
  ],
  [
    "lapis-sereia",
    "Lápis com Pingente de Sereia",
    "Papelaria",
    1490,
    "lapis-sereia",
    "Lápis de grafite com pingentes coloridos de cauda de sereia para dar um toque de magia ao seu material escolar. Valor fictício por unidade.",
    "Lápis de grafite e pingente decorativo",
  ],
  [
    "axolote-acrilico",
    "Mini Mundo Axolote Rosa",
    "Decoração",
    5990,
    "axolote-acrilico",
    "Um axolote rosa em um cenário azul dentro de uma peça de acrílico. Uma miniatura artesanal cheia de personalidade.",
    "Caixa de acrílico e elementos decorativos",
  ],
];

export function initialState(): DemoState {
  const products: Product[] = items.map(
    ([id, name, category, price, photo, description, material], i) => ({
      id,
      name,
      category,
      price,
      description,
      material,
      images: [`/images/products/${photo}.webp`],
      stock: i === 11 ? 0 : 6 + i,
      active: true,
      featured: i < 4,
      createdAt: new Date(Date.UTC(2026, 9, 10 - i)).toISOString(),
      dimensions:
        category === "Decoração"
          ? "Peça decorativa • consulte as medidas"
          : "Valor por unidade • consulte a descrição",
      ...(i === 0
        ? { badge: "Queridinho", originalPrice: 4990 }
        : i === 1
          ? { badge: "Novidade" }
          : {}),
    }),
  );
  const address = {
    cep: "01001-000",
    street: "Rua das Flores (fictícia)",
    number: "123",
    complement: "",
    district: "Centro",
    city: "São Paulo",
    state: "SP",
  };
  return {
    version: 1,
    products,
    cart: [],
    favorites: [],
    loggedIn: false,
    profile: { name: "Marina Oliveira", address },
    orders: [
      {
        id: "DEB-1001",
        createdAt: "2026-10-01T15:00:00.000Z",
        items: [
          {
            productId: products[0].id,
            name: products[0].name,
            image: products[0].images[0],
            price: products[0].price,
            quantity: 1,
          },
        ],
        subtotal: products[0].price,
        shipping: 0,
        total: products[0].price,
        delivery: "pickup",
        payment: "pix",
        status: "completed",
        customerName: "Marina Oliveira",
        address: null,
      },
    ],
  };
}
