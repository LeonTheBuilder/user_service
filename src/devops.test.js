const loadContext = require('./loadcontext');

it('update_table_schema', async () => {
    try {
        const a = await loadContext();
        await a.db.sync({alter: true});
    } catch (e) {
        console.log(e);
    }
    console.log('done');
});






