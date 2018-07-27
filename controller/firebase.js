module.exports = {
    async test(req, res) {
        console.log('req = %j', req.body);
        const cl = firebaseService.testConsole();

        const { user_name } = req.body;
        console.log(cl);
        const test = {
          text: `${user_name} test`
        };
        return res.json(test);
    },
}