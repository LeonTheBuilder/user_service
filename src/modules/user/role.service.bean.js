class RoleService {

    async addRoleToUser(args) {
        const {
            //
            userId,
            role
        } = args;
        const id = await this.idgen.nextInt();
        const userRole = this.UserRole.build({id});
        userRole.userId = userId;
        userRole.role = role;
        await userRole.save();
    }

    async deleteRoleFromUser(args) {
        const {
            //
            userId,
            role
        } = args;
        const userRole = await this.UserRole.findOne({
            where: {
                userId,
                role
            }
        });
        if (userRole) {
            await userRole.destroy();
        }
    }

    async listUserRoles(args) {
        const {
            //
            userId
        } = args;
        return await this.UserRole.findAll({
            where: {
                userId
            }
        });

    }

    async doesUserHaveAnyRole(args) {
        const {
            //
            userId,
            roles
        } = args;
        const userRoles = await this.listUserRoles({userId});
        for (let userRole of userRoles) {
            if (roles.includes(userRole.role)) {
                return true;
            }
        }
        return false;

    }

    async doesUserHaveAllRoles(args) {
        const {
            //
            userId,
            roles
        } = args;
        const userRoles = await this.listUserRoles({userId});
        for (let role of roles) {
            let found = false;
            for (let userRole of userRoles) {
                if (userRole.role === role) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }


    apis = [
        [this.doesUserHaveAnyRole, async (ctx) => {
            const args = await this.ah.ctx2args(ctx, true, true);
            args.userId = args._uid;
            ctx.body = await this.doesUserHaveAnyRole(args);
        }],
        [this.doesUserHaveAllRoles, async (ctx) => {
            const args = await this.ah.ctx2args(ctx, true, true);
            args.userId = args._uid;
            ctx.body = await this.doesUserHaveAllRoles(args);
        }],
    ];
}

module.exports = RoleService;
