import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { LaborAction } from '../../../modules/labor-actions/entities/labor-action.entity';
import {
  TRIBUNAIS_TRABALHISTAS,
  getRandomElement,
  getRandomBoolean,
} from '../seeds/helpers/brazilian-data.helper';

export const LaborActionFactory = setSeederFactory(LaborAction, () => {
  const laborAction = new LaborAction();

  const dataAjuizamento = faker.date.past({ years: 3 });
  const isConcluido = getRandomBoolean(0.3);

  laborAction.numeroProcesso = `${faker.string.numeric(7)}-${faker.string.numeric(2)}.${faker.string.numeric(4)}.${faker.string.numeric(1)}.${faker.string.numeric(2)}.${faker.string.numeric(4)}`;
  laborAction.tribunal = getRandomElement(TRIBUNAIS_TRABALHISTAS);
  laborAction.dataAjuizamento = dataAjuizamento;
  laborAction.reclamante = faker.person.fullName();
  laborAction.reclamado = faker.company.name();
  laborAction.advogadoReclamante = getRandomBoolean(0.8)
    ? faker.person.fullName()
    : undefined;
  laborAction.advogadoReclamado = getRandomBoolean(0.9)
    ? faker.person.fullName()
    : undefined;
  laborAction.descricao = faker.lorem.paragraph();
  laborAction.valorCausa = getRandomBoolean(0.8)
    ? parseFloat(faker.finance.amount({ min: 5000, max: 200000, dec: 2 }))
    : undefined;
  laborAction.andamento = getRandomBoolean(0.7)
    ? faker.helpers.arrayElement([
        'Aguardando audiência',
        'Em fase de instrução',
        'Aguardando sentença',
        'Em recurso',
        'Transitado em julgado',
      ])
    : undefined;
  laborAction.decisao = isConcluido
    ? faker.helpers.arrayElement([
        'Procedente',
        'Parcialmente procedente',
        'Improcedente',
        'Acordo homologado',
      ])
    : undefined;
  laborAction.dataConclusao = isConcluido
    ? faker.date.between({ from: dataAjuizamento, to: new Date() })
    : undefined;
  laborAction.recursos = getRandomBoolean(0.3)
    ? faker.helpers.arrayElement([
        'Recurso Ordinário',
        'Recurso de Revista',
        'Embargos de Declaração',
      ])
    : undefined;
  laborAction.custasDespesas = getRandomBoolean(0.5)
    ? parseFloat(faker.finance.amount({ min: 500, max: 10000, dec: 2 }))
    : undefined;
  laborAction.dataConhecimento = faker.date.between({
    from: dataAjuizamento,
    to: new Date(),
  });
  laborAction.status = 'A';

  return laborAction;
});
