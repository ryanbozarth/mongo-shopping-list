global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var id;
var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
  before(function(done) {
    server.runServer(function(error) {
      if (error) {
        done(error);
      }
      Item.create({
        name: 'Broad beans'
      }, {
        name: 'Tomatoes'
      }, {
        name: 'Peppers'
      }, function(err, data) {
        id = data._id;
        done();
      });
    });
  });
  describe('Shopping List', function() {
    it('should list items on get', function(done) {
      chai.request(app)
        .get('/items')
        .end(function(err, res) {
          should.equal(err, null);
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length(3);
          res.body[0].should.be.a('object');
          res.body[0].should.have.property('_id');
          res.body[0].should.have.property('name');
          res.body[0]._id.should.be.a('string');
          res.body[0].name.should.be.a('string');
          res.body[0].name.should.equal('Broad beans');
          res.body[1].name.should.equal('Tomatoes');
          res.body[2].name.should.equal('Peppers');
          done();
        });
    });
    it('should add an item on post', function(done) {
      chai.request(app)
        .post('/items')
        .send({
          'id': '4',
          'name': 'Kale'
        })
        .end(function(err, res) {
          should.equal(err, null);
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.should.have.property('_id');
          res.body.name.should.be.a('string');
          res.body._id.should.be.a('string');
          res.body.name.should.equal('Kale');
          done();
        });
    });
    it('should edit an item on put', function(done) {
      Item.create({
        name: 'White beans'
      }, function(err, item) {
        chai.request(app)
          .put('/items/' + item._id)
          .send({
            name: 'White beans',
            _id: item._id
          })
          .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id');
            res.body.name.should.be.a('string');
            res.body.name.should.equal('White beans');
            done();
          });
      });
    });

    it('should delete an item on delete', function(done) {
      Item.find().exec(function(err, res){
      });
      Item.findOne({
        name: 'White beans'
      }, function(err, item) {
        chai.request(app)
          .delete('/items/' + item._id)
          .send({
            name: 'Red beans',
            _id: item._id
          })
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
    });
  });
    it('should not post without body data', function(done) {
      chai.request(app)
        .post('/items')
        .send({})
        .end(function(err, res) {
          res.should.have.status(500);
          res.body.should.not.have.property('name');
          done();
        });
    });
    it('should not put without an id in the endpoint', function(done) {
      chai.request(app)
        .put('/items')
        .send({
          'name': 'Kale'
        })
        .end(function(err, res) {
          res.should.have.status(404);
          done();
        })
    });
    it('should not put with different ID in the endpoint than the body', function(done) {
      chai.request(app)
        .put('/items/0')
        .send({
          'name': 'coffee',
          'id': 4
        })
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it('should not put an id that does not exist', function(done) {
      chai.request(app)
        .put('/items/4')
        .send({
          'name': 'coffee',
          'id': 4
        })
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it('should not put without body data', function(done) {
      chai.request(app)
        .post('/items')
        .send({})
        .end(function(err, res) {
          res.should.have.status(500);
          res.body.should.not.have.property('name');
          done();
        });
    });
    it('should not put with something other than json', function(done) {
      chai.request(app)
        .put('/items/14')
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it('should not delete an ID that does not exist', function(done) {
      chai.request(app)
        .delete('/items/6')
        .end(function(err, res) {
          res.should.have.status(400);
          done();
        });
    });
    it('should not delete without an ID in the endpoint', function(done) {
      chai.request(app)
        .delete('/items/')
        .end(function(err, res) {
          res.should.have.status(404);
          done();
        });
    });
    after(function(done) {
      Item.remove(function() {
        done();
      });
    });
  });
});
