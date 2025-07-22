import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class StatusService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getApiStatus() {
    const updatedAt = new Date().toISOString();

    const uptimeInSeconds = process.uptime();
    const uptime = this.formatUptime(uptimeInSeconds);

    const dbVersionResult = await this.dataSource.query('SHOW server_version;');
    const dbVersionValue: string = dbVersionResult[0]?.server_version;

    const dbMaxConnectionsResult = await this.dataSource.query(
      'SHOW max_connections;',
    );
    const dbMaxConnectionsValue: number = parseInt(
      dbMaxConnectionsResult[0]?.max_connections,
    );

    const dbOpenedConnectionsResult = await this.dataSource.query(
      'SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;',
      [process.env.DB_NAME],
    );
    const dbOpenedConnectionsValue: number =
      dbOpenedConnectionsResult[0]?.count;

    return {
      updated_at: updatedAt,
      name: 'API-SYNNERDATA',
      description: 'API Synnerdata',
      status: 'online',
      version: '1.0',
      uptime: uptime,
      release_date: '2025-01-17',
      documentation: 'https://web.synnerdata.com/api/docs',
      dependencies: {
        database: {
          version: dbVersionValue,
          max_connections: dbMaxConnectionsValue,
          opened_connections: dbOpenedConnectionsValue,
        },
      },
    };
  }

  private formatUptime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
}
