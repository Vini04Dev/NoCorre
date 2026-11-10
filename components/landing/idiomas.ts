/**
 * Textos da landing em português, inglês e espanhol. O app em si continua só em
 * português: as telas de celular desenhadas na landing (MockupCelular) mostram o
 * app como ele é, por isso não são traduzidas.
 *
 * Números, depoimentos e nomes são FICTÍCIOS (ver dados.ts).
 */

export const IDIOMAS = ["pt", "en", "es"] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const NOME_IDIOMA: Record<Idioma, string> = { pt: "Português", en: "English", es: "Español" };
/** Valor do atributo lang de cada idioma. */
export const LANG: Record<Idioma, string> = { pt: "pt-BR", en: "en", es: "es" };

const pt = {
  meta: {
    titulo: "No Corre! | Controle financeiro para entregadores",
    descricao: "Entregas, corridas, despesas e metas num app feito para entregadores de São Sebastião do Paraíso.",
  },
  nav: {
    rotulo: "Navegação do site",
    links: ["Como funciona", "Relatórios", "Nossa cidade", "Planos", "GitHub", "Dúvidas"],
    entrar: "Entrar",
    criarConta: "Criar conta",
    abrirApp: "Abrir o app",
    idioma: "Idioma",
    temaClaro: "Usar tema claro",
    temaEscuro: "Usar tema escuro",
  },
  hero: {
    selo: "De entregador para entregador",
    cidade: "São Sebastião do Paraíso",
    titulo: "Seu corre.",
    destaque: "No controle.",
    texto: "Entregas, corridas, despesas e metas num app feito para quem vive em cima da moto.",
  },
  numeros: ["lançamentos no teste piloto", "entregadores usando em Paraíso", "de satisfação"],
  perfis: ["Apps de entrega", "Centrais de motoboy", "Mototáxi", "Pizzarias e demais estabelecimentos", "Entregas avulsas"],
  frase: {
    texto: "Cada entrega, cada corrida, cada real que entra e sai. Tudo no seu bolso, do jeito que o corre flui.",
    destaque: ["entrega,", "corrida,", "real"],
  },
  historia: [
    {
      selo: "SALDO",
      titulo: "Quanto sobrou. Agora.",
      texto: "Recebidos, pendentes e despesas do dia, da semana ou do mês. Sem planilha, sem caderninho.",
    },
    { selo: "LANÇAMENTO", titulo: "Dois toques por entrega.", texto: "Entrega, corrida ou gorjeta. O total aparece enquanto você digita." },
    {
      selo: "METAS",
      titulo: "A meta enche junto com o tanque.",
      texto: "Defina quanto quer faturar ou quantas entregas quer fazer e veja o círculo completar.",
    },
    {
      selo: "CONTAS",
      titulo: "Cada parcela no lugar certo.",
      texto: "Financiamento, água, luz: o pagamento abate da conta escolhida e o app avisa quanto falta.",
    },
  ],
  relatorios: {
    selo: "RELATÓRIOS",
    titulo: "Números que mostram o caminho.",
    texto: "Descubra o dia que mais rende, para onde vai o dinheiro e se a meta do mês vai bater.",
    receitaSemana: "Receita da semana",
    entregas: "entregas",
    entregasPorDia: "Entregas por dia da semana",
    dias: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
    meta: "Meta de entregas do mês",
    /** Vem logo depois do número de entregas feitas (644). */
    metaDetalhe: " de 700 entregas. Faltam 56 em 4 dias.",
    paraOnde: "Para onde vai o dinheiro",
    despesasPorCategoria: "Despesas por categoria",
    categorias: ["Combustível", "Manutenção", "Alimentação", "Diária Central"],
    saldoMes: "Saldo acumulado no mês",
    saldoSubindo: "Saldo subindo ao longo do mês",
  },
  cidade: {
    rotulo: "Onde o No Corre! roda",
    selo: "DE ONDE A GENTE VEM",
    mapa: "Mapa do Brasil com Minas Gerais e São Sebastião do Paraíso em destaque",
    etapas: [
      { titulo: "Brasil", texto: "Milhares de entregadores rodando todo dia, quase sempre sem controle do que ganham." },
      { titulo: "Minas Gerais", texto: "No Sul de Minas, o corre é de moto: app, central, pizzaria e mototáxi." },
      { titulo: "São Sebastião do Paraíso", texto: "É aqui que o No Corre! nasceu e roda o teste piloto, com entregadores da cidade." },
    ],
  },
  passos: {
    selo: "COMEÇAR É RÁPIDO",
    titulo: "Três passos. Menos de um minuto.",
    itens: [
      { titulo: "Crie sua conta", texto: "Só nome, e-mail e senha. Grátis e sem cartão de crédito." },
      { titulo: "Cadastre onde você roda", texto: "O app, a central ou a pizzaria. Leva menos de um minuto." },
      { titulo: "Lance e acompanhe", texto: "A cada entrega, um toque. No fim do dia, o saldo já está pronto." },
    ],
  },
  depoimentos: {
    selo: "QUEM JÁ RODA COM A GENTE",
    titulo: "Adeus, caderninho.",
    itens: [
      {
        nome: "Rafael M.",
        papel: "Entregador por aplicativo",
        texto: "Antes eu anotava no caderno e sempre perdia alguma coisa. Agora sei na hora quanto fiz na semana.",
      },
      { nome: "Juliana S.", papel: "Mototaxista", texto: "As metas me ajudaram a juntar para a revisão da moto sem apertar o mês." },
      {
        nome: "Carlos P.",
        papel: "Entregador de pizzaria",
        texto: "O controle das contas do mês é o que eu mais uso. Pago a parcela e ele já mostra quanto falta.",
      },
    ],
  },
  planos: {
    selo: "PLANOS",
    titulo: "Grátis para começar. Grátis para continuar.",
    gratis: "Grátis",
    disponivel: "DISPONÍVEL",
    porMes: "/mês",
    itensGratis: [
      "Receitas e despesas ilimitadas",
      "Resumo do dia, semana e mês",
      "Metas e contas a pagar",
      "Relatórios e avisos",
      "Funciona no celular como app",
    ],
    criarMinhaConta: "Criar minha conta",
    emBreve: "Em breve",
    itensPro: ["Tudo do plano grátis", "Agenda com lembretes", "Saúde da moto (trocas por km)", "Exportar relatórios"],
    avisaremos: "Avisaremos no app",
  },
  codigo: {
    selo: "Código aberto",
    titulo: "Open source, à vista de todo mundo.",
    texto: "O código do No Corre! é aberto e está no GitHub. Qualquer pessoa pode ver como o app é feito.",
    botao: "Ver no GitHub ↗",
    terminal: "Comandos para rodar o No Corre! no seu computador",
  },
  perguntas: {
    selo: "DÚVIDAS",
    titulo: "Perguntas frequentes",
    itens: [
      {
        pergunta: "O No Corre! é pago?",
        resposta:
          "Não. Todas as funções atuais são gratuitas. Um plano Pro com recursos extras está nos planos, mas o essencial continua grátis.",
      },
      {
        pergunta: "Preciso baixar na loja de aplicativos?",
        resposta: "Não. Abra o site no celular e use “Adicionar à tela de início”. Ele abre em tela cheia, como um app.",
      },
      {
        pergunta: "Meus dados ficam seguros?",
        resposta: "Cada conta só enxerga os próprios dados, com regras de acesso no próprio banco. Sua senha é guardada criptografada.",
      },
      {
        pergunta: "Serve para quem faz entrega e mototáxi?",
        resposta:
          "Serve. Você escolhe o tipo de cada receita: entrega, corrida ou gorjeta, e de qual cliente veio. A diária da central entra como despesa.",
      },
      {
        pergunta: "O app está em português?",
        resposta: "Sim. Por enquanto o app é só em português; esta página também está em inglês e espanhol.",
      },
    ],
  },
  final: {
    titulo: "Bora Correr?",
    logado: "Sua conta já está aberta neste aparelho.",
    deslogado: "Crie sua conta grátis ou entre para continuar de onde parou.",
    criarGratis: "Criar conta grátis",
    jaTenho: "Já tenho conta, entrar",
  },
  rodape: {
    sobre: "Controle de entregas e receita para motoboys e entregadores. Nascido em São Sebastião do Paraíso, MG.",
    produto: "Produto",
    acesso: "Acesso",
    contato: "Contato",
    direitos: "Todos os direitos reservados.",
  },
};

export type Textos = typeof pt;

const en: Textos = {
  meta: {
    titulo: "No Corre! | Money tracking for delivery riders",
    descricao: "Deliveries, rides, expenses and goals in an app built for delivery riders in São Sebastião do Paraíso, Brazil.",
  },
  nav: {
    rotulo: "Site navigation",
    links: ["How it works", "Reports", "Our city", "Pricing", "GitHub", "FAQ"],
    entrar: "Sign in",
    criarConta: "Sign up",
    abrirApp: "Open the app",
    idioma: "Language",
    temaClaro: "Use light theme",
    temaEscuro: "Use dark theme",
  },
  hero: {
    selo: "By riders, for riders",
    cidade: "São Sebastião do Paraíso",
    titulo: "Your hustle.",
    destaque: "Under control.",
    texto: "Deliveries, rides, expenses and goals in an app made for people who live on a motorcycle.",
  },
  numeros: ["entries in the pilot test", "riders using it in Paraíso", "satisfaction"],
  perfis: ["Delivery apps", "Motorcycle courier hubs", "Moto taxi", "Pizzerias and other shops", "One-off deliveries"],
  frase: {
    texto: "Every delivery, every ride, every real that comes in and goes out. All in your pocket, the way your hustle flows.",
    destaque: ["delivery,", "ride,", "real"],
  },
  historia: [
    {
      selo: "BALANCE",
      titulo: "What's left. Right now.",
      texto: "Received, pending and expenses for the day, week or month. No spreadsheets, no notebooks.",
    },
    { selo: "ENTRY", titulo: "Two taps per delivery.", texto: "Delivery, ride or tip. The total shows up as you type." },
    {
      selo: "GOALS",
      titulo: "The goal fills up with the tank.",
      texto: "Set how much you want to earn or how many deliveries you want to make and watch the circle close.",
    },
    {
      selo: "BILLS",
      titulo: "Every installment in its place.",
      texto: "Financing, water, power: each payment comes off the chosen bill and the app tells you what's left.",
    },
  ],
  relatorios: {
    selo: "REPORTS",
    titulo: "Numbers that show the way.",
    texto: "Find your best day, where the money goes and whether you'll hit this month's goal.",
    receitaSemana: "Revenue this week",
    entregas: "deliveries",
    entregasPorDia: "Deliveries per weekday",
    dias: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    meta: "Monthly delivery goal",
    /** Vem logo depois do número de entregas feitas (644). */
    metaDetalhe: " of 700 deliveries. 56 to go in 4 days.",
    paraOnde: "Where the money goes",
    despesasPorCategoria: "Expenses by category",
    categorias: ["Fuel", "Maintenance", "Food", "Hub daily fee"],
    saldoMes: "Balance this month",
    saldoSubindo: "Balance growing over the month",
  },
  cidade: {
    rotulo: "Where No Corre! runs",
    selo: "WHERE WE COME FROM",
    mapa: "Map of Brazil highlighting Minas Gerais and São Sebastião do Paraíso",
    etapas: [
      { titulo: "Brazil", texto: "Thousands of riders on the road every day, rarely keeping track of what they earn." },
      { titulo: "Minas Gerais", texto: "In southern Minas, the hustle runs on motorcycles: apps, hubs, pizzerias and moto taxis." },
      { titulo: "São Sebastião do Paraíso", texto: "This is where No Corre! was born and runs its pilot test, with local riders." },
    ],
  },
  passos: {
    selo: "GETTING STARTED IS QUICK",
    titulo: "Three steps. Under a minute.",
    itens: [
      { titulo: "Create your account", texto: "Just name, email and password. Free, no credit card." },
      { titulo: "Add where you work", texto: "The app, the hub or the pizzeria. Takes less than a minute." },
      { titulo: "Log and follow", texto: "One tap per delivery. By the end of the day, your balance is ready." },
    ],
  },
  depoimentos: {
    selo: "RIDERS ALREADY ON BOARD",
    titulo: "Goodbye, notebook.",
    itens: [
      {
        nome: "Rafael M.",
        papel: "App delivery rider",
        texto: "I used to write everything in a notebook and always lost something. Now I know right away how much I made this week.",
      },
      { nome: "Juliana S.", papel: "Moto taxi driver", texto: "Goals helped me save for my bike's service without squeezing the month." },
      {
        nome: "Carlos P.",
        papel: "Pizzeria delivery rider",
        texto: "Tracking my monthly bills is what I use most. I pay an installment and it shows what's left.",
      },
    ],
  },
  planos: {
    selo: "PRICING",
    titulo: "Free to start. Free to keep going.",
    gratis: "Free",
    disponivel: "AVAILABLE",
    porMes: "/month",
    itensGratis: [
      "Unlimited revenue and expenses",
      "Daily, weekly and monthly summary",
      "Goals and bills to pay",
      "Reports and alerts",
      "Works on your phone like an app",
    ],
    criarMinhaConta: "Create my account",
    emBreve: "Soon",
    itensPro: ["Everything in Free", "Calendar with reminders", "Bike health (service by mileage)", "Export reports"],
    avisaremos: "We'll let you know in the app",
  },
  codigo: {
    selo: "Open source",
    titulo: "Open source, in plain sight.",
    texto: "No Corre!'s code is open and lives on GitHub. Anyone can see how the app is built.",
    botao: "View on GitHub ↗",
    terminal: "Commands to run No Corre! on your computer",
  },
  perguntas: {
    selo: "FAQ",
    titulo: "Frequently asked questions",
    itens: [
      {
        pergunta: "Is No Corre! paid?",
        resposta: "No. Every current feature is free. A Pro plan with extras is planned, but the essentials stay free.",
      },
      {
        pergunta: "Do I need to download it from an app store?",
        resposta: "No. Open the site on your phone and tap “Add to Home Screen”. It opens full screen, like an app.",
      },
      {
        pergunta: "Is my data safe?",
        resposta: "Each account only sees its own data, enforced by access rules in the database itself. Your password is stored encrypted.",
      },
      {
        pergunta: "Does it work for both deliveries and moto taxi?",
        resposta: "Yes. You pick the type of each revenue entry (delivery, ride or tip) and which client it came from. The hub's daily fee is an expense.",
      },
      {
        pergunta: "Is the app in English?",
        resposta: "Not yet. For now the app itself is in Portuguese; only this page is available in English and Spanish.",
      },
    ],
  },
  final: {
    titulo: "Ready to ride?",
    logado: "Your account is already open on this device.",
    deslogado: "Create your free account or sign in to pick up where you left off.",
    criarGratis: "Create free account",
    jaTenho: "I have an account, sign in",
  },
  rodape: {
    sobre: "Delivery and revenue tracking for motorcycle couriers and delivery riders. Born in São Sebastião do Paraíso, Brazil.",
    produto: "Product",
    acesso: "Access",
    contato: "Contact",
    direitos: "All rights reserved.",
  },
};

const es: Textos = {
  meta: {
    titulo: "No Corre! | Control financiero para repartidores",
    descricao: "Entregas, viajes, gastos y metas en una app hecha para repartidores de São Sebastião do Paraíso, Brasil.",
  },
  nav: {
    rotulo: "Navegación del sitio",
    links: ["Cómo funciona", "Informes", "Nuestra ciudad", "Planes", "GitHub", "Preguntas"],
    entrar: "Entrar",
    criarConta: "Crear cuenta",
    abrirApp: "Abrir la app",
    idioma: "Idioma",
    temaClaro: "Usar tema claro",
    temaEscuro: "Usar tema oscuro",
  },
  hero: {
    selo: "De repartidor para repartidor",
    cidade: "São Sebastião do Paraíso",
    titulo: "Tu trabajo.",
    destaque: "Bajo control.",
    texto: "Entregas, viajes, gastos y metas en una app hecha para quien vive sobre la moto.",
  },
  numeros: ["registros en la prueba piloto", "repartidores usándola en Paraíso", "de satisfacción"],
  perfis: ["Apps de reparto", "Centrales de mensajería", "Mototaxi", "Pizzerías y otros comercios", "Entregas sueltas"],
  frase: {
    texto: "Cada entrega, cada viaje, cada real que entra y sale. Todo en tu bolsillo, al ritmo de tu trabajo.",
    destaque: ["entrega,", "viaje,", "real"],
  },
  historia: [
    {
      selo: "SALDO",
      titulo: "Cuánto te quedó. Ahora.",
      texto: "Cobrados, pendientes y gastos del día, la semana o el mes. Sin planillas, sin cuaderno.",
    },
    { selo: "REGISTRO", titulo: "Dos toques por entrega.", texto: "Entrega, viaje o propina. El total aparece mientras escribes." },
    {
      selo: "METAS",
      titulo: "La meta se llena junto con el tanque.",
      texto: "Define cuánto quieres ganar o cuántas entregas quieres hacer y mira cómo se completa el círculo.",
    },
    {
      selo: "CUENTAS",
      titulo: "Cada cuota en su lugar.",
      texto: "Financiación, agua, luz: el pago se descuenta de la cuenta elegida y la app avisa cuánto falta.",
    },
  ],
  relatorios: {
    selo: "INFORMES",
    titulo: "Números que muestran el camino.",
    texto: "Descubre el día que más rinde, a dónde va el dinero y si vas a cumplir la meta del mes.",
    receitaSemana: "Ingresos de la semana",
    entregas: "entregas",
    entregasPorDia: "Entregas por día de la semana",
    dias: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    meta: "Meta de entregas del mes",
    /** Vem logo depois do número de entregas feitas (644). */
    metaDetalhe: " de 700 entregas. Faltan 56 en 4 días.",
    paraOnde: "A dónde va el dinero",
    despesasPorCategoria: "Gastos por categoría",
    categorias: ["Combustible", "Mantenimiento", "Comida", "Cuota de la central"],
    saldoMes: "Saldo acumulado del mes",
    saldoSubindo: "Saldo subiendo a lo largo del mes",
  },
  cidade: {
    rotulo: "Dónde funciona No Corre!",
    selo: "DE DÓNDE VENIMOS",
    mapa: "Mapa de Brasil con Minas Gerais y São Sebastião do Paraíso destacados",
    etapas: [
      { titulo: "Brasil", texto: "Miles de repartidores en la calle todos los días, casi siempre sin controlar lo que ganan." },
      { titulo: "Minas Gerais", texto: "En el sur de Minas, el trabajo es en moto: apps, centrales, pizzerías y mototaxi." },
      { titulo: "São Sebastião do Paraíso", texto: "Aquí nació No Corre! y aquí corre la prueba piloto, con repartidores de la ciudad." },
    ],
  },
  passos: {
    selo: "EMPEZAR ES RÁPIDO",
    titulo: "Tres pasos. Menos de un minuto.",
    itens: [
      { titulo: "Crea tu cuenta", texto: "Solo nombre, correo y contraseña. Gratis y sin tarjeta de crédito." },
      { titulo: "Registra dónde trabajas", texto: "La app, la central o la pizzería. Lleva menos de un minuto." },
      { titulo: "Registra y sigue", texto: "Un toque por entrega. Al final del día, el saldo ya está listo." },
    ],
  },
  depoimentos: {
    selo: "QUIENES YA RUEDAN CON NOSOTROS",
    titulo: "Adiós, cuaderno.",
    itens: [
      {
        nome: "Rafael M.",
        papel: "Repartidor de apps",
        texto: "Antes anotaba en un cuaderno y siempre se me perdía algo. Ahora sé al instante cuánto hice en la semana.",
      },
      { nome: "Juliana S.", papel: "Mototaxista", texto: "Las metas me ayudaron a ahorrar para el mantenimiento de la moto sin ajustar el mes." },
      {
        nome: "Carlos P.",
        papel: "Repartidor de pizzería",
        texto: "El control de las cuentas del mes es lo que más uso. Pago la cuota y ya me muestra cuánto falta.",
      },
    ],
  },
  planos: {
    selo: "PLANES",
    titulo: "Gratis para empezar. Gratis para seguir.",
    gratis: "Gratis",
    disponivel: "DISPONIBLE",
    porMes: "/mes",
    itensGratis: [
      "Ingresos y gastos ilimitados",
      "Resumen del día, la semana y el mes",
      "Metas y cuentas por pagar",
      "Informes y avisos",
      "Funciona en el celular como una app",
    ],
    criarMinhaConta: "Crear mi cuenta",
    emBreve: "Pronto",
    itensPro: ["Todo lo del plan gratis", "Agenda con recordatorios", "Salud de la moto (cambios por km)", "Exportar informes"],
    avisaremos: "Te avisaremos en la app",
  },
  codigo: {
    selo: "Código abierto",
    titulo: "Open source, a la vista de todos.",
    texto: "El código de No Corre! es abierto y está en GitHub. Cualquiera puede ver cómo está hecha la app.",
    botao: "Ver en GitHub ↗",
    terminal: "Comandos para ejecutar No Corre! en tu computadora",
  },
  perguntas: {
    selo: "PREGUNTAS",
    titulo: "Preguntas frecuentes",
    itens: [
      {
        pergunta: "¿No Corre! es pago?",
        resposta: "No. Todas las funciones actuales son gratis. Hay un plan Pro con extras en camino, pero lo esencial sigue siendo gratis.",
      },
      {
        pergunta: "¿Tengo que descargarla de una tienda de apps?",
        resposta: "No. Abre el sitio en el celular y usa “Agregar a la pantalla de inicio”. Se abre en pantalla completa, como una app.",
      },
      {
        pergunta: "¿Mis datos están seguros?",
        resposta: "Cada cuenta solo ve sus propios datos, con reglas de acceso en la propia base de datos. Tu contraseña se guarda cifrada.",
      },
      {
        pergunta: "¿Sirve para quien hace entregas y mototaxi?",
        resposta: "Sí. Eliges el tipo de cada ingreso (entrega, viaje o propina) y de qué cliente vino. La cuota diaria de la central es un gasto.",
      },
      {
        pergunta: "¿La app está en español?",
        resposta: "Todavía no. Por ahora la app está en portugués; solo esta página está en inglés y español.",
      },
    ],
  },
  final: {
    titulo: "¿Salimos a rodar?",
    logado: "Tu cuenta ya está abierta en este dispositivo.",
    deslogado: "Crea tu cuenta gratis o entra para seguir donde lo dejaste.",
    criarGratis: "Crear cuenta gratis",
    jaTenho: "Ya tengo cuenta, entrar",
  },
  rodape: {
    sobre: "Control de entregas e ingresos para mensajeros en moto y repartidores. Nacido en São Sebastião do Paraíso, Brasil.",
    produto: "Producto",
    acesso: "Acceso",
    contato: "Contacto",
    direitos: "Todos los derechos reservados.",
  },
};

export const TEXTOS: Record<Idioma, Textos> = { pt, en, es };

/** Idioma pelo cookie escolhido na página, senão pelo Accept-Language do navegador, senão português. */
export function escolherIdioma(cookie: string | undefined, acceptLanguage: string | null): Idioma {
  if (cookie && (IDIOMAS as readonly string[]).includes(cookie)) return cookie as Idioma;
  for (const parte of (acceptLanguage ?? "").split(",")) {
    const codigo = parte.trim().slice(0, 2).toLowerCase();
    if (codigo === "pt" || codigo === "en" || codigo === "es") return codigo;
  }
  return "pt";
}

export const COOKIE_IDIOMA = "nocorre-idioma";
export const COOKIE_TEMA = "nocorre-tema";
export type Tema = "escuro" | "claro";
