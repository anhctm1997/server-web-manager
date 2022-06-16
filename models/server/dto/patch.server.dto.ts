import { PutServerDto } from "./put.server.dto";

export interface PatchServerDto extends Partial<PutServerDto> {}
