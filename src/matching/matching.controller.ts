import { Controller, Post } from '@nestjs/common';
import { MatchingService } from './matching.service';

@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('check')
  async checkMatches() {
    await this.matchingService.checkForMatches();
    return { message: 'Matching check completed.' };
  }
}
