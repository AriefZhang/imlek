import { Transform } from 'class-transformer';

export const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);

export const ParseOptionalBoolean = () =>
  Transform(({ value }) => optionalBooleanMapper.get(value));
