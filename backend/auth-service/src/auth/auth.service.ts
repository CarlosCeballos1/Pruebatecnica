import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      user,
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: CreateUserDto) {
    // Si se proporciona name, dividirlo en firstName y lastName
    if (registerDto.name && !registerDto.firstName && !registerDto.lastName) {
      const nameParts = registerDto.name.split(' ');
      registerDto.firstName = nameParts[0];
      registerDto.lastName = nameParts.slice(1).join(' ') || nameParts[0];
    }

    if (!registerDto.firstName || !registerDto.lastName) {
      throw new UnauthorizedException('El nombre y apellido son requeridos');
    }

    const user = await this.usersService.create(registerDto);
    const { password, ...result } = user;
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      user: result,
      token: this.jwtService.sign(payload),
    };
  }
} 