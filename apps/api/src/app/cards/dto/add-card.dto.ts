import { AddCard } from '@fnt-flsy/data-transfer-types';
import { OmitType } from '@nestjs/swagger';
import { CardDto } from './card.dto';

export class AddCardDto extends OmitType(CardDto, ['id']) implements AddCard {}
