import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

import { User, Funcao } from '../../../modules/users/entities/user.entity';
import { Company } from '../../../modules/companies/entities/company.entity';
import { Branch } from '../../../modules/branches/entities/branch.entity';
import { Department } from '../../../modules/departments/entities/department.entity';
import { CostCenter } from '../../../modules/cost-centers/entities/cost-center.entity';
import { Cbo } from '../../../modules/cbos/entities/cbo.entity';
import { Role } from '../../../modules/roles/entities/role.entity';
import { Epi } from '../../../modules/epis/entities/epi.entity';
import { Project } from '../../../modules/projects/entities/project.entity';
import { Employee } from '../../../modules/employees/entities/employee.entity';
import { Absence } from '../../../modules/absence/entities/absence.entity';
import { Vacation } from '../../../modules/vacations/entities/vacation.entity';
import { MedicalCertificate } from '../../../modules/medical-certificate/entities/medical-certificate.entity';
import { Promotion } from '../../../modules/promotion/entities/promotion.entity';
import { Termination } from '../../../modules/terminations/entities/termination.entity';
import { Accident } from '../../../modules/accidents/entities/accident.entity';
import { Warning } from '../../../modules/warnings/entities/warning.entity';
import { LaborAction } from '../../../modules/labor-actions/entities/labor-action.entity';
import { EpiDelivery } from '../../../modules/epi-delivery/entities/epi-delivery.entity';
import { CpfAnalysis } from '../../../modules/cpf-analysis/entities/cpf-analysis.entity';
import { StatusFuncionario } from '../../../modules/employees/enums/employees.enum';

import {
  getRandomInt,
  getRandomBoolean,
  getRandomElements,
  SETORES_COMUNS,
  CENTROS_DE_CUSTO_COMUNS,
  CBOS_COMUNS,
  CARGOS_COMUNS,
  EPIS_COMUNS,
} from './helpers';

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('🌱 Iniciando seed do banco de dados...\n');

    // Repositories
    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);
    const branchRepository = dataSource.getRepository(Branch);
    const departmentRepository = dataSource.getRepository(Department);
    const costCenterRepository = dataSource.getRepository(CostCenter);
    const cboRepository = dataSource.getRepository(Cbo);
    const roleRepository = dataSource.getRepository(Role);
    const epiRepository = dataSource.getRepository(Epi);
    const projectRepository = dataSource.getRepository(Project);
    const employeeRepository = dataSource.getRepository(Employee);
    const absenceRepository = dataSource.getRepository(Absence);
    const vacationRepository = dataSource.getRepository(Vacation);
    const medicalCertificateRepository =
      dataSource.getRepository(MedicalCertificate);
    const promotionRepository = dataSource.getRepository(Promotion);
    const terminationRepository = dataSource.getRepository(Termination);
    const accidentRepository = dataSource.getRepository(Accident);
    const warningRepository = dataSource.getRepository(Warning);
    const laborActionRepository = dataSource.getRepository(LaborAction);
    const epiDeliveryRepository = dataSource.getRepository(EpiDelivery);
    const cpfAnalysisRepository = dataSource.getRepository(CpfAnalysis);

    // Factories
    const userFactory = factoryManager.get(User);
    const companyFactory = factoryManager.get(Company);
    const branchFactory = factoryManager.get(Branch);
    const departmentFactory = factoryManager.get(Department);
    const costCenterFactory = factoryManager.get(CostCenter);
    const cboFactory = factoryManager.get(Cbo);
    const roleFactory = factoryManager.get(Role);
    const epiFactory = factoryManager.get(Epi);
    const projectFactory = factoryManager.get(Project);
    const employeeFactory = factoryManager.get(Employee);
    const absenceFactory = factoryManager.get(Absence);
    const vacationFactory = factoryManager.get(Vacation);
    const medicalCertificateFactory = factoryManager.get(MedicalCertificate);
    const promotionFactory = factoryManager.get(Promotion);
    const terminationFactory = factoryManager.get(Termination);
    const accidentFactory = factoryManager.get(Accident);
    const warningFactory = factoryManager.get(Warning);
    const laborActionFactory = factoryManager.get(LaborAction);
    const epiDeliveryFactory = factoryManager.get(EpiDelivery);
    const cpfAnalysisFactory = factoryManager.get(CpfAnalysis);

    // ==========================================
    // NÍVEL 1: Criar SUPER_ADMIN
    // ==========================================
    console.log('👤 Verificando usuário SUPER_ADMIN...');
    let superAdmin = await userRepository.findOne({
      where: { email: 'superadmin@seed.com' },
    });
    if (!superAdmin) {
      superAdmin = userRepository.create({
        nome: 'Super Admin Seed',
        email: 'superadmin@seed.com',
        senha: bcrypt.hashSync('Seed@123', 10),
        funcao: Funcao.SUPER_ADMIN,
        primeiroAcesso: false,
        status: 'A',
      });
      await userRepository.save(superAdmin);
      console.log(`   ✅ SUPER_ADMIN criado: ${superAdmin.email}`);
    } else {
      console.log(`   ⏭️  SUPER_ADMIN já existe: ${superAdmin.email}`);
    }

    // ==========================================
    // NÍVEL 2: Criar Companies
    // ==========================================
    console.log('🏢 Verificando empresas...');
    const companies = await companyRepository.find({
      where: { status: 'A' },
      take: 2,
    });

    if (companies.length < 2) {
      const numToCreate = 2 - companies.length;
      console.log(`   📝 Criando ${numToCreate} empresa(s)...`);
      for (let i = 0; i < numToCreate; i++) {
        const company = await companyFactory.make();
        await companyRepository.save(company);
        companies.push(company);
        console.log(`   ✅ Empresa criada: ${company.nomeFantasia}`);
      }
    } else {
      console.log(`   ⏭️  ${companies.length} empresas já existem`);
      companies.forEach((c) => console.log(`      - ${c.nomeFantasia}`));
    }

    // Criar usuário ADMIN vinculado à primeira empresa
    console.log('\n👤 Verificando usuário ADMIN...');
    let adminUser = await userRepository.findOne({
      where: { email: 'admin@seed.com' },
    });
    if (!adminUser) {
      adminUser = userRepository.create({
        nome: 'Admin Seed',
        email: 'admin@seed.com',
        senha: bcrypt.hashSync('Admin@123', 10),
        funcao: Funcao.ADMIN,
        primeiroAcesso: false,
        status: 'A',
        empresa: companies[0].id, // Vincula à primeira empresa
      });
      await userRepository.save(adminUser);
      console.log(`   ✅ ADMIN criado: ${adminUser.email}`);
      console.log(`   📌 Vinculado à empresa: ${companies[0].nomeFantasia}\n`);
    } else {
      // Atualiza a empresa do admin se não estiver vinculado
      if (!adminUser.empresa) {
        adminUser.empresa = companies[0].id;
        await userRepository.save(adminUser);
        console.log(`   ⏭️  ADMIN já existe: ${adminUser.email}`);
        console.log(
          `   📌 Vinculado à empresa: ${companies[0].nomeFantasia}\n`,
        );
      } else {
        console.log(`   ⏭️  ADMIN já existe: ${adminUser.email}\n`);
      }
    }
    console.log('');

    // ==========================================
    // Para cada empresa, criar estrutura completa
    // ==========================================
    for (const company of companies) {
      console.log(`\n📦 Populando empresa: ${company.nomeFantasia}`);
      console.log('─'.repeat(50));

      // NÍVEL 3: Estrutura organizacional
      // ------------------------------------------

      // Branches
      console.log('   🏬 Criando filiais...');
      const branches: Branch[] = [];
      const numBranches = getRandomInt(1, 2);
      for (let i = 0; i < numBranches; i++) {
        const branch = await branchFactory.make();
        branch.empresa = company;
        branch.criadoPor = superAdmin;
        await branchRepository.save(branch);
        branches.push(branch);
      }
      console.log(`      ✅ ${branches.length} filiais criadas`);

      // Departments
      console.log('   🏷️ Criando setores...');
      const departments: Department[] = [];
      const usedSetores = new Set<string>();
      for (const nome of getRandomElements(
        SETORES_COMUNS,
        getRandomInt(3, 4),
      )) {
        if (!usedSetores.has(nome)) {
          usedSetores.add(nome);
          const department = await departmentFactory.make();
          department.nome = nome;
          department.empresa = company;
          department.criadoPor = superAdmin;
          await departmentRepository.save(department);
          departments.push(department);
        }
      }
      console.log(`      ✅ ${departments.length} setores criados`);

      // Cost Centers
      console.log('   💰 Criando centros de custo...');
      const costCenters: CostCenter[] = [];
      const usedCentros = new Set<string>();
      for (const nome of getRandomElements(
        CENTROS_DE_CUSTO_COMUNS,
        getRandomInt(2, 3),
      )) {
        if (!usedCentros.has(nome)) {
          usedCentros.add(nome);
          const costCenter = await costCenterFactory.make();
          costCenter.nome = nome;
          costCenter.empresa = company;
          costCenter.criadoPor = superAdmin;
          await costCenterRepository.save(costCenter);
          costCenters.push(costCenter);
        }
      }
      console.log(`      ✅ ${costCenters.length} centros de custo criados`);

      // CBOs
      console.log('   📋 Criando CBOs...');
      const cbos: Cbo[] = [];
      const usedCbos = new Set<string>();
      for (const nome of getRandomElements(CBOS_COMUNS, getRandomInt(5, 8))) {
        if (!usedCbos.has(nome)) {
          usedCbos.add(nome);
          const cbo = await cboFactory.make();
          cbo.nome = nome;
          cbo.empresa = company;
          cbo.criadoPor = superAdmin;
          await cboRepository.save(cbo);
          cbos.push(cbo);
        }
      }
      console.log(`      ✅ ${cbos.length} CBOs criados`);

      // Roles
      console.log('   👔 Criando funções/cargos...');
      const roles: Role[] = [];
      const usedCargos = new Set<string>();
      for (const nome of getRandomElements(CARGOS_COMUNS, getRandomInt(4, 6))) {
        if (!usedCargos.has(nome)) {
          usedCargos.add(nome);
          const role = await roleFactory.make();
          role.nome = nome;
          role.empresa = company;
          role.criadoPor = superAdmin;
          await roleRepository.save(role);
          roles.push(role);
        }
      }
      console.log(`      ✅ ${roles.length} funções criadas`);

      // EPIs
      console.log('   🦺 Criando EPIs...');
      const epis: Epi[] = [];
      const usedEpis = new Set<string>();
      for (const epiData of getRandomElements(
        EPIS_COMUNS,
        getRandomInt(6, 10),
      )) {
        if (!usedEpis.has(epiData.nome)) {
          usedEpis.add(epiData.nome);
          const epi = await epiFactory.make();
          epi.nome = epiData.nome;
          epi.descricao = epiData.descricao;
          epi.equipamentos = epiData.equipamentos;
          epi.empresa = company;
          epi.criadoPor = superAdmin;
          await epiRepository.save(epi);
          epis.push(epi);
        }
      }
      console.log(`      ✅ ${epis.length} EPIs criados`);

      // Projects
      console.log('   📁 Criando projetos...');
      const projects: Project[] = [];
      const numProjects = getRandomInt(1, 2);
      for (let i = 0; i < numProjects; i++) {
        const project = await projectFactory.make();
        project.empresa = company;
        project.criadoPor = superAdmin;
        await projectRepository.save(project);
        projects.push(project);
      }
      console.log(`      ✅ ${projects.length} projetos criados`);

      // Users da empresa
      console.log('   👥 Criando usuários da empresa...');
      const companyUsers: User[] = [superAdmin];
      const numUsers = getRandomInt(2, 3);
      for (let i = 0; i < numUsers; i++) {
        const user = await userFactory.make();
        user.empresa = company.id;
        await userRepository.save(user);
        companyUsers.push(user);
      }
      console.log(`      ✅ ${numUsers} usuários criados`);

      // ==========================================
      // NÍVEL 4: Employees
      // ==========================================
      console.log('   👷 Criando funcionários...');
      const employees: Employee[] = [];
      const numEmployees = 20;
      for (let i = 0; i < numEmployees; i++) {
        const employee = await employeeFactory.make();
        employee.empresa = company;
        employee.funcao = roles[getRandomInt(0, roles.length - 1)];
        employee.setor = departments[getRandomInt(0, departments.length - 1)];
        employee.cbo = cbos[getRandomInt(0, cbos.length - 1)];
        employee.centroCusto = getRandomBoolean(0.7)
          ? costCenters[getRandomInt(0, costCenters.length - 1)]
          : undefined;
        employee.criadoPor =
          companyUsers[getRandomInt(0, companyUsers.length - 1)];
        await employeeRepository.save(employee);
        employees.push(employee);
      }
      console.log(`      ✅ ${employees.length} funcionários criados`);

      // ==========================================
      // NÍVEL 5: Eventos de funcionários
      // ==========================================
      console.log('   📊 Criando eventos dos funcionários...');
      let totalAbsences = 0;
      let totalVacations = 0;
      let totalCertificates = 0;
      let totalPromotions = 0;
      let totalTerminations = 0;
      let totalAccidents = 0;
      let totalWarnings = 0;
      let totalLaborActions = 0;
      let totalEpiDeliveries = 0;
      let totalCpfAnalysis = 0;

      for (const employee of employees) {
        const creator = companyUsers[getRandomInt(0, companyUsers.length - 1)];

        // Absences (0-2)
        const numAbsences = getRandomInt(0, 2);
        for (let i = 0; i < numAbsences; i++) {
          const absence = await absenceFactory.make();
          absence.funcionario = employee;
          absence.criadoPor = creator;
          await absenceRepository.save(absence);
          totalAbsences++;
        }

        // Vacations (0-1)
        if (getRandomBoolean(0.3)) {
          const vacation = await vacationFactory.make();
          vacation.funcionario = employee;
          vacation.criadoPor = creator;
          await vacationRepository.save(vacation);
          totalVacations++;
        }

        // Medical Certificates (0-1)
        if (getRandomBoolean(0.25)) {
          const certificate = await medicalCertificateFactory.make();
          certificate.funcionario = employee;
          certificate.criadoPor = creator;
          await medicalCertificateRepository.save(certificate);
          totalCertificates++;
        }

        // Promotions (0-1)
        if (getRandomBoolean(0.2)) {
          const promotion = await promotionFactory.make();
          promotion.funcionario = employee;
          promotion.funcao = roles[getRandomInt(0, roles.length - 1)];
          promotion.criadoPor = creator;
          await promotionRepository.save(promotion);
          totalPromotions++;
        }

        // Terminations (apenas ~10% dos funcionários)
        if (getRandomBoolean(0.1)) {
          const termination = await terminationFactory.make();
          termination.funcionario = employee;
          termination.criadoPor = creator;
          await terminationRepository.save(termination);
          employee.statusFuncionario = StatusFuncionario.DEMITIDO;
          await employeeRepository.save(employee);
          totalTerminations++;
        }

        // Accidents (0-1)
        if (getRandomBoolean(0.15)) {
          const accident = await accidentFactory.make();
          accident.funcionario = employee;
          accident.criadoPor = creator;
          await accidentRepository.save(accident);
          totalAccidents++;
        }

        // Warnings (0-1)
        if (getRandomBoolean(0.15)) {
          const warning = await warningFactory.make();
          warning.funcionario = employee;
          warning.criadoPor = creator;
          await warningRepository.save(warning);
          totalWarnings++;
        }

        // Labor Actions (raro - 5%)
        if (getRandomBoolean(0.05)) {
          const laborAction = await laborActionFactory.make();
          laborAction.funcionario = employee;
          laborAction.criadoPor = creator;
          await laborActionRepository.save(laborAction);
          totalLaborActions++;
        }

        // EPI Deliveries (1-2)
        const numDeliveries = getRandomInt(1, 2);
        for (let i = 0; i < numDeliveries; i++) {
          const delivery = await epiDeliveryFactory.make();
          delivery.funcionario = employee;
          delivery.epis = getRandomElements(epis, getRandomInt(1, 3));
          delivery.criadoPor = creator;
          await epiDeliveryRepository.save(delivery);
          totalEpiDeliveries++;
        }

        // CPF Analysis (0-1)
        if (getRandomBoolean(0.3)) {
          const analysis = await cpfAnalysisFactory.make();
          analysis.funcionario = employee;
          analysis.criadoPor = creator;
          await cpfAnalysisRepository.save(analysis);
          totalCpfAnalysis++;
        }
      }

      console.log(`      ✅ ${totalAbsences} faltas`);
      console.log(`      ✅ ${totalVacations} férias`);
      console.log(`      ✅ ${totalCertificates} atestados`);
      console.log(`      ✅ ${totalPromotions} promoções`);
      console.log(`      ✅ ${totalTerminations} demissões`);
      console.log(`      ✅ ${totalAccidents} acidentes`);
      console.log(`      ✅ ${totalWarnings} advertências`);
      console.log(`      ✅ ${totalLaborActions} ações trabalhistas`);
      console.log(`      ✅ ${totalEpiDeliveries} entregas de EPI`);
      console.log(`      ✅ ${totalCpfAnalysis} análises de CPF`);
    }

    console.log('\n' + '═'.repeat(50));
    console.log('🎉 Seed concluído com sucesso!');
    console.log('═'.repeat(50));
    console.log('\n📋 Credenciais de acesso:');
    console.log('\n   SUPER_ADMIN:');
    console.log('   Email: superadmin@seed.com');
    console.log('   Senha: Seed@123');
    console.log('\n   ADMIN:');
    console.log('   Email: admin@seed.com');
    console.log('   Senha: Admin@123\n');
  }
}
