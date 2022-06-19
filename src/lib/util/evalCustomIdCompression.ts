import { compressCustomIdMetadata, decompressCustomIdMetadata } from '#utils/utils';

export const compressEvalCustomIdMetadata = compressCustomIdMetadata<EvalModalData>;

export const decompressEvalCustomIdMetadata = decompressCustomIdMetadata<EvalModalData>;

export interface EvalModalData {
  depth: number;
  language: string;
  outputTo: string;
  async: boolean;
  timeout: number;
  silent: boolean;
  showHidden: boolean;
}
