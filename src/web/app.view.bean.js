class UserViewController {
    mappings = [
        ['/login', 'GET', async (ctx) => {
            await this.vr.render(ctx, __dirname, "./views/login.ejs");
        }],
    ];
}

module.exports = UserViewController;
