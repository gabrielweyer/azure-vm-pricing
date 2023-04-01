export interface LogMessage {
  loggedAt: Date;
  level: 'warn' | 'error';
  args: any[];
}
