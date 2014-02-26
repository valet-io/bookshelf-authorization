'use strict';

var expect             = require('chai').expect;
var Promise            = require('bluebird');
var AuthorizationError = require('../../lib/error');
var UserBase           = require('../mocks/user');
var ModelBase          = require('../mocks/model');

describe('Integration: Can API', function () {

  var Appointment, Admin, Doctor, Patient;
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
    });

    describe('=> Patients', function () {

      var patient;
      beforeEach(function () {
        patient = new Patient();
      });

      beforeEach(function () {
        Patient.authorize.a(Doctor).to.read.when(function (doctor) {
          return this.appointments.filter(function (appointment) {
            return appointment.doctor === doctor;
          });
        });
      });

      it('can read when there are 1+ appointments', function () {
        patient.appointments = [{doctor: doctor}];
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
          return this.directory;
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
            return appointment.doctor.id === doctor.id;
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
        return doctor.can.read(appointment);
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

  describe('Admin', function () {

    it('can read and write to everything', function () {
      Appointment.authorize.an(Admin).to.administer();
      Admin.authorize.an(Admin).to.administer();
      Doctor.authorize.an(Admin).to.administer();
      Patient.authorize.an(Admin).to.administer();

      return Promise.all([
        Admin.can.read(Appointment),
        Admin.can.write(Appointment),
        Admin.can.read(Admin),
        Admin.can.write(Admin),
        Admin.can.read(Doctor),
        Admin.can.write(Doctor),
        Admin.can.read(Patient),
        Admin.can.write(Patient)
      ]);
    });

  });

  describe('Patient', function () {

    var patient;
    beforeEach(function () {
      patient = new Patient();
    });

    describe('=> Doctor', function () {

      beforeEach(function () {
        Doctor.authorize.a(Patient).to.read.when(function (patient) {
          return patient.appointments.filter(function (appointment) {
            return appointment.doctor.id === this.id;
          }, this).length;
        });
      });

      var doctor;
      beforeEach(function () {
        doctor = new Doctor();
      });

      it('can read his own doctors', function () {
        patient.appointments = [{
          doctor: doctor
        }];
        return patient.can.read(doctor);
      });

      it('cannot read other doctors', function () {
        patient.appointments = [];
        return expect(patient.can.read(doctor))
          .to.be.rejectedWith(AuthorizationError);
      });

      it('can never write to doctors', function () {
        return expect(patient.can.write(doctor))
          .to.be.rejectedWith(AuthorizationError);
      });

    });

    describe('=> Patient', function () {

      beforeEach(function () {
        Patient.authorize.a(Patient).to(['read', 'write']).when(function (patient) {
          return this === patient;
        });
      });

      it('can read his own record', function () {
        return patient.can.read(patient);
      });

      it('can write his own record', function () {
        return patient.can.write(patient);
      });

      it('can never read other patients', function () {
        return expect(patient.can.read(new Patient()))
          .to.be.rejectedWith(AuthorizationError);
      });

    });

    describe('=> Appointment', function () {

      beforeEach(function () {
        Appointment.authorize.a(Patient).to(['read', 'write'])
          .when(function (patient) {
            return this.patient === patient;
          });
      });

      beforeEach(function () {
        Appointment.authorize.a(Patient).to.write.when(function () {
          return this.date.valueOf() > Date.now();
        });
      });

      var appointment;
      beforeEach(function () {
        appointment = new Appointment();
        appointment.patient = patient;
      });

      it('can read all his appointments', function () {
        appointment.patient = patient;
        return patient.can.read(appointment);
      });

      it('can never read other patients\' appointments', function () {
        return expect(patient.can.read(new Appointment()))
          .to.be.rejectedWith(AuthorizationError);
      });

      it('can modify his future appointments', function () {
        appointment.date = new Date(Date.now() + 1000);
        return patient.can.write(appointment);
      });

      it('cannot modify past appointments', function () {
        appointment.date = new Date(Date.now() - 1000);
        return expect(patient.can.write(appointment))
          .to.be.rejectedWith(AuthorizationError);
      });

    });

    describe('=> Admin', function () {

      it('cannot read', function () {
        return expect(patient.can.read(Admin))
          .to.be.rejectedWith(AuthorizationError);
      });

      it('cannot write', function () {
        return expect(patient.can.write(Admin))
          .to.be.rejectedWith(AuthorizationError);
      });

    });

  });

});