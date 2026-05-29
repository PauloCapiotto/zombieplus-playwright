// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Executa testes em paralelo */
  fullyParallel: true,

  /* Bloqueia test.only em CI */
  forbidOnly: !!process.env.CI,

  /* Retentativas apenas em CI */
  retries: process.env.CI ? 2 : 0,

  /* Workers: 1 em CI para evitar conflitos no banco */
  workers: process.env.CI ? 1 : undefined,

  /* Reporters: HTML para visualização + list para terminal */
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  /* Configurações globais de todos os testes */
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',

    /* Captura trace, screenshot e vídeo apenas em falhas */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    /* Timeouts */
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    /**
     * Projeto principal (chromium): cobre todos os testes e2e
     * - Os testes de login sobrescrevem storageState via test.use() no spec file
     * - Os testes de movies e leads obtêm autenticação via fixture storageState
     *   (ver tests/fixtures/index.js)
     */
    {
      name: 'chromium',
      testMatch: /.*\.spec\.(js|ts)/,
      testIgnore: [/global\.setup\.js/, /seed\.spec\.ts/],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
