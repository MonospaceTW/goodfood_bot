module.exports =  {
    async index(req, res){
        const users = await models.User.findAll();

        return res.render('index', {
          title: 'Express Example',
          data: {
            users,
          },
        });
    },
    async users(req, res){
        const users = await models.User.findAll();
      
        return res.render('user', {
          title: 'User list',
          data: {
            users,
          },
        });
    }
}