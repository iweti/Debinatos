import type { DemoState, Product } from "../types/store";

const items: Array<[string, string, string, number, string, string, string]> = [
  [
    "argolas-aurora",
    "Argolas Aurora",
    "Bijuterias",
    3990,
    "earrings",
    "Um toque dourado que ilumina qualquer dia. Argolas leves e delicadas para acompanhar você em todos os momentos.",
    "Liga metálica com acabamento dourado",
  ],
  [
    "colar-essencia",
    "Colar Essência",
    "Bijuterias",
    5490,
    "necklace",
    "Um colar delicado para usar pertinho do coração. Combina com produções leves e também com seus dias especiais.",
    "Liga metálica com acabamento dourado",
  ],
  [
    "anel-luar",
    "Anel Luar",
    "Bijuterias",
    2990,
    "rings",
    "Pequeno no tamanho, cheio de personalidade. Um detalhe especial para compor suas combinações favoritas.",
    "Liga metálica dourada e pedra sintética",
  ],
  [
    "pulseira-elo",
    "Pulseira Elo",
    "Bijuterias",
    4490,
    "bracelet",
    "Elos delicados, brilho na medida e um charme que vai com tudo. Uma peça para usar sozinha ou em composição.",
    "Liga metálica com acabamento dourado",
  ],
  [
    "mix-encanto",
    "Mix Encanto",
    "Bijuterias",
    6990,
    "jewels",
    "Uma seleção de pequenos encantos para dar um toque especial ao seu visual. Perfeita também para presentear.",
    "Liga metálica e detalhes decorativos",
  ],
  [
    "vaso-sereno",
    "Vaso Sereno",
    "Decoração",
    5990,
    "vase",
    "Formas orgânicas e textura suave para deixar seu cantinho ainda mais acolhedor. Lindo com flores ou sozinho.",
    "Cerâmica com acabamento fosco",
  ],
  [
    "vaso-aconchego",
    "Vaso Aconchego",
    "Decoração",
    7490,
    "ceramic",
    "Um detalhe artesanal que faz a casa abraçar. Tons naturais e linhas delicadas para uma decoração com afeto.",
    "Cerâmica artesanal",
  ],
  [
    "porta-joias-afeto",
    "Porta-joias Afeto",
    "Acessórios",
    4990,
    "accessories",
    "Um lugar especial para guardar seus pequenos tesouros. Prático, delicado e perfeito para sua rotina.",
    "Cerâmica e acabamento acetinado",
  ],
  [
    "colar-perola",
    "Colar Pérola",
    "Bijuterias",
    6490,
    "pearl",
    "A delicadeza das pérolas em uma peça versátil. Um clássico acolhedor para trazer brilho aos dias comuns.",
    "Pérolas sintéticas e liga metálica",
  ],
  [
    "vela-bons-momentos",
    "Vela Bons Momentos",
    "Decoração",
    3590,
    "home",
    "Uma pausa para você. Um pequeno enfeite para criar uma atmosfera acolhedora e decorar com delicadeza.",
    "Cera vegetal e recipiente de vidro",
  ],
  [
    "kit-dourado",
    "Kit Dourado",
    "Acessórios",
    8990,
    "jewels",
    "Um conjunto de detalhes cheios de carinho. Para compor, misturar e transformar cada dia em uma ocasião especial.",
    "Liga metálica dourada",
  ],
  [
    "anel-flor",
    "Anel Flor",
    "Bijuterias",
    3490,
    "rings",
    "Inspirado na leveza das flores, um anel delicado e cheio de personalidade. Ajustável para acompanhar sua rotina.",
    "Liga metálica com acabamento dourado",
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
      images: [`/images/${photo}.jpg`],
      stock: i === 11 ? 0 : 6 + i,
      active: true,
      featured: i < 4,
      createdAt: new Date(Date.UTC(2026, 9, 10 - i)).toISOString(),
      dimensions:
        category === "Decoração"
          ? "Aprox. 12 × 15 cm"
          : "Tamanho único • consulte a descrição",
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
        subtotal: 3990,
        shipping: 0,
        total: 3990,
        delivery: "pickup",
        payment: "pix",
        status: "completed",
        customerName: "Marina Oliveira",
        address: null,
      },
    ],
  };
}
