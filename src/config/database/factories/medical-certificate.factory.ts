import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { MedicalCertificate } from '../../../modules/medical-certificate/entities/medical-certificate.entity';
import {
  MOTIVOS_ATESTADO,
  getRandomElement,
  getRandomBoolean,
} from '../seeds/helpers/brazilian-data.helper';

export const MedicalCertificateFactory = setSeederFactory(
  MedicalCertificate,
  () => {
    const medicalCertificate = new MedicalCertificate();

    const dataInicio = faker.date.past({ years: 2 });
    const diasAfastamento = faker.helpers.arrayElement([1, 2, 3, 5, 7, 15, 30]);
    const dataFim = new Date(dataInicio);
    dataFim.setDate(dataFim.getDate() + diasAfastamento);

    medicalCertificate.dataInicio = dataInicio;
    medicalCertificate.dataFim = dataFim;
    medicalCertificate.motivo = getRandomElement(MOTIVOS_ATESTADO);
    medicalCertificate.cid = getRandomBoolean(0.7)
      ? faker.helpers.arrayElement(['J11', 'M54', 'K29', 'R51', 'S93', 'Z00'])
      : undefined;
    medicalCertificate.status = 'A';

    return medicalCertificate;
  },
);
