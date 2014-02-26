'use strict';

var expect             = require('chai').expect;
var Promise            = require('bluebird');
var AuthorizationError = require('../../lib/error');
var UserBase           = require('../mocks/user');
var ModelBase          = require('../mocks/model');

describe('Integration: Can API', function () {

  var Note, Appointment, Hospital, Admin, Doctor, Patient;
  beforeEach(function () {
    Note = ModelBase.extend();
    Appointment = ModelBase.extend();
    Hospital = UserBase.extend();
    Admin = UserBase.extend();
    Doctor = UserBase.extend();
    Patient = UserBase.extend();
  });

  describe('Doctor', function () {

    it('can only read from patients with appointments with him', function () {
      var err = 'Doctors can only access their own patients';
      Patient.authorize.a(Doctor).to.read.when(function (doctor) {
        var appts = this.appointments.filter(function (appointment) {
          return appointment.doctor_id === doctor.id;
        });
        if (!appts.length) {
          throw new Error(err);
        }
        return true;
      });
      
      var patient1 = new Patient();
      patient1.appointments = [{doctor_id: 1}];
      var patient2 = new Patient();
      patient2.appointments = [];

      var doctor = new Doctor({id: 1});

      var resolver = require('../../lib/resolver');

      return Promise.all([
        doctor.can.read(patient1),
        expect(doctor.can.read(patient2)).to.be.rejectedWith(AuthorizationError, err)
      ]);
    });

  });

});