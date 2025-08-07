const commonCfgSet = (cfg) => {
    cfg.llm = {
        bailian: {
            baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            apiKey: process.env.COMMON_LLM_BAILIAN_API_KEY || 'sk-',
            // model: 'qwen-plus',
            useProxy: false,
            model: 'qwen-turbo-latest',
            proxyUrl: 'http://127.0.0.1:7890',
            maxToken: 8000,
        },
        volcengine: {
            baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            apiKey: process.env.COMMON_LLM_VOLCENGINE_API_KEY || 'sk-',
            // model: 'qwen-plus',
            useProxy: false,
            model: 'qwen-turbo-latest',
            proxyUrl: 'http://127.0.0.1:7890',
        },
    };
    cfg.mail = {
        host: process.env.COMMON_MAIL_HOST || 'smtp.163.com',
        port: process.env.COMMON_MAIL_PORT || 465,
        secure: process.env.COMMON_MAIL_SECURE || true,
        user: process.env.COMMON_MAIL_USER || 'nocutadmin@163.com',
        pass: process.env.COMMON_MAIL_PASS || 'AMPQmz4HZFrueTmP', // 有效期6个月，设置日期2025-02-01
    };
    cfg.user = {
        sendLoginUrl: {
            title: process.env.COMMON_USER_SEND_LOGIN_URL_TITLE || '登录邮件',
            subject: process.env.COMMON_USER_SEND_LOGIN_URL_SUBJECT || '登录邮件',
            loginUrl: process.env.COMMON_USER_SEND_LOGIN_URL_LOGIN_URL || `http://localhost:${cfg.web.port}/api/user/loginByUrl`,
        },
        loginRedirectUrl: process.env.COMMON_USER_LOGIN_REDIRECT_URL || `http://localhost:${cfg.web.port}`,
        enableSms123Login: process.env.COMMON_USER_ENABLE_SMS_123_LOGIN || false,
    };
    cfg.web3 = {
        enabled: process.env.COMMON_WEB3_ENABLED || false,
        eth: {},
        solana: {
            // rpc: process.env.COMMON_WEB3_SOLANA_RPC || 'https://solana-devnet.g.alchemy.com/v2/98T9AxeNHQuftSODSMZ5xc8lxIuppuF1',
            rpc: process.env.COMMON_WEB3_SOLANA_RPC || 'https://solana-devnet.g.alchemy.com/v2/98T9AxeNHQuftSODSMZ5xc8lxIuppuF1',
        }
    }
}


module.exports = commonCfgSet;
