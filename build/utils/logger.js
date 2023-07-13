"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("util"));
const serverConfig_json_1 = __importDefault(require("../config/serverConfig.json"));
class Logger {
    #options;
    constructor(opts = {}) {
        this.#options = { ...defaultOptions, ...opts };
        Object.defineProperties(this, { _log: { enumerable: false } });
    }
    configure = (opts = {}) => {
        this.#options = { ...this.#options, ...opts };
    };
    error = (...data) => this._log('error', ...data);
    warn = (...data) => this._log('warn', ...data);
    info = (...data) => this._log('info', ...data);
    debug = (...data) => this._log('debug', ...data);
    trace = (...data) => this._log('trace', ...data);
    sql = (queryLabel) => {
        return (queryText, queryObj) => {
            if (this.#options.enableSqlLogs) {
                this._log('sql', queryText, queryObj, queryLabel);
            }
        };
    };
    accessLogger = (opts) => {
        return (req, res, next) => {
            if (!this.#options.enableHttpLogs) {
                return next();
            }
            const reqUrl = req.originalUrl || req.url;
            if (opts?.ignoreUrlPaths?.length && opts.ignoreUrlPaths.includes(reqUrl)) {
                return next();
            }
            const startTime = Date.now();
            const httpInfo = {
                method: req.method?.toUpperCase() || '-',
                url: reqUrl || '-',
                host: req.headers?.host || '-',
                requestSize: req.headers && req.headers['content-length'] || 0,
                ip: req.ip || (req.connection && req.connection.remoteAddress) || '-',
            };
            if (opts?.logBodyContents) {
                httpInfo.body = { ...req.body };
                const blacklist = ['password', 'first_name', 'last_name', 'email'];
                blacklist.forEach(k => delete httpInfo.body[k]);
            }
            res.on('close', () => {
                httpInfo.status = res.statusCode ?? 0;
                httpInfo.responseTime = Date.now() - startTime;
                httpInfo.responseSize = res.getHeader('content-length') || '-';
                this._log('http', httpInfo);
            });
            return next();
        };
    };
    sLogger = (label) => {
        return { logging: this.sql(label) };
    };
    get logger() {
        return this;
    }
    _log = (level, ...args) => {
        if (!(level in logLevels) || logLevels[level] > logLevels[this.#options.logLevel]) {
            return;
        }
        const timestamp = (timestampFormatters[this.#options.timestamps] || timestampFormatters.NONE)();
        const levelColors = this.#options.colors || {};
        let logMessage = logFormatters[level][this.#options.format]({ level, timestamp, levelColors }, ...args);
        if (this.#options.useCarriageReturns) {
            logMessage = logMessage.replaceAll('\n', '\r');
        }
        process.stdout.write(logMessage + '\n');
    };
}
const colors = exports.colors = {
    NONE: '',
    RESET: '\x1b[0m',
    BLACK: '\x1b[30m',
    RED: '\x1b[31m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[35m',
    CYAN: '\x1b[36m',
    WHITE: '\x1b[37m',
    GRAY: '\x1b[90m',
    BLACK_BOLD: '\x1b[30;1m',
    RED_BOLD: '\x1b[31;1m',
    GREEN_BOLD: '\x1b[32;1m',
    YELLOW_BOLD: '\x1b[33;1m',
    BLUE_BOLD: '\x1b[34;1m',
    MAGENTA_BOLD: '\x1b[35;1m',
    CYAN_BOLD: '\x1b[36;1m',
    WHITE_BOLD: '\x1b[37;1m',
    GRAY_BOLD: '\x1b[90;1m',
    BOLD: '\x1b[1m',
    BOLD_OFF: '\x1b[22m',
    UNDERLINE: '\x1b[4m',
    UNDERLINE_OFF: '\x1b[24m',
};
const defaultOptions = {
    logLevel: 'info',
    format: 'plain',
    timestamps: 'ISO_UTC',
    enableSqlLogs: true,
    enableHttpLogs: true,
    useCarriageReturns: true,
    colors: {
        error: colors.RED_BOLD,
        warn: colors.YELLOW_BOLD,
        info: colors.GREEN_BOLD,
        debug: colors.BLUE_BOLD,
        trace: colors.MAGENTA_BOLD,
        http: colors.BOLD,
        sql: colors.CYAN_BOLD,
    },
};
const logLevels = {
    sql: Number.NEGATIVE_INFINITY,
    http: Number.NEGATIVE_INFINITY,
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
};
const colorMatcherRegex = new RegExp('@(' + Object.keys(colors).sort((a, b) => a.length - b.length).join('|') + ')', 'g');
const timestampFormatters = {
    NONE: () => '',
    ISO_UTC: () => (new Date()).toISOString(),
    ISO_MOUNTAIN: () => {
        const utc = new Date();
        const millis = utc.getMilliseconds(); // save the ms value, since it gets lost in conversion
        const mt = (new Date(utc.toLocaleString('en-US', { timeZone: 'America/Denver' })));
        mt.setMilliseconds(millis); // restore ms value
        const hOffset = (utc.getTime() - mt.getTime()) / 3600000;
        return mt.toISOString().replace('Z', `-0${hOffset}:00`);
    },
    MOUNTAIN: () => {
        const utc = new Date();
        const millis = utc.getMilliseconds(); // save the ms value, since it gets lost in conversion
        const mt = (new Date(utc.toLocaleString('en-US', { timeZone: 'America/Denver' })));
        mt.setMilliseconds(millis); // restore ms value
        return mt.toISOString().replace('T', ' ').replace('Z', '');
    },
};
const standardFormatters = {
    plain: (opts, ...args) => {
        const msg = util_1.default.format(...args);
        const ts = (opts.timestamp && ('' + opts.timestamp).length) ? `${opts.timestamp} ` : '';
        return `${ts}[${opts.level}] ${msg}`;
    },
    color: (opts, ...args) => {
        const msg = util_1.default.format(...args).replaceAll(colorMatcherRegex, ($0, $1) => `${colors[$1]}${$0}${colors.RESET}`); // colorize tags like "@RED"
        const ts = (opts.timestamp) ? `[${opts.timestamp}] ` : '';
        const level = `${opts.levelColors[opts.level] || ''}[${opts.level}]${colors.RESET}`;
        return `${ts}${level} ${msg}`;
    },
    json: (opts, ...args) => {
        const logData = {};
        if (opts.timestamp) {
            logData.time = '' + opts.timestamp;
        }
        logData.level = opts.level;
        logData.msg = util_1.default.format(...args);
        return JSON.stringify(logData);
    },
};
const sqlFormatters = {
    plain: (opts, ...args) => {
        const [queryText, queryObj, labelArg] = args;
        const label = (labelArg || queryObj.label) ? `::${labelArg || queryObj.label}` : '';
        const ts = (opts.timestamp) ? `${opts.timestamp} ` : '';
        return `${ts}[${opts.level}${label}] ${queryText}`;
    },
    color: (opts, ...args) => {
        const [queryText, queryObj, labelArg] = args;
        const ts = (opts.timestamp) ? `[${opts.timestamp}] ` : '';
        const label = (labelArg || queryObj.label) ? `::${labelArg || queryObj.label}` : '';
        const query = queryText.replace(/(Executing\s\([0-9a-zA-Z-]+\):)/, `$1${colors.GRAY}`)
            .replace(/\bROLLBACK;$/, `${colors.RED}ROLLBACK${colors.GRAY};`)
            .concat(colors.RESET);
        const clr = opts.levelColors[opts.level] || '';
        const level = `${opts.levelColors[opts.level] || ''}[${opts.level}${label}]${colors.RESET}`;
        return `${ts}${clr}${level} ${query}`;
    },
    json: (opts, ...args) => {
        const [queryText, queryObj, labelArg] = args;
        const logData = {};
        if (opts.timestamp) {
            logData.time = '' + opts.timestamp;
        }
        logData.level = opts.level;
        if (labelArg || queryObj.label) {
            logData.label = util_1.default.format(labelArg || queryObj.label);
        }
        logData.msg = util_1.default.format(queryText);
        const txidMatch = logData.msg?.match(/^(Executing \(([0-9a-zA-Z-]+)\): ).*/);
        if (txidMatch && txidMatch.length > 2) {
            if (txidMatch[2] !== 'default') {
                logData.txid = txidMatch[2];
            }
            logData.msg = logData.msg?.replace(txidMatch[1], '');
        }
        return JSON.stringify(logData);
    },
};
const httpFormatters = {
    plain: (opts, httpInfo) => {
        const ts = opts.timestamp && `[${opts.timestamp}] ` || '';
        const { url, method, ip, status, responseTime, requestSize, responseSize, user_id, body } = httpInfo;
        const fields = [
            `${ts}[${opts.level}] ${status}`,
            `${responseTime} ms`,
            `${method} ${url}`,
            `${ip}`,
            `user ${user_id || '(none)'}`,
            `req ${requestSize} bytes`,
            `res ${responseSize} bytes`,
        ];
        if (body) {
            fields.push(JSON.stringify(body));
        }
        return fields.join(' - ');
    },
    color: (opts, httpInfo) => {
        const ts = opts.timestamp && `[${opts.timestamp}] ` || '';
        const { url, method, ip, responseTime, requestSize, responseSize, user_id, body } = httpInfo;
        const level = `${opts.levelColors[opts.level] || ''}[${opts.level}]${colors.RESET}`;
        const fields = [
            `${ts}${level} ${httpInfo.status}`,
            `${responseTime} ms`,
            `${method} ${url}`,
            `${ip}`,
            `user ${user_id || '(none)'}`,
            `req ${requestSize} bytes`,
            `res ${responseSize} bytes`,
        ];
        if (body) {
            fields.push(JSON.stringify(body));
        }
        return fields.join(' - ');
    },
    json: (opts, httpInfo) => {
        let logData = {
            ...httpInfo,
            level: opts.level,
            msg: `${httpInfo.status} - ${httpInfo.method} ${httpInfo.url}`,
        };
        if (opts.timestamp) {
            logData = { time: opts.timestamp, ...logData };
        }
        return JSON.stringify(logData);
    },
};
const logFormatters = {
    sql: sqlFormatters,
    http: httpFormatters,
    error: standardFormatters,
    warn: standardFormatters,
    info: standardFormatters,
    debug: standardFormatters,
    trace: standardFormatters,
};
const presets = {
    'color': {
        format: 'color',
        logLevel: 'debug',
        timestamps: 'MOUNTAIN',
        enableSqlLogs: true,
        enableHttpLogs: true,
        useCarriageReturns: false,
    },
    'plain': {
        format: 'plain',
        logLevel: 'debug',
        timestamps: 'MOUNTAIN',
        enableSqlLogs: true,
        enableHttpLogs: true,
        useCarriageReturns: false,
    },
    'aws': {
        format: 'plain',
        logLevel: 'info',
        timestamps: 'NONE',
        enableSqlLogs: true,
        enableHttpLogs: true,
        useCarriageReturns: true,
    },
    'aws-json': {
        format: 'json',
        logLevel: 'info',
        timestamps: 'NONE',
        enableSqlLogs: true,
        enableHttpLogs: true,
        useCarriageReturns: true,
    },
};
// ------------- configure the logger based on env vars + config.json ------------
const configOverrides = {};
const preset = (process.env.LOGGER_PRESET || serverConfig_json_1.default[process.env.NODE_ENV || 'development']?.logger_preset) || 0;
if (preset && presets[preset]) {
    Object.assign(configOverrides, presets[preset]);
}
if (process.env.LOG_LEVEL && logLevels[process.env.LOG_LEVEL] !== undefined) {
    configOverrides.logLevel = process.env.LOG_LEVEL;
}
if (process.env.LOG_FORMAT && standardFormatters[process.env.LOG_FORMAT]) {
    configOverrides.format = process.env.LOG_FORMAT;
}
if (process.env.LOG_TIMESTAMP_FORMAT && timestampFormatters[process.env.LOG_TIMESTAMP_FORMAT]) {
    configOverrides.timestamps = process.env.LOG_TIMESTAMP_FORMAT;
}
if (process.env.LOG_SQL_QUERIES !== undefined) {
    configOverrides.enableSqlLogs = (process.env.LOG_SQL_QUERIES === 'true') ? true : false;
}
if (process.env.LOG_HTTP_REQUESTS !== undefined) {
    configOverrides.enableHttpLogs = (process.env.LOG_HTTP_REQUESTS === 'true') ? true : false;
}
if (process.env.LOG_REPLACE_NEWLINES !== undefined) {
    configOverrides.useCarriageReturns = (process.env.LOG_REPLACE_NEWLINES === 'true') ? true : false;
}
if (process.env.NODE_ENV === 'integration') {
    configOverrides.enableSqlLogs = false;
}
exports.default = new Logger(configOverrides);
