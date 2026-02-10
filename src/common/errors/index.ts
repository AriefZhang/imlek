import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common'

export const handleError = (error: any): Error => {
  const { code, status } = error
  if (status === 400) {
    throw new BadRequestException(error.message)
  } else if (status === 401) {
    throw new UnauthorizedException(error.message)
  } else if (status === 404) {
    throw new NotFoundException(error.message)
  } else if (status === 409) {
    throw new ConflictException(error.message)
  } else if (code === '23505') {
    throw new ConflictException(
      `${error.message} - ${error.detail.split('=')[1]}`,
    )
  } else {
    throw new InternalServerErrorException()
  }
}
