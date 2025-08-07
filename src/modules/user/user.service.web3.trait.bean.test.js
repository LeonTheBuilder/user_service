const loadContext = require('../../loadcontext');

it('userServiceWeb3Trait.isValidSignature', async () => {
    const a = await loadContext();
    const userServiceWeb3Trait = a.beans.userServiceWeb3Trait;
    const message = 'this website wants you to sign in with your account:CfNyi1AvBAAcoHkp9BRSWD86UbyraNM1shQ55hZbBYPb Click to sign in and accept the website of service'
    const signature = 'kFuPklzObvJsjPphpjmdy9k5h2krRHyGyBMveUM4GxbH11QA1nh48cyfUVlXAwJY6UkM7UjrE2wtYe29Tm94Bw==';
    const address = 'CfNyi1AvBAAcoHkp9BRSWD86UbyraNM1shQ55hZbBYPb';
    const solPrice = await userServiceWeb3Trait.isValidSignature({message, signature, address});
    console.log(solPrice)
});
