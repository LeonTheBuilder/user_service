/**
 * 产品是一种有数量的，VIP算是一种产品
 * 商品是没有数量的，比如衣服裤子，叫做商品
 * UserProductService 只处理 用户产品
 */


class UserProductService {
    async addProduct(args) {
        const {
            _uid, _verify,
            //
            userId,
            productId,
            minutes
        } = args;

        //
        let userProduct = await this.UserProduct.findOne({
            where: {
                userId,
                productId
            }
        });

        if (!userProduct) {
            const id = await this.idgen.nextInt();
            userProduct = await this.UserProduct.build({
                id,
            });

            userProduct.userId = userId;
            userProduct.productId = productId;
            userProduct.dueDate = new Date();
            await userProduct.save();
        }

        const startDateMillis = Math.max(userProduct.dueDate.getTime(), new Date().getTime());
        const endDateMillis = startDateMillis + minutes * 60 * 1000;
        userProduct.dueDate = new Date(endDateMillis);
        await userProduct.save();
    }


    async hasProduct(args) {
        const {
            //
            userId, productId
        } = args;

        const userProduct = await this.UserProduct.findOne({
            where: {
                userId,
                productId
            }
        });

        if (!userProduct) {
            return false;
        }
        return userProduct.dueDate > new Date();
    }

    // 获得一个用户可用的产品
    async listUserAvailableProducts(args) {
        const {
            _uid, _verify,
            //
            userId
        } = args;

        const userProducts = await this.UserProduct.findAll({
            where: {
                userId,
                dueDate: {
                    [this.Sequelize.Op.gt]: new Date(),
                },
            }
        });

        return userProducts;
    }

}


module.exports = UserProductService;