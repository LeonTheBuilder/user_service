class UserService {


    async register(args) {
        //
        const {
            //
            username,
            password,
            passwordRepeat,
        } = args;

        //
        this.BizError.paramsErrorIfAnyNone({
            username,
            password,
            passwordRepeat,
        });

        //
        this.BizError.errIf(password != passwordRepeat, this.CommonBizCodeMessages.password_repeat_no_match);

        //
        const userEx = await this.User.findOne({where: {username}});
        this.BizError.errIf(userEx, this.CommonBizCodeMessages.username_dup);

        //
        const userId = await this.idgen.nextInt();
        const user = this.User.build({id: userId});
        user.nickName = '新用户';
        user.username = username;
        user.password = this.Sugar.passwordToHash(password);
        await user.save();
        return userId;
    }

    async login(args) {
        const {
            //
            username,
            password,
        } = args;
        //
        this.BizError.paramsErrorIfAnyNone({
            username,
            password,
        });
        //
        const user = await this.User.findOne({where: {username}});
        this.BizError.errIf(!user, this.CommonBizCodeMessages.login_fail);
        //
        this.BizError.errIf(user.password !== this.Sugar.passwordToHash(password), this.CommonBizCodeMessages.login_fail);
        //
        return user.id;
    }

    async getUser(args) {
        const {
            //
            userId
        } = args;
        this.log.info(args);
        return await this.User.findOne({where: {id: userId}});
    }


    async getCreateUserByEndpoint(args) {
        const {
            //
            endpointType,  // email | phone
            endpoint,
            nickName,
        } = args;

        // todo 给指定的 userId 添加 endpoint

        let userEndpoint = await this.UserEndpoint.findOne({where: {endpointType, endpoint}});
        if (!userEndpoint) {
            // create user by endpoint
            const userId = await this.idgen.nextInt();
            const user = await this.User.build({id: userId});
            user.nickName = nickName || `User${userId}`;
            await user.save();

            const userEndpointId = await this.idgen.nextInt();
            userEndpoint = await this.UserEndpoint.build({id: userEndpointId});
            userEndpoint.endpointType = endpointType;
            userEndpoint.endpoint = endpoint;
            userEndpoint.userId = userId;
            await userEndpoint.save();

            return user;
        } else {
            const userId = userEndpoint.userId;
            const user = await this.getUser({userId});
            return user;
        }

    }

    async sendLoginCode(args) {
        const {
            //
            endpointType,  // email | phone
            endpoint,
        } = args;


        // todo 检验同一个地址调用此接口的频率

        this.BizError.paramsErrorIfAnyNone({
            endpointType,
            endpoint
        });

        //
        const code = this.Sugar.randomDigits(5);
        const key = `loginCode_${endpoint}`;
        await this.tempData.set(key, `${code}`, 60 * 10);

        //  发送邮件
        if (endpointType === 'email') {

            await this.mailService.sendMail({
                to: endpoint,
                subject: '验证码',
                template: 'loginCode',
                data: {
                    code: code,
                },
            });

            return;
        } else if (endpointType === 'phone') {

            await this.smsService.sendSms({
                phone: endpoint,
                content: `您的验证码是：${code}`,
            });

        }

        this.BizError.notSupportedErrIf(true);
    }

    async loginByCode(args) {
        let {
            //
            code,
            endpoint,
            endpointType
        } = args;


        this.BizError.paramsErrorIfAnyNone({
            code,
            endpoint,
            endpointType
        });


        const enableSms123Login = this.cfg.user?.enableSms123Login || false;
        if (enableSms123Login) {
            this.log.info('enableSms123Login');
            const user = await this.getCreateUserByEndpoint({
                endpointType: endpointType,
                endpoint,
            });
            this.log.info(user.id);
            return user.id;
        }

        const key = `loginCode_${endpoint}`;
        const codeSent = await this.tempData.get(key);

        //
        this.BizError.accidentIf(!codeSent, '验证码已经过期，请重新发送并验证。');
        this.BizError.accidentIf(code !== codeSent, '验证码错误');

        //
        const user = await this.getCreateUserByEndpoint({
            endpointType: endpointType,
            endpoint,
        });

        //
        return user.id;
    }

    async sendLoginUrl(args) {
        const {
            endpointType,  // email | phone
            endpoint,
        } = args;

        this.BizError.paramsErrorIfAnyNone({endpointType, endpoint});

        const rand = await this.idgen.nextInt();
        const randDigi = this.Sugar.randomDigits(5);
        const key = this.Sugar.passwordToHash(`${rand}${randDigi}`);

        await this.tempData.set(`loginKey_${key}`, endpoint, 60 * 10);

        if (endpointType === 'email') {
            const title = this.cfg.user?.sendLoginUrl?.title || 'cfg.user.sendLoginUrl.title'
            const subject = this.cfg.user?.sendLoginUrl?.subject || 'cfg.user.sendLoginUrl.subject'
            const to = endpoint;
            const loginUrl = this.cfg.user?.sendLoginUrl?.loginUrl || 'cfg.user.sendLoginUrl.loginUrl'
            const data = {loginUrl: `${loginUrl}?key=${key}`};

            await this.mailService.sendMail({
                title,
                subject,
                to,
                template: 'loginUrl',
                data,
            });

            return;
        }

        this.BizError.notSupportedErrIf(true);

    }

    async loginByUrl(args) {
        const {
            //
            key
        } = args;

        this.BizError.paramsErrorIfAnyNone({key});

        const endpoint = await this.tempData.get(`loginKey_${key}`);

        this.BizError.accidentIf(!endpoint, '登录链接已过期，请重新发送。');

        const endpointType = 'email';

        if (endpointType === 'email') {

            const user = await this.getCreateUserByEndpoint({
                endpointType: endpointType,
                endpoint,
            });
            return user.id;
        }

        this.BizError.notSupportedErrIf(true);
    }


    async setJwtAndRedirect(ctx, userId) {
        await this.jwt.setUidJwt(ctx, userId);

        // 重定向到指定的 URL
        const redirectUrl = this.cfg.user?.loginRedirectUrl || '/';
        ctx.redirect(redirectUrl);
    }

    async updateUserPasswordHint(args) {
        const {
            _uid, _verify,
            userId,
            passwordHint,
        } = args;

        let userPasswordHint = await this.UserPasswordHint.findOne({
            where: {
                id: userId,
            }
        });

        if (!userPasswordHint) {
            userPasswordHint = this.UserPasswordHint.build({
                id: userId,
            });
        }

        userPasswordHint.hint = passwordHint;
        await userPasswordHint.save();

    }

    async getUserPasswordHint(args) {

        const {
            _uid, _verify,
            username,
        } = args;


        const user = await this.User.findOne({
            where: {
                username,
            }
        });

        this.BizError.noDataErrIf(!user);

        let userPasswordHint = await this.UserPasswordHint.findOne({
            where: {
                id: user.id,
            }
        });


        if (!userPasswordHint) {
            userPasswordHint = this.UserPasswordHint.build({
                id: userId,
            });
            userPasswordHint.hint = '未设置密码提示';
            await userPasswordHint.save();
        }
        return userPasswordHint;
    }


    logout = async (ctx) => {
        // remove t from cookies
        ctx.cookies.set('t', null);
    };

    mappings = [
        ['/api/user/logout', 'get', this.logout],
        ['/api/user/loginByUrl', 'get', async (ctx) => {
            const key = ctx.query.key;
            const userId = await this.loginByUrl({key});
            await this.setJwtAndRedirect(ctx, userId);
        }],
        ['/api/user/getCurUserId', 'get', async (ctx) => {
            const uid = await this.jwt.curUidEx(ctx);
            ctx.body = uid;
        }],
    ];

    apis = [

        [this.updateUserPasswordHint, async (ctx) => {
            const args = await this.ah.ctx2args(ctx, true, true);
            args.userId = args._uid;
            await this.updateUserPasswordHint(args);
        }],

        [this.getUserPasswordHint, async (ctx) => {
            const args = await this.ah.ctx2args(ctx, false, false);
            ctx.body = await this.getUserPasswordHint(args);
        }],

        [this.register, async (ctx) => {
            const args = ctx.request.body;
            const userId = await this.register(args);
            await this.jwt.setUidJwt(ctx, userId);
        }],
        [this.login, async (ctx) => {
            const args = ctx.request.body;
            const userId = await this.login(args);
            await this.jwt.setUidJwt(ctx, userId);
        }],

        [this.getUser, async (ctx) => {
            const uid = await this.jwt.curUidEx(ctx);
            ctx.body = await this.getUser({userId: uid});
        }],
        ['logout', this.logout],
        [this.sendLoginCode, async (ctx) => {
            const args = ctx.request.body;
            await this.sendLoginCode(args);
        }],
        [this.loginByCode, async (ctx) => {
            const args = ctx.request.body;
            const userId = await this.loginByCode(args);
            await this.jwt.setUidJwt(ctx, userId);
            ctx.body = userId;
        }],
        [this.sendLoginUrl, async (ctx) => {
            const args = ctx.request.body;
            await this.sendLoginUrl(args);
        }],

        // 在进入到页面的时候不需要服务器交互的页面来使用。
        ['isUserJwtOk', async (ctx) => {
            await this.ah.ctx2args(ctx, true, true);
        }],


    ];
}

module.exports = UserService;
