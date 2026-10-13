// safeConsoleLog: only logs in test/development mode (VITE_TEST_MODE === '1')
export function safeConsoleLog(content: unknown = ''): void {
  if (import.meta.env.VITE_TEST_MODE === '1') {
    console.log(content);
  }
}
