import { RequirementCompliance } from '../types/gdcRequirements';
import { WorkingAIService } from './workingAIService';

export const analyzeRequirements = async (files: File[]): Promise<RequirementCompliance[]> => {
  console.log(`🎯 Starting WORKING AI analysis for ${files.length} files`);
  return await WorkingAIService.analyzeWithWorkingAI(files);
};

export const generateComprehensiveReport = () => 'Working AI Report';
