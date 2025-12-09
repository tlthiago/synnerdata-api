import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { CpfAnalysis } from '../../../modules/cpf-analysis/entities/cpf-analysis.entity';

export const CpfAnalysisFactory = setSeederFactory(CpfAnalysis, () => {
  const cpfAnalysis = new CpfAnalysis();

  cpfAnalysis.descricao = faker.helpers.arrayElement([
    'CPF regular - sem pendências',
    'CPF regular - consulta realizada',
    'CPF com restrições financeiras',
    'CPF suspenso temporariamente',
    'Análise concluída - aprovado',
  ]);
  cpfAnalysis.status = 'A';

  return cpfAnalysis;
});
