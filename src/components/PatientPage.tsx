import { useEffect, useState } from "react";
import { Patient } from "../types";
import { useParams } from 'react-router-dom';
import patientService from "../services/patients";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null);

  const id = useParams().id;

  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        const patient = await patientService.getOne(id);
        setPatient(patient);
      };
      void fetchPatient();
    }
  }, [id]);

  if (!patient) {
    return (
      <div>Loading data...</div>
    );
  }

  return (
    <div className="App">
      <h2>{patient.name}</h2>
      <div>gender: {patient.gender}</div>
      <div>ssn: {patient.ssn}</div>
      <div>date of birth: {patient.dateOfBirth}</div>
      <div>occupation: {patient.occupation}</div>
    </div>
  );
};

export default PatientPage;
