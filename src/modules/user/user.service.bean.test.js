const loadContext = require('../../loadcontext');
const assert = require('assert');
it('userService.register', async () => {
    const a = await loadContext();
    const userService = a.beans.userService;

    const rand = await a.beans.idgen.next();

    const password = 'somePw' + rand;
    const args = {
        'username': 'someUs' + rand,
        'password': password,
        'passwordRepeat': 'somePw' + rand,
    };

    const userId = await userService.register(args);
    console.log(userId);
    console.log(typeof userId);

    const userIdLogin = await userService.login(args);
    console.log(userIdLogin);
    console.log(typeof userIdLogin);

    assert(userId === userIdLogin);
    process.exit(0);
});

it('userService.login', async () => {
    const a = await loadContext();
    const userService = a.beans.userService;
    process.exit(0);
}).timeout(100000);

it('userService.updateUserPasswordHint', async () => {
    const a = await loadContext();
    const userService = a.beans.userService;

    const username = await a.beans.idgen.next();

    const registerArgs = {
        username: `${username}`,
        password: '123',
        passwordRepeat: '123',
    };

    const userId = await userService.register(registerArgs);

    const args = {
        userId,
        passwordHint: 'some hint'
    };

    await userService.updateUserPasswordHint(args);

    const hint = await userService.getUserPasswordHint({
        username
    });

    assert(hint.hint === 'some hint');
    process.exit(0);

}).timeout(100000);



