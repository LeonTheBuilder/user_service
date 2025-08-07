const assert = require('assert');
const loadContext = require('../../loadcontext');

const testUserId = 1;

it('userProductService.addProduct', async () => {

    const a = await loadContext();
    // prepare tradeOrder
    const userProductService = a.beans.userProductService;

    const productId = await a.beans.idgen.nextInt();
    //
    const _args = {
        // tradeService args
        userId: testUserId,
        tradeType: 'buyProduct',

        // buyProductTradeService args
        productType: 'testProductType',
        productId: productId,
        minutes: 60
    };

    await userProductService.addProduct(_args);

    //
    const hasProduct = await userProductService.hasProduct(_args);
    assert(hasProduct);
});

it('userProductService.addProduct.same', async () => {

    const a = await loadContext();
    // prepare tradeOrder
    const userProductService = a.beans.userProductService;

    const productId = await a.beans.idgen.nextInt();
    //
    const _args = {
        // tradeService args
        userId: testUserId,
        tradeType: 'buyProduct',

        // buyProductTradeService args
        productType: 'testProductType',
        productId: productId,
        minutes: 60
    };

    await userProductService.addProduct(_args);
    await userProductService.addProduct(_args);

    //
    const hasProduct = await userProductService.hasProduct(_args);
    assert(hasProduct);
});




