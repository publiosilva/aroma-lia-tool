import { DetectTestSmell } from '../../../domain/usecases';
import { DetectAssertionRouletteTestSmellService, DetectDuplicateAssertTestSmellService, DetectIgnoredTestTestSmellService, DetectSleepyTestTestSmellService } from '../../../services';

export function makeDetectAssertionRouletteTestSmellService(): DetectTestSmell {
  return new DetectAssertionRouletteTestSmellService();
}

export function makeDetectDuplicateAssertTestSmellService(): DetectTestSmell {
  return new DetectDuplicateAssertTestSmellService();
}

export function makeDetectIgnoredTestTestSmellService(): DetectTestSmell {
  return new DetectIgnoredTestTestSmellService();
}

export function makeDetectSleepyTestTestSmellService(): DetectTestSmell {
  return new DetectSleepyTestTestSmellService();
}
