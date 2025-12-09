import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Company } from '../../../modules/companies/entities/company.entity';
import { generateValidCnpj } from '../seeds/helpers/cnpj.helper';
import {
  ESTADOS_BRASILEIROS,
  CIDADES_POR_ESTADO,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const CompanyFactory = setSeederFactory(Company, () => {
  const company = new Company();

  const estado = getRandomElement(ESTADOS_BRASILEIROS);
  const cidades = CIDADES_POR_ESTADO[estado] || ['Capital'];
  const cidade = getRandomElement(cidades);

  company.nomeFantasia = faker.company.name();
  company.razaoSocial = `${faker.company.name()} LTDA`;
  company.cnpj = generateValidCnpj();
  company.rua = faker.location.street();
  company.numero = faker.location.buildingNumber();
  company.complemento =
    faker.helpers.maybe(() => faker.location.secondaryAddress()) || undefined;
  company.bairro = faker.location.county();
  company.cidade = cidade;
  company.estado = estado;
  company.cep = faker.string.numeric(8);
  company.dataFundacao = faker.date.past({ years: 20 });
  company.email = faker.internet.email().toLowerCase();
  company.telefone = faker.string.numeric({
    length: 10,
    allowLeadingZeros: true,
  });
  company.celular = faker.string.numeric({
    length: 11,
    allowLeadingZeros: true,
  });
  company.faturamento = parseFloat(
    faker.finance.amount({ min: 100000, max: 10000000, dec: 2 }),
  );
  company.regimeTributario = faker.helpers.arrayElement([
    'Simples Nacional',
    'Lucro Presumido',
    'Lucro Real',
  ]);
  company.inscricaoEstadual = faker.string.numeric(12);
  company.cnaePrincipal = faker.string.numeric(7);
  company.segmento = faker.helpers.arrayElement([
    'Construção Civil',
    'Indústria',
    'Serviços',
    'Comércio',
    'Tecnologia',
  ]);
  company.ramoAtuacao = faker.helpers.arrayElement([
    'Edificações',
    'Infraestrutura',
    'Manutenção Industrial',
    'Consultoria',
    'Comércio Varejista',
  ]);
  company.quantidadeUsuarios = faker.number.int({ min: 4, max: 10 });
  company.quantidadeFuncionarios = faker.number.int({ min: 20, max: 100 });
  company.plano = faker.helpers.arrayElement([
    'Básico',
    'Profissional',
    'Enterprise',
  ]);
  company.status = 'A';

  return company;
});
