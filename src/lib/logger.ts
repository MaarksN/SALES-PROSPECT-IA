// Logger simples que pode ser expandido para Sentry/Datadog
import { env } from "@/env";

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  log(level: LogLevel, message: string, meta?: Record<string, any>) {
    if (level === "debug" && env.IS_PROD) return;

    const timestamp = new Date().toISOString();
    const payload = { timestamp, level, message, ...meta };

    // Console local
    if (level === "error") {
        console.error(message, meta);
    } else if (level === "warn") {
        console.warn(message, meta);
    } else {
        console.log(message, meta);
    }

    // Em produção, enviar para serviço externo
    if (env.IS_PROD && env.VITE_SENTRY_DSN) {
        // Sentry.captureMessage(message, { level, extra: meta });
    }
  }

  info(msg: string, meta?: any) { this.log("info", msg, meta); }
  warn(msg: string, meta?: any) { this.log("warn", msg, meta); }
  error(msg: string, meta?: any) { this.log("error", msg, meta); }
  debug(msg: string, meta?: any) { this.log("debug", msg, meta); }
}

export const logger = new Logger();
