// Types
import type { User } from '@prisma/client';

// Class Validator
import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateGameDto {
  user: User;

  @IsString()
  name: string;

  @IsString()
  inviteCode: string;

  @IsString()
  code: string;

  @IsInt()
  @Min(2)
  @Max(100)
  rounds: number;

  @IsInt()
  @Min(1)
  @Max(12)
  maxPlayers: number;
}
