interface Environment {
  PORT?: string;
  STORAGE_PORT?: string;
}

export function validateEnvironment(config: Environment): Environment {
  for (const [key, value] of [
    ['PORT', config.PORT],
    ['STORAGE_PORT', config.STORAGE_PORT],
  ] as const) {
    if (value !== undefined && (!Number.isInteger(Number(value)) || Number(value) <= 0)) {
      throw new Error(`${key} must be a positive integer`);
    }
  }

  return config;
}
