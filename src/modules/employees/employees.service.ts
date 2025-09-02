import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from '../companies/companies.service';
import { Employee } from './entities/employee.entity';
import { plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { DepartmentsService } from '../departments/departments.service';
import { CostCentersService } from '../cost-centers/cost-centers.service';
import { CostCenterResponseDto } from '../cost-centers/dto/cost-center-response.dto';
import { UsersService } from '../users/users.service';
import { CbosService } from '../cbos/cbos.service';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { UpdateStatusDto } from './dto/update-status-employee.dto';
import { Role } from '../roles/entities/role.entity';
import { Department } from '../departments/entities/department.entity';
import { CostCenter } from '../cost-centers/entities/cost-center.entity';
import { Cbo } from '../cbos/entities/cbo.entity';
import { UsersResponseDto } from '../users/dto/user-response.dto';
import { ImportEmployeeRowDto } from './dto/import-employee-row.dto';
import { validate } from 'class-validator';
import { Workbook } from 'exceljs';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    private readonly companiesService: CompaniesService,
    private readonly rolesService: RolesService,
    private readonly departmentsService: DepartmentsService,
    private readonly costCentersService: CostCentersService,
    private readonly cbosService: CbosService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    companyId: string,
    createEmployeeDto: CreateEmployeeDto,
    createdBy: string,
  ) {
    const company = await this.companiesService.findOne(companyId);
    const role = await this.rolesService.findOne(createEmployeeDto.funcao);
    const department = await this.departmentsService.findOne(
      createEmployeeDto.setor,
    );
    let costCenter: CostCenterResponseDto;

    if (createEmployeeDto.centroCusto) {
      costCenter = await this.costCentersService.findOne(
        createEmployeeDto.centroCusto,
      );
    }

    const cbo = await this.cbosService.findOne(createEmployeeDto.cbo);

    const user = await this.usersService.findOne(createdBy);

    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      empresa: { id: company.id },
      funcao: { id: role.id },
      setor: { id: department.id },
      centroCusto: costCenter ? { id: costCenter.id } : null,
      cbo: { id: cbo.id },
      dataNascimento: new Date(createEmployeeDto.dataNascimento),
      dataAdmissao: new Date(createEmployeeDto.dataAdmissao),
      dataUltimoASO: createEmployeeDto.dataUltimoASO
        ? new Date(createEmployeeDto.dataUltimoASO)
        : null,
      dataExameAdmissional: createEmployeeDto.dataExameAdmissional
        ? new Date(createEmployeeDto.dataExameAdmissional)
        : null,
      vencimentoExperiencia1: createEmployeeDto.vencimentoExperiencia1
        ? new Date(createEmployeeDto.vencimentoExperiencia1)
        : null,
      vencimentoExperiencia2: createEmployeeDto.vencimentoExperiencia2
        ? new Date(createEmployeeDto.vencimentoExperiencia2)
        : null,
      dataExameDemissional: createEmployeeDto.dataExameDemissional
        ? new Date(createEmployeeDto.dataExameDemissional)
        : null,
      criadoPor: user,
    });

    await this.employeesRepository.save(employee);

    return plainToInstance(EmployeeResponseDto, employee, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(companyId: string) {
    const company = await this.companiesService.findOne(companyId);

    const employees = await this.employeesRepository.find({
      where: {
        empresa: { id: company.id },
        status: 'A',
      },
    });

    return plainToInstance(EmployeeResponseDto, employees, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string) {
    const employee = await this.employeesRepository.findOne({
      where: {
        id,
        status: 'A',
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return plainToInstance(EmployeeResponseDto, employee, {
      excludeExtraneousValues: true,
    });
  }

  async findByCpf(cpf: string) {
    const employee = await this.employeesRepository.findOne({
      where: {
        cpf,
      },
    });

    return employee;
  }

  async findByIds(ids: string[]) {
    const employees = await this.employeesRepository.findBy({
      id: In(ids),
    });

    if (employees.length === 0) {
      throw new NotFoundException('Funcionário(s) não encontrado(s).');
    }

    return employees;
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    let role: Role;
    let department: Department;
    let costCenter: CostCenter;
    let cbo: Cbo;

    if (updateEmployeeDto.funcao) {
      role = await this.rolesService.findOneInternal(updateEmployeeDto.funcao);
    }

    if (updateEmployeeDto.setor) {
      department = await this.departmentsService.findOneInternal(
        updateEmployeeDto.setor,
      );
    }

    if (updateEmployeeDto.centroCusto) {
      costCenter = await this.costCentersService.findOneInternal(
        updateEmployeeDto.centroCusto,
      );
    }

    if (updateEmployeeDto.cbo) {
      cbo = await this.cbosService.findOneInternal(updateEmployeeDto.cbo);
    }

    const result = await this.employeesRepository.update(id, {
      ...updateEmployeeDto,
      funcao: role,
      setor: department,
      centroCusto: costCenter,
      cbo: cbo,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    const updatedEmployee = await this.findOne(id);

    return updatedEmployee;
  }

  async remove(id: string, deletedBy: string) {
    const user = await this.usersService.findOne(deletedBy);

    const result = await this.employeesRepository.update(id, {
      status: 'E',
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário já excluído ou não encontrado.');
    }

    const removedEmployee = await this.employeesRepository.findOne({
      where: { id },
    });

    return plainToInstance(EmployeeResponseDto, removedEmployee, {
      excludeExtraneousValues: true,
    });
  }

  async updateEmployeeStatus(
    id: string,
    updateStatusDto: UpdateStatusDto,
    updatedBy: string,
  ) {
    const user = await this.usersService.findOne(updatedBy);

    const result = await this.employeesRepository.update(id, {
      ...updateStatusDto,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return this.findOne(id);
  }

  async updateEmployeeRole(id: string, role: Role, user: UsersResponseDto) {
    const result = await this.employeesRepository.update(id, {
      funcao: role,
      atualizadoPor: user,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return this.findOne(id);
  }

  async importXlsx(companyId: string, fileBuffer: Buffer, createdBy: string) {
    try {
      const company = await this.companiesService.findOne(companyId);
      const user = await this.usersService.findOne(createdBy);

      const workbook = new Workbook();
      await workbook.xlsx.load(fileBuffer as any);
      const worksheet = workbook.getWorksheet(1);

      if (!worksheet) {
        throw new BadRequestException(
          'Arquivo Excel não contém planilha válida',
        );
      }

      const headerRow = worksheet.getRow(1);
      const headers: string[] = [];
      headerRow.eachCell((cell, colNumber) => {
        headers[colNumber] = cell.value?.toString().toLowerCase().trim() || '';
      });

      const requiredHeaders = [
        'nome',
        'carteiraidentidade',
        'cpf',
        'sexo',
        'datanascimento',
        'estadocivil',
        'naturalidade',
        'nacionalidade',
        'altura',
        'peso',
        'nomemae',
        'email',
        'pis',
        'ctpsnumero',
        'ctpsserie',
        'certificadoreservista',
        'regimecontratacao',
        'dataadmissao',
        'salario',
        'funcao',
        'setor',
        'grauinstrucao',
        'necessidadesespeciais',
        'filhos',
        'celular',
        'gestor',
        'cbo',
        'rua',
        'numero',
        'bairro',
        'cidade',
        'estado',
        'cep',
        'quantidadeonibus',
        'cargahoraria',
        'escala',
        'valoralimentacao',
        'valortransporte',
      ];

      const optionalHeaders = [
        'nomepai',
        'dataultimoaso',
        'vencimentoexperiencia1',
        'vencimentoexperiencia2',
        'dataexameadmissional',
        'dataexamedemissional',
        'centrocusto',
        'tipodeficiencia',
        'quantidadefilhos',
        'filhosabaixode21',
        'telefone',
        'complemento',
        'latitude',
        'longitude',
      ];

      const headerMap = new Map<string, number>();

      requiredHeaders.forEach((header) => {
        const colIndex = headers.findIndex((h) => h === header);
        if (colIndex === -1) {
          throw new BadRequestException(
            `Cabeçalho obrigatório '${header}' não encontrado`,
          );
        }
        headerMap.set(header, colIndex);
      });

      optionalHeaders.forEach((header) => {
        const colIndex = headers.findIndex((h) => h === header);
        if (colIndex !== -1) {
          headerMap.set(header, colIndex);
        }
      });

      const errors: Array<{ row: number; field: string; message: string }> = [];
      const employeesToInsert: any[] = [];
      let totalRows = 0;

      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);

        if (row.hasValues) {
          totalRows++;

          try {
            const rowData: any = {};

            requiredHeaders.forEach((header) => {
              const colIndex = headerMap.get(header);
              if (colIndex !== undefined) {
                const cellValue = row.getCell(colIndex).value;

                if (cellValue !== null && cellValue !== undefined) {
                  if (typeof cellValue === 'string') {
                    rowData[header] = cellValue.trim();
                  } else if (cellValue instanceof Date) {
                    rowData[header] = cellValue.toISOString().split('T')[0];
                  } else {
                    rowData[header] = this.convertToString(header, cellValue);
                  }
                }
              }
            });

            optionalHeaders.forEach((header) => {
              const colIndex = headerMap.get(header);
              if (colIndex !== undefined) {
                const cellValue = row.getCell(colIndex).value;

                if (cellValue !== null && cellValue !== undefined) {
                  if (typeof cellValue === 'string') {
                    rowData[header] = cellValue.trim();
                  } else if (cellValue instanceof Date) {
                    rowData[header] = cellValue.toISOString().split('T')[0];
                  } else {
                    rowData[header] = this.convertToString(header, cellValue);
                  }
                }
              }
            });

            if (rowData.necessidadesespeciais !== undefined) {
              rowData.necessidadesespeciais = this.parseBoolean(
                rowData.necessidadesespeciais,
              );
            }
            if (rowData.filhos !== undefined) {
              rowData.filhos = this.parseBoolean(rowData.filhos);
            }
            if (rowData.filhosabaixode21 !== undefined) {
              rowData.filhosabaixode21 = this.parseBoolean(
                rowData.filhosabaixode21,
              );
            }

            [
              'altura',
              'peso',
              'salario',
              'quantidadefilhos',
              'latitude',
              'longitude',
              'quantidadeonibus',
              'cargahoraria',
              'valoralimentacao',
              'valortransporte',
            ].forEach((field) => {
              if (rowData[field] !== undefined && rowData[field] !== '') {
                rowData[field] = parseFloat(rowData[field]);
              }
            });

            const dto = plainToInstance(ImportEmployeeRowDto, rowData);
            const validationErrors = await validate(dto);

            if (validationErrors.length > 0) {
              validationErrors.forEach((error) => {
                if (error.constraints) {
                  Object.values(error.constraints).forEach((message) => {
                    errors.push({
                      row: rowNumber,
                      field: error.property,
                      message: message as string,
                    });
                  });
                }
              });
            } else {
              employeesToInsert.push({ ...dto, rowNumber });
            }
          } catch (error) {
            errors.push({
              row: rowNumber,
              field: 'geral',
              message: `Erro ao processar linha: ${error.message}`,
            });
          }
        }
      }

      if (errors.length > 0) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      }

      let inserted = 0;
      const batchSize = 1000;

      await this.employeesRepository.manager.transaction(
        async (transactionalEntityManager) => {
          for (let i = 0; i < employeesToInsert.length; i += batchSize) {
            const batch = employeesToInsert.slice(i, i + batchSize);

            for (const employeeData of batch) {
              const role = await this.rolesService.findOneInternal(
                employeeData.funcao,
              );
              const department = await this.departmentsService.findOneInternal(
                employeeData.setor,
              );
              const cbo = await this.cbosService.findOneInternal(
                employeeData.cbo,
              );

              let costCenter = null;
              if (employeeData.centrocusto) {
                costCenter = await this.costCentersService.findOneInternal(
                  employeeData.centrocusto,
                );
              }

              const employee = transactionalEntityManager.create(Employee, {
                nome: employeeData.nome,
                carteiraIdentidade: employeeData.carteiraidentidade,
                cpf: employeeData.cpf,
                sexo: employeeData.sexo,
                dataNascimento: new Date(employeeData.datanascimento),
                estadoCivil: employeeData.estadocivil,
                naturalidade: employeeData.naturalidade,
                nacionalidade: employeeData.nacionalidade,
                altura: employeeData.altura,
                peso: employeeData.peso,
                nomePai: employeeData.nomepai || null,
                nomeMae: employeeData.nomemae,
                email: employeeData.email,
                pis: employeeData.pis,
                ctpsNumero: employeeData.ctpsnumero,
                ctpsSerie: employeeData.ctpsserie,
                certificadoReservista: employeeData.certificadoreservista,
                regimeContratacao: employeeData.regimecontratacao,
                dataAdmissao: new Date(employeeData.dataadmissao),
                salario: employeeData.salario,
                dataUltimoASO: employeeData.dataultimoaso
                  ? new Date(employeeData.dataultimoaso)
                  : null,
                vencimentoExperiencia1: employeeData.vencimentoexperiencia1
                  ? new Date(employeeData.vencimentoexperiencia1)
                  : null,
                vencimentoExperiencia2: employeeData.vencimentoexperiencia2
                  ? new Date(employeeData.vencimentoexperiencia2)
                  : null,
                dataExameAdmissional: employeeData.dataexameadmissional
                  ? new Date(employeeData.dataexameadmissional)
                  : null,
                dataExameDemissional: employeeData.dataexamedemissional
                  ? new Date(employeeData.dataexamedemissional)
                  : null,
                grauInstrucao: employeeData.grauinstrucao,
                necessidadesEspeciais: employeeData.necessidadesespeciais,
                tipoDeficiencia: employeeData.tipodeficiencia || null,
                filhos: employeeData.filhos,
                quantidadeFilhos: employeeData.quantidadefilhos || null,
                filhosAbaixoDe21: employeeData.filhosabaixode21 || null,
                telefone: employeeData.telefone || null,
                celular: employeeData.celular,
                gestor: employeeData.gestor,
                rua: employeeData.rua,
                numero: employeeData.numero,
                complemento: employeeData.complemento || null,
                bairro: employeeData.bairro,
                cidade: employeeData.cidade,
                estado: employeeData.estado,
                cep: employeeData.cep,
                latitude: employeeData.latitude || null,
                longitude: employeeData.longitude || null,
                quantidadeOnibus: employeeData.quantidadeonibus,
                cargaHoraria: employeeData.cargahoraria,
                escala: employeeData.escala,
                valorAlimentacao: employeeData.valoralimentacao,
                valorTransporte: employeeData.valortransporte,
                empresa: { id: company.id },
                funcao: { id: role.id },
                setor: { id: department.id },
                cbo: { id: cbo.id },
                centroCusto: costCenter ? { id: costCenter.id } : null,
                criadoPor: user,
              });

              await transactionalEntityManager.save(Employee, employee);
              inserted++;
            }
          }
        },
      );

      return {
        totalRows,
        inserted,
        skipped: 0,
      };
    } catch (error) {
      throw error;
    }
  }

  private parseBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      return (
        lower === 'true' || lower === 'sim' || lower === 's' || lower === '1'
      );
    }
    if (typeof value === 'number') {
      return value === 1;
    }
    return false;
  }

  private convertToString(fieldName: string, value: any): any {
    const stringFields = [
      'carteiraidentidade',
      'cpf',
      'pis',
      'ctpsnumero',
      'ctpsserie',
      'certificadoreservista',
      'cep',
      'telefone',
      'celular',
      'numero',
    ];

    if (stringFields.includes(fieldName)) {
      return String(value);
    }

    return value;
  }
}
