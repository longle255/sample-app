export function sleep(ms: number = 0): Promise<void> {
  return new Promise<void>(r => setTimeout(r, ms));
}
