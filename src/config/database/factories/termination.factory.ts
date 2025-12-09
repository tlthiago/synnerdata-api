import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Termination } from '../../../modules/terminations/entities/termination.entity';
import {
  FORMAS_DEMISSAO,
  MOTIVOS_DEMISSAO_INTERNO,
  MOTIVOS_DEMISSAO_TRABALHISTA,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const TerminationFactory = setSeederFactory(Termination, () => {
  const termination = new Termination();

  termination.data = faker.date.past({ years: 2 });
  termination.motivoInterno = getRandomElement(MOTIVOS_DEMISSAO_INTERNO);
  termination.motivoTrabalhista = getRandomElement(
    MOTIVOS_DEMISSAO_TRABALHISTA,
  );
  termination.acaoTrabalhista = faker.helpers.arrayElement([
    'Não',
    'Sim - Em andamento',
    'Sim - Encerrada',
  ]);
  termination.formaDemissao = getRandomElement(FORMAS_DEMISSAO);
  termination.status = 'A';

  return termination;
});
