type PipelineSample = 'clean' | 'issues';

type PipelineRules = {
  missing: boolean;
  duplicate: boolean;
  invalid: boolean;
};

type PipelineFlags = {
  missing: number;
  duplicate: number;
  invalid: number;
};

type PipelineRecord = {
  eventId: string;
  category: string;
  timestamp: string;
  reading: number | string;
  normalizedCategory: string;
  numericReading: number | null;
  partition: string;
};

export function evaluatePipeline(sample: PipelineSample, rules: PipelineRules): {
  sourceRows: Omit<PipelineRecord, 'normalizedCategory' | 'numericReading' | 'partition'>[];
  acceptedRows: PipelineRecord[];
  flags: PipelineFlags;
  rejectedCount: number;
};
