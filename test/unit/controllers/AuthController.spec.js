const CONTROLLER_NAME = 'Auth';

describe.only(`Controllers/${CONTROLLER_NAME}`, () => {
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
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          // TODO: expecting result:
          // {
          //   "token": "user_token",
          //   "nickName": "tomas",
          //   "Authorization": "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MTA4LCJkZXZpY2VUb" // JWT Token
          // }
          expect(res.body).to.be.an(Object);
          expect(res.body.token).to.be.a(String);
          expect(res.body.nickName).to.be.a(String).equal(preCreatedUser.nickName);
          expect(res.body.Authorization).to.be.a(String);
        });
    });
  });
});
