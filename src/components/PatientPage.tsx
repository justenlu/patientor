import { useEffect, useState } from "react";
import { Patient } from "../types";
import { useParams } from 'react-router-dom';
import patientService from "../services/patients";
import { Diagnosis } from "../types";

interface Props {
  diagnoses: Diagnosis[]
}

const PatientPage = ({diagnoses}: Props) => {
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

  const diagnosisName = (code: string):string => {
    const diagnosis:Diagnosis | undefined = diagnoses.find(d => d.code===code);
    if (diagnosis) {
      return diagnosis.name;
    }
    else {
      return '';
    }
  };

  return (
    <div className="App">
      <h2>{patient.name}</h2>
      <div>gender: {patient.gender}</div>
      <div>ssn: {patient.ssn}</div>
      <div>date of birth: {patient.dateOfBirth}</div>
      <div>occupation: {patient.occupation}</div>
      <h3>entries</h3>
      {patient.entries.map(e => (
        <div key={e.id}>
          <div>{e.date} {e.description}</div>
          {e.diagnosisCodes && (
            <ul>
              {e.diagnosisCodes.map(dc => (
                <li key={dc}>
                  {dc}&nbsp;
                  {diagnosisName(dc)}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
