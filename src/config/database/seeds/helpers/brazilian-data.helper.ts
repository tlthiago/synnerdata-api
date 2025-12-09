/**
 * Dados brasileiros para geração de seeds
 */

export const ESTADOS_BRASILEIROS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

export const CIDADES_POR_ESTADO: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'Sorocaba'],
  RJ: [
    'Rio de Janeiro',
    'Niterói',
    'Petrópolis',
    'Nova Iguaçu',
    'Duque de Caxias',
  ],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau', 'Chapecó', 'Itajaí'],
  BA: [
    'Salvador',
    'Feira de Santana',
    'Vitória da Conquista',
    'Camaçari',
    'Itabuna',
  ],
  PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'],
  CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Sobral'],
  GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Luziânia'],
  DF: ['Brasília', 'Ceilândia', 'Taguatinga', 'Samambaia', 'Plano Piloto'],
};

export const CBOS_COMUNS = [
  'Auxiliar Administrativo',
  'Analista de Sistemas',
  'Engenheiro Civil',
  'Técnico de Segurança do Trabalho',
  'Operador de Produção',
  'Eletricista',
  'Mecânico Industrial',
  'Motorista',
  'Pedreiro',
  'Carpinteiro',
  'Pintor',
  'Soldador',
  'Almoxarife',
  'Assistente de RH',
  'Contador',
  'Analista Financeiro',
  'Vendedor',
  'Recepcionista',
  'Auxiliar de Limpeza',
  'Vigilante',
];

export const CARGOS_COMUNS = [
  'Auxiliar Administrativo',
  'Assistente Administrativo',
  'Analista Jr',
  'Analista Pleno',
  'Analista Sênior',
  'Coordenador',
  'Gerente',
  'Supervisor',
  'Técnico',
  'Operador',
  'Ajudante',
  'Encarregado',
];

export const SETORES_COMUNS = [
  'Administrativo',
  'Financeiro',
  'Recursos Humanos',
  'Produção',
  'Logística',
  'Comercial',
  'TI',
  'Manutenção',
  'Qualidade',
  'Segurança do Trabalho',
];

export const CENTROS_DE_CUSTO_COMUNS = [
  'Administrativo',
  'Operacional',
  'Comercial',
  'Projetos',
  'Manutenção',
];

export const EPIS_COMUNS = [
  {
    nome: 'Capacete de Segurança',
    descricao: 'Proteção para a cabeça contra impactos',
    equipamentos: 'Capacete classe A/B',
  },
  {
    nome: 'Óculos de Proteção',
    descricao: 'Proteção ocular contra partículas',
    equipamentos: 'Óculos ampla visão',
  },
  {
    nome: 'Luva de Segurança',
    descricao: 'Proteção para as mãos',
    equipamentos: 'Luva de vaqueta/nitrílica',
  },
  {
    nome: 'Botina de Segurança',
    descricao: 'Proteção para os pés',
    equipamentos: 'Botina com biqueira de aço',
  },
  {
    nome: 'Protetor Auricular',
    descricao: 'Proteção auditiva',
    equipamentos: 'Protetor tipo plug/concha',
  },
  {
    nome: 'Cinto de Segurança',
    descricao: 'Proteção contra quedas',
    equipamentos: 'Cinto paraquedista',
  },
  {
    nome: 'Máscara Respiratória',
    descricao: 'Proteção respiratória',
    equipamentos: 'Máscara PFF2/N95',
  },
  {
    nome: 'Avental de Segurança',
    descricao: 'Proteção do tronco',
    equipamentos: 'Avental de raspa',
  },
  {
    nome: 'Uniforme',
    descricao: 'Vestimenta de trabalho',
    equipamentos: 'Calça e camisa manga longa',
  },
  {
    nome: 'Colete Refletivo',
    descricao: 'Visibilidade em ambientes externos',
    equipamentos: 'Colete refletivo laranja',
  },
];

export const TRIBUNAIS_TRABALHISTAS = [
  'TRT 1ª Região - Rio de Janeiro',
  'TRT 2ª Região - São Paulo',
  'TRT 3ª Região - Minas Gerais',
  'TRT 4ª Região - Rio Grande do Sul',
  'TRT 5ª Região - Bahia',
  'TRT 6ª Região - Pernambuco',
  'TRT 9ª Região - Paraná',
  'TRT 12ª Região - Santa Catarina',
  'TRT 15ª Região - Campinas',
];

export const MOTIVOS_FALTA = [
  'Falta injustificada',
  'Problemas pessoais',
  'Atraso no transporte',
  'Compromisso familiar',
  'Sem justificativa',
];

export const MOTIVOS_ATESTADO = [
  'Consulta médica',
  'Exames laboratoriais',
  'Procedimento cirúrgico',
  'Acompanhamento médico',
  'Tratamento de saúde',
];

export const MOTIVOS_ADVERTENCIA = [
  'Atraso recorrente',
  'Descumprimento de normas',
  'Uso inadequado de EPI',
  'Conduta inadequada',
  'Desrespeito hierárquico',
];

export const FORMAS_DEMISSAO = [
  'Pedido de demissão',
  'Demissão sem justa causa',
  'Demissão por justa causa',
  'Acordo entre as partes',
  'Término de contrato',
];

export const MOTIVOS_DEMISSAO_INTERNO = [
  'Redução de quadro',
  'Desempenho insatisfatório',
  'Reestruturação organizacional',
  'Pedido do colaborador',
  'Fim de projeto',
];

export const MOTIVOS_DEMISSAO_TRABALHISTA = [
  'Dispensa imotivada',
  'Acordo mútuo',
  'Pedido de demissão',
  'Justa causa - Art. 482 CLT',
  'Término de contrato por prazo determinado',
];

export const NATUREZAS_ACIDENTE = [
  'Acidente típico',
  'Acidente de trajeto',
  'Doença ocupacional',
  'Acidente com material biológico',
  'Queda',
];

export const MEDIDAS_ACIDENTE = [
  'Primeiros socorros aplicados',
  'Encaminhamento ao hospital',
  'Afastamento temporário',
  'Investigação do acidente',
  'Treinamento de reciclagem',
];

export const MOTIVOS_ENTREGA_EPI = [
  'Admissão',
  'Substituição por desgaste',
  'Troca de função',
  'Perda/extravio',
  'Vencimento da validade',
];

export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}
