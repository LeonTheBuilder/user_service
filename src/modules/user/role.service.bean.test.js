const loadContext = require('../../loadcontext');
const assert = require('assert');

it('roleService.addRoleToUser', async () => {
    const a = await loadContext();

    const roleService = a.beans.roleService;
    const idgen = a.beans.idgen;

    const testUserId = await idgen.nextInt();
    const testRole = 'testRole';
    const testRole2 = 'testRole2';


    await roleService.addRoleToUser({
        userId: testUserId,
        role: testRole,
    });

    await roleService.addRoleToUser({
        userId: testUserId,
        role: testRole2,
    });


    const userRoles = await roleService.listUserRoles({
        userId: testUserId,
    });
    assert(userRoles.length === 2);

    const hasAllRole = await roleService.doesUserHaveAllRoles({
        userId: testUserId,
        roles: [testRole, testRole2],
    });
    assert(hasAllRole);


    const hasAnyRole = await roleService.doesUserHaveAnyRole({
        userId: testUserId,
        roles: [testRole, testRole2],
    });
    assert(hasAnyRole);

});
