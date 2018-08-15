const controllerName = 'User';

describe.skip(`Controllers/${controllerName}`, () => {
  before(() => {
  });

  beforeEach(() => {
  });

  after(() => {
  });

  describe('Create model data', () => {
    it('creates a data', async () => {
      await request(express)
        .get('/spec')
        .set('Accept', 'application/json')
        .expect(r => logResponseBody(r))
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          // TODO:
          // 1. model.create(fakeData.create)...
          // 2. use data from `fakeData.create`

          expect(res.body.data).to.be.equal('test');
        });
    });
  });

  describe('About AuthController operations', () => {
    it('Login User - Admin', async () => {
      await request(express)
        .post('/api/admin/login')
        .set('Accept', 'application/json')
        .send({
          'email': 'a@b.c', // email
          'password': '12345678' // 密碼
        })
        .expect(r => logResponseBody(r))
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          // TODO:
          // 1. model.create(fakeData.create)...
          // 2. use data from `fakeData.create`

          expect(res.body.data).to.be.equal('test');
        });
    });
  });

  describe('About UserController operations', () => {
    it('Get User List', async () => {
      const param = {
        curPage: 1,
        perPage: 10,
      };
      await request(express)
        .get('/api/admin/users')
        .set('Accept', 'application/json')
        .query(param)
        .expect(r => logResponseBody(r))
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          // TODO:
          // 1. model.create(fakeData.create)...
          // 2. use data from `fakeData.create`

          expect(res.body.data).to.be.equal('test');
          expect(res.body.paging.perPage).to.be.equal(param.perPage);
          expect(res.body.paging.curPage).to.be.equal(param.curPage);
        });
    });
  });
});
