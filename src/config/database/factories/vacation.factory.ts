import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { Vacation } from '../../../modules/vacations/entities/vacation.entity';

export const VacationFactory = setSeederFactory(Vacation, () => {
  const vacation = new Vacation();

  const dataInicio = faker.date.past({ years: 2 });
  const diasFerias = faker.helpers.arrayElement([10, 15, 20, 30]);
  const dataFim = new Date(dataInicio);
  dataFim.setDate(dataFim.getDate() + diasFerias);

  vacation.dataInicio = dataInicio;
  vacation.dataFim = dataFim;
  vacation.status = 'A';

  return vacation;
});
