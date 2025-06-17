import { CanActivate, ExecutionContext } from '@nestjs/common';

export class MockAuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    void _context;
    return true;
  }
}
