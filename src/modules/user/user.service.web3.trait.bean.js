const nacl = require('tweetnacl');
const {PublicKey} = require("@solana/web3.js");

//
class UserServiceWeb3Trait {

    async loginByWalletAddress(args) {
        const {
            message,
            signature,
            address,
            walletType,
        } = args;
        //
        const isValidSignature = await this.isValidSignature(args);

        this.BizError.errIf(!isValidSignature, this.CommonBizCodeMessages.invalid_signature);

        const user = await this.userService.getCreateUserByEndpoint({
            endpointType: 'web3Address',
            endpoint: address,
        });
        return user.id
    }

    async isValidSignature(args) {
        const {
            message,
            signature,
            address,
            walletType, // todo wallet type 要参考 depay 的设计，现在默认是 solana 的
        } = args;

        const signatureArray = await this._base64ToUint8Array(signature);
        const encodedMessage = new TextEncoder().encode(message);
        const publicKeyObj = new PublicKey(address);
        const isValid = nacl.sign.detached.verify(encodedMessage, signatureArray, publicKeyObj.toBytes());
        return isValid;
    }

    // 将 base64Signature 转回 Uint8Array
    async _base64ToUint8Array(base64) {
        const binaryString = atob(base64); // 解码 Base64
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    apis = [
        [this.loginByWalletAddress, async (ctx) => {
            const args = ctx.request.body;
            const userId = await this.loginByWalletAddress(args);
            await this.jwt.setUidJwt(ctx, userId);
        }],
    ];
}

module.exports = UserServiceWeb3Trait;
