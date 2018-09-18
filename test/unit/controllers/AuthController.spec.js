const CONTROLLER_NAME = 'Auth';

describe(`Controllers/${CONTROLLER_NAME}`, () => {
  let preCreatedUser;
  before(async () => {
    preCreatedUser = await models.User.create({
      nickName: 'tomas',
      email: 'me@tomas.io',
    });
    await models.Passport.create({
      provider: 'local',
      password: 'tomastomas',
      UserId: preCreatedUser.id
    });
  });

  beforeEach(() => {
  });

  after(() => {
  });

  describe(`About ${CONTROLLER_NAME}Controller operations`, () => {
    it('Login as an Admin User', async () => {
      await request(express)
        .post('/api/admin/login')
        .set('Accept', 'application/json')
        .send({
          'email': preCreatedUser.email, // email
          'password': 'tomastomas' // 密碼
        })
        .expect(r => logResponseBody(r))
        // .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          console.log(res.body);
          // TODO: expecting result:
          // {
          //   "token": "user_token",
          //   "nickName": "tomas",
          //   "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTA4LCJkZXZpY2VUb" // JWT Token
          // }
          expect(res.body).to.be.an('object');
          expect(res.body.accessToken).to.be.an('string');
        });
    });
  });
});
