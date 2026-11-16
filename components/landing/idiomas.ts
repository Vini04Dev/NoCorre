/**
 * Textos da landing em português, inglês e espanhol. O app em si continua só em
 * português; as telas de celular desenhadas na landing (MockupCelular) têm os
 * próprios textos, também nos três idiomas, em telas-idiomas.ts.
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
    { selo: "CARTEIRAS · PRO", titulo: "Cada real no seu lugar.", texto: "Dinheiro em mão, conta do banco e reserva: cada carteira com o próprio saldo e as transferências entre elas." },
    { selo: "SAÚDE DA MOTO · PRO", titulo: "A moto avisa antes de parar.", texto: "Informe a quilometragem e veja o que está em dia e o que já passou da hora: óleo, pneus, relação e freios." },
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
  recursos: {
    selo: "RECURSOS",
    titulo: "Tudo o que o app já faz.",
    texto: "Do saldo do dia à troca de óleo, sem planilha e sem caderninho.",
    /** Na ordem dos ícones em Recursos.tsx; os dois últimos são do Pro. */
    itens: [
      { titulo: "Saldo na cara", texto: "Tudo o que entrou e saiu no dia, na semana ou no mês, com as despesas do corre separadas das pessoais." },
      { titulo: "Contas do mês", texto: "Aluguel, internet e parcelas com vencimento, contagem de parcelas e débito automático." },
      { titulo: "Avisos no sininho", texto: "Contas para vencer, compromissos e entregas a receber num lugar só." },
      { titulo: "Relatórios em reais", texto: "Quanto recebeu, quanto sobrou, por dia e por entrega, sem porcentagem difícil." },
      { titulo: "Agenda", texto: "Compromissos por dia, semana e mês, com o próximo lembrado no Início." },
      { titulo: "Outras entradas", texto: "Salário, bolsa ou ajuda da família entram sem misturar com as entregas." },
      { titulo: "Carteiras", texto: "Dinheiro em mão, conta do banco e reserva, cada um com o próprio saldo." },
      { titulo: "Saúde da moto", texto: "Óleo, pneus, relação e freios: o app avisa pela quilometragem quando trocar." },
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
      "Saldo do dia, da semana e do mês",
      "Metas e contas do mês",
      "Relatórios, agenda e avisos",
      "Funciona no celular como app",
    ],
    criarMinhaConta: "Criar minha conta",
    emBreve: "Em teste",
    itensPro: ["Tudo do plano grátis", "Carteiras com saldo próprio", "Saúde da moto (trocas por km)", "Temas do app"],
    avisaremos: "Sem cobrança: peça acesso pelo app",
  },
  codigo: {
    selo: "Código aberto",
    titulo: "Open source, à vista de todo mundo.",
    texto: "O código do No Corre! é aberto e está no GitHub. Qualquer pessoa pode ver como o app é feito.",
    botao: "Ver no GitHub",
    terminal: "Comandos para rodar o No Corre! no seu computador",
  },
  perguntas: {
    selo: "DÚVIDAS",
    titulo: "Perguntas frequentes",
    itens: [
      {
        pergunta: "O No Corre! é pago?",
        resposta:
          "Não. Tudo do plano grátis continua gratuito: receitas, despesas, metas, contas do mês e relatórios. O plano Pro (carteiras, saúde da moto e temas) está em fase de testes e, por enquanto, é liberado a pedido, sem cobrança.",
      },
      {
        pergunta: "Preciso baixar na loja de aplicativos?",
        resposta: "Não é necessário. O No Corre! é um aplicativo web instalável: abra o site no navegador do celular e toque em “Adicionar à tela de início”. Ele passa a abrir em tela cheia, com ícone próprio, como qualquer aplicativo.",
      },
      {
        pergunta: "Meus dados ficam seguros?",
        resposta: "Sim. Cada conta acessa apenas os próprios registros, e essa regra é aplicada no banco de dados, não só na tela. A conexão é protegida (HTTPS) e a senha é armazenada de forma criptografada.",
      },
      {
        pergunta: "Serve para quem faz entrega e mototáxi?",
        resposta:
          "Sim. Cada receita é registrada com um tipo (entrega, corrida ou gorjeta) e ligada a quem pagou: aplicativo, central, estabelecimento ou pessoa. Custos como a diária da central entram como despesa, para o saldo mostrar o que de fato sobra.",
      },
      {
        pergunta: "O app está em português?",
        resposta: "Sim. O aplicativo está em português do Brasil. Esta página também está disponível em inglês e espanhol.",
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
    { selo: "WALLETS · PRO", titulo: "Every real in its place.", texto: "Cash in hand, bank account and savings: each wallet with its own balance, plus transfers between them." },
    { selo: "BIKE HEALTH · PRO", titulo: "Your bike warns you before it stops.", texto: "Enter the mileage and see what is fine and what is overdue: oil, tires, chain and brakes." },
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
  recursos: {
    selo: "FEATURES",
    titulo: "Everything the app already does.",
    texto: "From today's balance to the next oil change, with no spreadsheet and no notebook.",
    /** Na ordem dos ícones em Recursos.tsx; os dois últimos são do Pro. */
    itens: [
      { titulo: "Balance up front", texto: "Everything that came in and went out today, this week or this month, with work expenses split from personal ones." },
      { titulo: "Monthly bills", texto: "Rent, internet and installments with due dates, installment count and automatic debit." },
      { titulo: "Alerts in the bell", texto: "Bills about to be due, appointments and deliveries to collect, all in one place." },
      { titulo: "Reports in plain money", texto: "How much you received, how much was left, per day and per delivery, with no confusing percentages." },
      { titulo: "Calendar", texto: "Appointments by day, week and month, with the next one shown on the home screen." },
      { titulo: "Other income", texto: "Salary, scholarship or family help come in without mixing with deliveries." },
      { titulo: "Wallets", texto: "Cash in hand, bank account and savings, each with its own balance." },
      { titulo: "Bike health", texto: "Oil, tires, chain and brakes: the app warns you by mileage when to replace them." },
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
      "Daily, weekly and monthly balance",
      "Goals and monthly bills",
      "Reports, calendar and alerts",
      "Works on your phone like an app",
    ],
    criarMinhaConta: "Create my account",
    emBreve: "In testing",
    itensPro: ["Everything in Free", "Wallets with their own balance", "Bike health (service by mileage)", "App themes"],
    avisaremos: "No charge: request access in the app",
  },
  codigo: {
    selo: "Open source",
    titulo: "Open source, in plain sight.",
    texto: "No Corre!'s code is open and lives on GitHub. Anyone can see how the app is built.",
    botao: "View on GitHub",
    terminal: "Commands to run No Corre! on your computer",
  },
  perguntas: {
    selo: "FAQ",
    titulo: "Frequently asked questions",
    itens: [
      {
        pergunta: "Is No Corre! paid?",
        resposta:
          "No. Everything in the Free plan stays free: revenue, expenses, goals, monthly bills and reports. The Pro plan (wallets, bike health and themes) is in testing and, for now, is unlocked on request at no charge.",
      },
      {
        pergunta: "Do I need to download it from an app store?",
        resposta: "No. No Corre! is an installable web app: open the site in your phone’s browser and tap “Add to Home Screen”. From then on it opens full screen with its own icon, like any other app.",
      },
      {
        pergunta: "Is my data safe?",
        resposta: "Yes. Each account can only access its own records, and this rule is enforced in the database, not just on screen. The connection is secured (HTTPS) and your password is stored encrypted.",
      },
      {
        pergunta: "Does it work for both deliveries and moto taxi?",
        resposta: "Yes. Each revenue entry has a type (delivery, ride or tip) and is linked to who paid: an app, a dispatch hub, a business or a person. Costs such as the hub’s daily fee are recorded as expenses, so the balance shows what is actually left.",
      },
      {
        pergunta: "Is the app in English?",
        resposta: "Not yet. The app itself is in Brazilian Portuguese; this page is also available in English and Spanish.",
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
    { selo: "BILLETERAS · PRO", titulo: "Cada real en su lugar.", texto: "Efectivo, cuenta del banco y ahorro: cada billetera con su propio saldo y las transferencias entre ellas." },
    { selo: "SALUD DE LA MOTO · PRO", titulo: "La moto avisa antes de parar.", texto: "Indica el kilometraje y mira qué está al día y qué ya se pasó: aceite, neumáticos, transmisión y frenos." },
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
  recursos: {
    selo: "FUNCIONES",
    titulo: "Todo lo que la app ya hace.",
    texto: "Del saldo del día al cambio de aceite, sin planilla y sin cuaderno.",
    /** Na ordem dos ícones em Recursos.tsx; os dois últimos são do Pro. */
    itens: [
      { titulo: "Saldo a la vista", texto: "Todo lo que entró y salió en el día, la semana o el mes, con los gastos del trabajo separados de los personales." },
      { titulo: "Cuentas del mes", texto: "Alquiler, internet y cuotas con vencimiento, conteo de cuotas y débito automático." },
      { titulo: "Avisos en la campana", texto: "Cuentas por vencer, compromisos y entregas por cobrar en un solo lugar." },
      { titulo: "Informes en dinero", texto: "Cuánto recibiste, cuánto sobró, por día y por entrega, sin porcentajes difíciles." },
      { titulo: "Agenda", texto: "Compromisos por día, semana y mes, con el próximo recordado en el Inicio." },
      { titulo: "Otros ingresos", texto: "Salario, beca o ayuda de la familia entran sin mezclarse con las entregas." },
      { titulo: "Billeteras", texto: "Efectivo, cuenta del banco y ahorro, cada uno con su propio saldo." },
      { titulo: "Salud de la moto", texto: "Aceite, neumáticos, transmisión y frenos: la app avisa por kilometraje cuándo cambiar." },
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
      "Saldo del día, la semana y el mes",
      "Metas y cuentas del mes",
      "Informes, agenda y avisos",
      "Funciona en el celular como una app",
    ],
    criarMinhaConta: "Crear mi cuenta",
    emBreve: "En pruebas",
    itensPro: ["Todo lo del plan gratis", "Billeteras con saldo propio", "Salud de la moto (cambios por km)", "Temas de la app"],
    avisaremos: "Sin costo: pide acceso en la app",
  },
  codigo: {
    selo: "Código abierto",
    titulo: "Open source, a la vista de todos.",
    texto: "El código de No Corre! es abierto y está en GitHub. Cualquiera puede ver cómo está hecha la app.",
    botao: "Ver en GitHub",
    terminal: "Comandos para ejecutar No Corre! en tu computadora",
  },
  perguntas: {
    selo: "PREGUNTAS",
    titulo: "Preguntas frecuentes",
    itens: [
      {
        pergunta: "¿No Corre! es pago?",
        resposta:
          "No. Todo lo del plan gratis sigue siendo gratuito: ingresos, gastos, metas, cuentas del mes e informes. El plan Pro (billeteras, salud de la moto y temas) está en pruebas y, por ahora, se libera a pedido, sin costo.",
      },
      {
        pergunta: "¿Tengo que descargarla de una tienda de apps?",
        resposta: "No es necesario. No Corre! es una aplicación web instalable: abre el sitio en el navegador del celular y toca “Agregar a la pantalla de inicio”. A partir de ahí se abre en pantalla completa, con su propio ícono, como cualquier app.",
      },
      {
        pergunta: "¿Mis datos están seguros?",
        resposta: "Sí. Cada cuenta accede solo a sus propios registros, y esta regla se aplica en la base de datos, no solo en la pantalla. La conexión está protegida (HTTPS) y la contraseña se guarda cifrada.",
      },
      {
        pergunta: "¿Sirve para quien hace entregas y mototaxi?",
        resposta: "Sí. Cada ingreso se registra con un tipo (entrega, viaje o propina) y se vincula a quien pagó: una app, una central, un comercio o una persona. Costos como la cuota diaria de la central se registran como gasto, para que el saldo muestre lo que realmente queda.",
      },
      {
        pergunta: "¿La app está en español?",
        resposta: "Todavía no. La app está en portugués de Brasil; esta página también está disponible en inglés y español.",
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
