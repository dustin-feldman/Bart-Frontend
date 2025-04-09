// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function PromptPage() {
  return (
    <MainCard title="Prompt List">
      <Typography variant="body2">
        The prompt list is being updated soon. Stay tuned for new and improved features! We are working on adding a more dynamic and interactive list of prompts to enhance your experience. Please check back shortly.
      </Typography>
    </MainCard>
  );
}
