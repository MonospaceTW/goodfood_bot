module.exports = {
    async auth(req, res) {
        res.setHeader('Content-Type', 'application/json');
        const codee = req.query.code ? req.query.code : false;
        const state = req.query.state ? req.query.state : false;
        console.log("req = %O",req)
        res.send({test: "test"})
    }
}