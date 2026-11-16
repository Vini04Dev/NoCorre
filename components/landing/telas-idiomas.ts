import type { Idioma } from "./idiomas";

/**
 * Textos das telas de celular desenhadas na landing (MockupCelular), nos três
 * idiomas. O app em si só existe em português; aqui as telas acompanham o
 * idioma da página para o visitante entender o que está vendo. Valores ficam
 * em reais em todos os idiomas, como no app.
 */
const pt = {
  entrar: {
    lema: "De Entregador para Entregador",
    entrar: "Entrar",
    cadastrar: "Cadastrar",
    email: "E-mail",
    senha: "Senha",
    bemVindo: "Bem-vindo, Parceiro!",
  },
  saldo: {
    ola: "SEJA BEM VINDO PARCEIRO!",
    bora: "Bora pro corre!?",
    meuSaldo: "MEU SALDO",
    semana: "Esta semana",
    linhas: ["SALDO", "RECEBIDOS", "PENDENTES", "DESPESAS", "ENTREGAS"],
    doCorre: "Do corre",
    pessoais: "Pessoais",
  },
  lancamento: {
    titulo: "Nova receita",
    tipo: "Tipo",
    tipos: ["Entrega", "Corrida", "Gorjeta"],
    cliente: "Cliente",
    quantidade: "Quantidade",
    valor: "Valor",
    total: "Total",
    salvar: "Salvar receita",
    salvo: "Salvo!",
  },
  meta: {
    titulo: "Metas",
    daSemana: "Meta da semana",
    de: "de",
    faltam: ["Faltam ", " em 2 dias"],
    entregasMes: "700 entregas no mês",
  },
  conta: {
    titulo: "Contas do mês",
    subtitulo: "Financiamento da moto · parcela 8 de 24",
    pago: "Pago",
    de: "de",
    falta: "Falta R$ 154 · vence em 6 dias",
    outras: "OUTRAS CONTAS",
    contas: [
      ["Internet", "vence em 3 dias"],
      ["Celular", "débito automático"],
    ],
    lancar: "Lançar pagamento",
  },
  carteiras: {
    titulo: "Carteiras",
    tenhoAgora: "TENHO AGORA",
    somando: "Somando as 3 carteiras",
    nomes: ["Dinheiro", "Conta do banco", "Reserva"],
    transferencia: "Transferência",
  },
  moto: {
    titulo: "Saúde da moto",
    odometro: "Odômetro",
    pecas: ["Óleo do motor", "Pneus", "Relação", "Freios"],
    estados: ["Em dia", "Em dia", "Fique de olho", "Passou da hora"],
    aviso: "Freios: hora de trocar",
  },
};

export type TextosTelas = typeof pt;

const en: TextosTelas = {
  entrar: {
    lema: "By riders, for riders",
    entrar: "Sign in",
    cadastrar: "Sign up",
    email: "Email",
    senha: "Password",
    bemVindo: "Welcome, partner!",
  },
  saldo: {
    ola: "WELCOME, PARTNER!",
    bora: "Ready to ride?",
    meuSaldo: "MY BALANCE",
    semana: "This week",
    linhas: ["BALANCE", "RECEIVED", "PENDING", "EXPENSES", "DELIVERIES"],
    doCorre: "Work",
    pessoais: "Personal",
  },
  lancamento: {
    titulo: "New revenue",
    tipo: "Type",
    tipos: ["Delivery", "Ride", "Tip"],
    cliente: "Client",
    quantidade: "Quantity",
    valor: "Price",
    total: "Total",
    salvar: "Save revenue",
    salvo: "Saved!",
  },
  meta: {
    titulo: "Goals",
    daSemana: "Weekly goal",
    de: "of",
    faltam: ["", " to go in 2 days"],
    entregasMes: "700 deliveries this month",
  },
  conta: {
    titulo: "Monthly bills",
    subtitulo: "Motorcycle loan · installment 8 of 24",
    pago: "Paid",
    de: "of",
    falta: "R$ 154 left · due in 6 days",
    outras: "OTHER BILLS",
    contas: [
      ["Internet", "due in 3 days"],
      ["Phone", "automatic debit"],
    ],
    lancar: "Record payment",
  },
  carteiras: {
    titulo: "Wallets",
    tenhoAgora: "I HAVE NOW",
    somando: "Adding up 3 wallets",
    nomes: ["Cash", "Bank account", "Savings"],
    transferencia: "Transfer",
  },
  moto: {
    titulo: "Bike health",
    odometro: "Odometer",
    pecas: ["Engine oil", "Tires", "Chain kit", "Brakes"],
    estados: ["OK", "OK", "Keep an eye", "Overdue"],
    aviso: "Brakes: time to replace",
  },
};

const es: TextosTelas = {
  entrar: {
    lema: "De repartidor a repartidor",
    entrar: "Entrar",
    cadastrar: "Registrarse",
    email: "Correo",
    senha: "Contraseña",
    bemVindo: "¡Bienvenido, compañero!",
  },
  saldo: {
    ola: "¡BIENVENIDO, COMPAÑERO!",
    bora: "¿Salimos a rodar?",
    meuSaldo: "MI SALDO",
    semana: "Esta semana",
    linhas: ["SALDO", "RECIBIDOS", "PENDIENTES", "GASTOS", "ENTREGAS"],
    doCorre: "Del trabajo",
    pessoais: "Personales",
  },
  lancamento: {
    titulo: "Nuevo ingreso",
    tipo: "Tipo",
    tipos: ["Entrega", "Viaje", "Propina"],
    cliente: "Cliente",
    quantidade: "Cantidad",
    valor: "Valor",
    total: "Total",
    salvar: "Guardar ingreso",
    salvo: "¡Guardado!",
  },
  meta: {
    titulo: "Metas",
    daSemana: "Meta de la semana",
    de: "de",
    faltam: ["Faltan ", " en 2 días"],
    entregasMes: "700 entregas en el mes",
  },
  conta: {
    titulo: "Cuentas del mes",
    subtitulo: "Financiación de la moto · cuota 8 de 24",
    pago: "Pagado",
    de: "de",
    falta: "Faltan R$ 154 · vence en 6 días",
    outras: "OTRAS CUENTAS",
    contas: [
      ["Internet", "vence en 3 días"],
      ["Celular", "débito automático"],
    ],
    lancar: "Registrar pago",
  },
  carteiras: {
    titulo: "Billeteras",
    tenhoAgora: "TENGO AHORA",
    somando: "Sumando las 3 billeteras",
    nomes: ["Efectivo", "Cuenta del banco", "Ahorro"],
    transferencia: "Transferencia",
  },
  moto: {
    titulo: "Salud de la moto",
    odometro: "Odómetro",
    pecas: ["Aceite del motor", "Neumáticos", "Transmisión", "Frenos"],
    estados: ["Al día", "Al día", "Atento", "Se pasó"],
    aviso: "Frenos: hora de cambiar",
  },
};

export const TEXTOS_TELAS: Record<Idioma, TextosTelas> = { pt, en, es };
