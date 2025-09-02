import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Workbook } from 'exceljs';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('v1/funcionarios')
@ApiTags('Funcionários')
export class EmployeeTemplateController {
  @Get('template-importacao')
  @ApiOperation({
    summary: 'Baixar template para importação de funcionários',
    description:
      'Endpoint que retorna um arquivo Excel template para importação de funcionários.',
  })
  @ApiResponse({
    status: 200,
    description: 'Template Excel para importação de funcionários.',
  })
  async downloadTemplate(@Res() res: Response) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Funcionários');

    // Definir cabeçalhos
    const headers = [
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
      'nomepai',
      'nomemae',
      'email',
      'pis',
      'ctpsnumero',
      'ctpsserie',
      'certificadoreservista',
      'regimecontratacao',
      'dataadmissao',
      'salario',
      'dataultimoaso',
      'funcao',
      'setor',
      'vencimentoexperiencia1',
      'vencimentoexperiencia2',
      'dataexameadmissional',
      'dataexamedemissional',
      'centrocusto',
      'grauinstrucao',
      'necessidadesespeciais',
      'tipodeficiencia',
      'filhos',
      'quantidadefilhos',
      'filhosabaixode21',
      'telefone',
      'celular',
      'gestor',
      'cbo',
      'rua',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'estado',
      'cep',
      'latitude',
      'longitude',
      'quantidadeonibus',
      'cargahoraria',
      'escala',
      'valoralimentacao',
      'valortransporte',
    ];

    // Adicionar cabeçalhos
    worksheet.addRow(headers);

    // Formatar cabeçalhos
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Ajustar largura das colunas
    worksheet.columns.forEach((column) => {
      if (column.header) {
        column.width = Math.max(column.header.length + 2, 15);
      }
    });

    // Adicionar linha de exemplo
    worksheet.addRow([
      'João Silva',
      '123456789',
      '12345678901',
      'MASCULINO',
      '1990-01-15',
      'SOLTEIRO',
      'São Paulo',
      'Brasileira',
      1.75,
      70.5,
      'José Silva',
      'Maria Silva',
      'joao@email.com',
      '12345678901',
      '1234567',
      '1234',
      '12345678901234',
      'CLT',
      '2024-01-15',
      5000.0,
      '2024-01-10',
      'id-da-funcao',
      'id-do-setor',
      '2024-04-15',
      '2024-07-15',
      '2024-01-10',
      null,
      'id-do-centro-custo',
      'SUPERIOR',
      false,
      null,
      true,
      2,
      true,
      '11987654321',
      '11987654321',
      'Gestor Silva',
      'id-do-cbo',
      'Rua das Flores, 123',
      '123',
      'Apto 45',
      'Centro',
      'São Paulo',
      'SP',
      '01234567',
      -23.5505,
      -46.6333,
      2,
      44,
      'SEIS_UM',
      25.0,
      15.0,
    ]);

    // Configurar resposta
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=template-funcionarios.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
