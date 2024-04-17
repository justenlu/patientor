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

const OccupationalHealthcareEntryDetails = 
  ({entry}: {entry: OccupationalHealthcareEntry}) => (
  <div>
    {entry.sickLeave && (
      <div>sickleave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</div>
    )}
  </div>
);

const HealthCheckEntryDetails =
  ({entry}: {entry: HealthCheckEntry}) => {
  const rating:number = entry.healthCheckRating;
  return (
    <HealthRatingBar rating={rating} showText={false}/>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled entry type: ${JSON.stringify(value)}`
  );
};

interface EntryDetailsProps {
  entry: Entry
}

const EntryDetails = ({entry}: EntryDetailsProps ) => {
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
      {patient.entries.map(e => (
        <div key={e.id} style={entryStyle}>
          <div>
            {e.date}&nbsp;
            {e.type==="HealthCheck" && <MonitorHeartIcon />}
            {e.type==="Hospital" && <LocalHospitalIcon />}
            {e.type==="OccupationalHealthcare" &&  <WorkIcon />}
            {e.type==="OccupationalHealthcare" &&  ' ' + e.employerName}
          </div>
          <div><i>{e.description}</i></div>
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
          <EntryDetails entry={e} />
          <div>diagnose by {e.specialist}</div>
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
