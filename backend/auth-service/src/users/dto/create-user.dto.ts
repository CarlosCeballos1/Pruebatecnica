import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @Transform(({ value }: TransformFnParams) => {
    if (value) return value;
    return undefined;
  })
  firstName?: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @Transform(({ value }: TransformFnParams) => {
    if (value) return value;
    return undefined;
  })
  lastName?: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @Transform(({ value }: TransformFnParams) => {
    if (value) {
      const parts = value.split(' ');
      return parts[0];
    }
    return undefined;
  })
  name?: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  role?: string = 'user';
} 