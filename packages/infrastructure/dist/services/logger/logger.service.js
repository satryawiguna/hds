"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
class LoggerService {
    formatMessage(level, message, meta) {
        const timestamp = new Date().toISOString();
        const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
        return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
    }
    info(message, meta) {
        // eslint-disable-next-line no-console
        console.log(this.formatMessage("info", message, meta));
    }
    warn(message, meta) {
        console.warn(this.formatMessage("warn", message, meta));
    }
    error(message, meta) {
        console.error(this.formatMessage("error", message, meta));
    }
    debug(message, meta) {
        if (process.env.NODE_ENV === "development") {
            // eslint-disable-next-line no-console
            console.log(this.formatMessage("debug", message, meta));
        }
    }
}
exports.LoggerService = LoggerService;
