import { setSeederFactory } from 'typeorm-extension';
import { CostCenter } from '../../../modules/cost-centers/entities/cost-center.entity';
import {
  CENTROS_DE_CUSTO_COMUNS,
  getRandomElement,
} from '../seeds/helpers/brazilian-data.helper';

export const CostCenterFactory = setSeederFactory(CostCenter, () => {
  const costCenter = new CostCenter();

  costCenter.nome = getRandomElement(CENTROS_DE_CUSTO_COMUNS);
  costCenter.status = 'A';

  return costCenter;
});
