export const getEnvFilePath = () => {
  const appRunningOn = process.env.NODE_ENV

  if (appRunningOn === 'development') {
    return '.env'
  } else {
    return `.env.${appRunningOn}`
  }
}
