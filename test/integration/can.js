'use strict';

var expect             = require('chai').expect;
var Promise            = require('bluebird');
var AuthorizationError = require('../../lib/error');
var UserBase           = require('../mocks/user');
var ModelBase          = require('../mocks/model');

describe('Integration: Can API', function () {

  var Note, Appointment, Hospital, Admin, Doctor, Patient;
  beforeEach(function () {
    Appointment = ModelBase.extend();
    Admin = UserBase.extend();
    Doctor = UserBase.extend();
    Patient = UserBase.extend();
  });

  describe('Doctor', function () {

    var doctor;
    beforeEach(function () {
      doctor = new Doctor();
      doctor.id = 1;
    })

    describe('=> Patients', function () {

      var patient;
      beforeEach(function () {
        patient = new Patient();
      })

      beforeEach(function () {
        Patient.authorize.a(Doctor).to.read.when(function (doctor) {
          var appts = this.appointments.filter(function (appointment) {
            return appointment.doctor.id === doctor.id;
          });
          if (!appts.length) {
            throw new Error(err);
          }
          return true;
        });
      });

      it('can read when there are 1+ appointments', function () {
        patient.appointments = [{doctor: {id: 1}}];
        doctor.id = 1;
        return doctor.can.read(patient);
      });

      it('cannot read patients without appointments with the doctor', function () {
        return expect(doctor.can.read(patient))
          .to.be.rejectedWith(AuthorizationError);
      });

      it('can never write directly to patients', function () {
        return expect(doctor.can.write(patient))
          .to.be.rejectedWith(AuthorizationError);
      });

    });

    describe('=> Doctor', function () {

      beforeEach(function () {
        Doctor.authorize.a(Doctor).to.read.when(function () {
          return this.directory
        });
      });

      var colleague;
      beforeEach(function () {
        colleague = new Doctor();
      });

      it('can read doctors listed in the directory', function () {
        colleague.directory = true;
        return doctor.can.read(colleague);
      });

      it('cannot read doctors that are unlisted', function () {
        return expect(doctor.can.read(colleague))
          .to.be.rejectedWith(AuthorizationError);
      });

      it('can never write to colleagues', function () {
        return expect(doctor.can.write(colleague))
          .to.be.rejectedWith(AuthorizationError);
      });

    });

    describe('=> Appointments', function () {

      beforeEach(function () {
        Appointment.authorize.a(Doctor).to.read.when(function (doctor) {
          if (this.doctor && this.doctor.id === doctor.id) {
            return true;
          }
          if (this.patient.appointments.filter(function (appointment) {
            return appointment.doctor.id === doctor.id
          }).length) {
            return true;
          }
        });
      });

      beforeEach(function () {
        Appointment.authorize.a(Doctor).to.write.when(function (doctor) {
          return this.doctor && this.doctor.id === doctor.id;
        });
      });

      var appointment;
      beforeEach(function () {
        appointment = new Appointment();
      });

      it('can read his own appointments', function () {
        appointment.doctor = doctor;
        return doctor.can.read(appointment)
      });

      it('can write his own appointments', function () {
        appointment.doctor = doctor;
        return doctor.can.write(appointment);
      });

      it('can read all appointments for his patients', function () {
        appointment.patient = {
          appointments : [{
            doctor: doctor
          }]
        };
        return doctor.can.read(appointment);
      });

    });

  });

});