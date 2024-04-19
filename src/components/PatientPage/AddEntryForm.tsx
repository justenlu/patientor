import { Button, TextField } from '@mui/material';
import { useState, SyntheticEvent } from 'react';
import { EntryFormValues } from '../../types';

interface Props {
  onSubmit: (values: EntryFormValues, afterSuccess: () => void) => void;
}

const AddEntryForm = ({onSubmit}: Props) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  const formStyle = {
    marginTop: 5,
    paddingTop: 5,
    paddingLeft: 8,
    border: 'dotted',
    borderWidth: 1,
    paddingBottom: 5
  };

  const closeForm = () => {
    setOpen(false);

    setDescription('');
    setDate('');
    setSpecialist('');
    setHealthCheckRating('');
    setDiagnosisCodes('');
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      type: 'HealthCheck',
      description,
      date,
      specialist,
      healthCheckRating: Number(healthCheckRating),
      diagnosisCodes: diagnosisCodes.split(',').map(code => code.trim()).filter(code => code.length>0)
    }, closeForm);
  };

  if (!open) { 
    return (
      <div>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add New Health Check Entry
        </Button>
      </div>
    );
  } else {
    return (
      <div style={formStyle}>
        <h3>New health chech entry</h3>
        <form onSubmit={addEntry}>
          <TextField
            label="description"
            fullWidth 
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
          <TextField
            label="date"
            fullWidth 
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
          <TextField
            label="specialist"
            fullWidth 
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
          />
          <TextField
            label="health check rating"
            fullWidth 
            value={healthCheckRating}
            onChange={({ target }) => setHealthCheckRating(target.value)}
          />
          <TextField
            label="diagnosis codes"
            fullWidth 
            value={diagnosisCodes}
            onChange={({ target }) => setDiagnosisCodes(target.value)}
          />
        
          <Button
            color="secondary"
            variant="contained"
            type="button"
            onClick={closeForm}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
          >
            Add
          </Button>
        </form>
      </div>
    );
  }
};

export default AddEntryForm;