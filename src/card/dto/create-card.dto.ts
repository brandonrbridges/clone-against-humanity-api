import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateCardDto {
  @IsEnum(['white', 'black'])
  @IsNotEmpty()
  type: 'white' | 'black'

  @IsString()
  @IsNotEmpty()
  text: string

  @IsNumber()
  @IsNotEmpty()
  gap_count: number
}
