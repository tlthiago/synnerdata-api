import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Employee } from '../../../modules/employees/entities/employee.entity';
import {
  RegimeContratacao,
  GrauInstrucao,
  Sexo,
  EstadoCivil,
  Escala,
  StatusFuncionario,
} from '../../../modules/employees/enums/employees.enum';
import { generateValidCpf } from '../seeds/helpers/cpf.helper';
import {
  ESTADOS_BRASILEIROS,
  CIDADES_POR_ESTADO,
  getRandomElement,
  getRandomBoolean,
  getRandomInt,
} from '../seeds/helpers/brazilian-data.helper';

export const EmployeeFactory = setSeederFactory(Employee, () => {
  const employee = new Employee();

  const sexo = faker.helpers.arrayElement([Sexo.MASCULINO, Sexo.FEMININO]);
  const temFilhos = getRandomBoolean(0.4);
  const estado = getRandomElement(ESTADOS_BRASILEIROS);
  const cidades = CIDADES_POR_ESTADO[estado] || ['Capital'];
  const cidade = getRandomElement(cidades);

  // Dados pessoais
  employee.nome =
    sexo === Sexo.MASCULINO
      ? faker.person.fullName({ sex: 'male' })
      : faker.person.fullName({ sex: 'female' });
  employee.carteiraIdentidade = faker.string.numeric(9);
  employee.cpf = generateValidCpf();
  employee.sexo = sexo;
  employee.dataNascimento = faker.date.birthdate({
    min: 18,
    max: 65,
    mode: 'age',
  });
  employee.estadoCivil = faker.helpers.arrayElement(Object.values(EstadoCivil));
  employee.naturalidade = cidade;
  employee.nacionalidade = 'Brasileira';
  employee.altura = parseFloat(
    faker.number.float({ min: 1.5, max: 2.0, fractionDigits: 2 }).toFixed(2),
  );
  employee.peso = parseFloat(
    faker.number.float({ min: 50, max: 120, fractionDigits: 2 }).toFixed(2),
  );
  employee.nomePai = getRandomBoolean(0.8)
    ? faker.person.fullName({ sex: 'male' })
    : undefined;
  employee.nomeMae = faker.person.fullName({ sex: 'female' });
  employee.email = faker.internet.email().toLowerCase();

  // Documentos
  employee.pis = faker.string.numeric(11);
  employee.ctpsNumero = faker.string.numeric(7);
  employee.ctpsSerie = faker.string.numeric(4);
  employee.certificadoReservista =
    sexo === Sexo.MASCULINO ? faker.string.numeric(12) : '000000000000';

  // Contato
  employee.telefone =
    faker.helpers.maybe(() =>
      faker.string.numeric({ length: 10, allowLeadingZeros: true }),
    ) || undefined;
  employee.celular = faker.string.numeric({
    length: 11,
    allowLeadingZeros: true,
  });

  // Endereço
  employee.rua = faker.location.street();
  employee.numero = faker.location.buildingNumber();
  employee.complemento =
    faker.helpers.maybe(() => faker.location.secondaryAddress()) || undefined;
  employee.bairro = faker.location.county();
  employee.cidade = cidade;
  employee.estado = estado;
  employee.cep = faker.string.numeric(8);
  employee.latitude = getRandomBoolean(0.3)
    ? parseFloat(faker.location.latitude().toFixed(6))
    : undefined;
  employee.longitude = getRandomBoolean(0.3)
    ? parseFloat(faker.location.longitude().toFixed(6))
    : undefined;

  // Dados profissionais
  employee.regimeContratacao = faker.helpers.arrayElement(
    Object.values(RegimeContratacao),
  );
  employee.dataAdmissao = faker.date.past({ years: 5 });
  employee.salario = parseFloat(
    faker.finance.amount({ min: 1500, max: 15000, dec: 2 }),
  );
  employee.grauInstrucao = faker.helpers.arrayElement(
    Object.values(GrauInstrucao),
  );
  employee.gestor = faker.person.fullName();

  // Datas opcionais
  employee.dataUltimoASO = getRandomBoolean(0.7)
    ? faker.date.past({ years: 1 })
    : undefined;
  employee.vencimentoExperiencia1 = getRandomBoolean(0.5)
    ? faker.date.past({ years: 4 })
    : undefined;
  employee.vencimentoExperiencia2 = getRandomBoolean(0.5)
    ? faker.date.past({ years: 4 })
    : undefined;
  employee.dataExameAdmissional = getRandomBoolean(0.8)
    ? faker.date.past({ years: 5 })
    : undefined;

  // Dados especiais
  employee.necessidadesEspeciais = getRandomBoolean(0.05);
  employee.tipoDeficiencia = employee.necessidadesEspeciais
    ? faker.helpers.arrayElement([
        'Física',
        'Visual',
        'Auditiva',
        'Mental',
        'Múltipla',
      ])
    : undefined;

  // Filhos
  employee.filhos = temFilhos;
  employee.quantidadeFilhos = temFilhos ? getRandomInt(1, 4) : undefined;
  employee.filhosAbaixoDe21 = temFilhos ? getRandomBoolean(0.6) : undefined;

  // Operacional
  employee.quantidadeOnibus = getRandomInt(0, 4);
  employee.cargaHoraria = faker.helpers.arrayElement([40, 44, 36, 30, 20]);
  employee.escala = faker.helpers.arrayElement(Object.values(Escala));
  employee.valorAlimentacao = parseFloat(
    faker.finance.amount({ min: 0, max: 800, dec: 2 }),
  );
  employee.valorTransporte = parseFloat(
    faker.finance.amount({ min: 0, max: 400, dec: 2 }),
  );
  employee.statusFuncionario = StatusFuncionario.ATIVO;
  employee.status = 'A';

  return employee;
});
