import { useEffect, useState } from "react";
import { Gender, Patient } from "../types";
import { useParams } from 'react-router-dom';
import patientService from "../services/patients";
import { Diagnosis, 
  Entry, 
  HospitalEntry, 
  OccupationalHealthcareEntry,
  HealthCheckEntry } from "../types";

import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import HealthRatingBar from "./HealthRatingBar";


interface PatientPageProps {
  diagnoses: Diagnosis[]
}

const HospitalEntryDetails = ({entry}: {entry: HospitalEntry}) => (
  <div>
    <div>discharge: {entry.discharge.date} {entry.discharge.criteria}</div>
  </div>
);

const OccupationalHealthcareEntryDetails = ({entry}: {entry: OccupationalHealthcareEntry}) => (
  <div>
    {entry.sickLeave && (
      <div>sickleave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</div>
    )}
  </div>
);

const HealthCheckEntryDetails = ({entry}: {entry: HealthCheckEntry}) => (
  <HealthRatingBar rating={entry.healthCheckRating} showText={false}/>
);

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled entry type: ${JSON.stringify(value)}`
  );
};

const EntryDetails = ({entry}: {entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryDetails entry={entry} />;
    case "HealthCheck":
      return <HealthCheckEntryDetails entry={entry}/>;
    default:
      return assertNever(entry);
  }
};

const PatientPage = ({diagnoses}: PatientPageProps) => {
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

  const entryStyle = {
    marginTop: 5,
    paddingTop: 5,
    paddingLeft: 8,
    border: 'solid',
    borderWidth: 1,
    paddingBottom: 5
  };

  return (
    <div className="App">
      <h2>{patient.name}
        {patient.gender===Gender.Male && <MaleIcon />}
        {patient.gender===Gender.Female && <FemaleIcon />}
      </h2>
      <div>gender: {patient.gender}</div>
      <div>ssn: {patient.ssn}</div>
      <div>date of birth: {patient.dateOfBirth}</div>
      <div>occupation: {patient.occupation}</div>
      <h3>entries</h3>
      {patient.entries.map(entry => (
        <div key={entry.id} style={entryStyle}>
          <div>
            {entry.date}&nbsp;
            {entry.type==="HealthCheck" && <MonitorHeartIcon />}
            {entry.type==="Hospital" && <LocalHospitalIcon />}
            {entry.type==="OccupationalHealthcare" &&  <WorkIcon />}
            {entry.type==="OccupationalHealthcare" &&  ' ' + entry.employerName}
          </div>
          <div><i>{entry.description}</i></div>
          
          {entry.diagnosisCodes && (
            <ul>
              {entry.diagnosisCodes.map(code => (
                <li key={code}>
                  {code}&nbsp;
                  {diagnosisName(code)}
                </li>
              ))}
            </ul>
          )}

          <EntryDetails entry={entry} />
          <div>diagnose by {entry.specialist}</div>
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
