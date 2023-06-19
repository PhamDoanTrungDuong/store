import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Chip, Stack, Typography } from '@mui/material';
import useCountDown from '../hooks/useCountDown';
import { useTranslation } from "react-i18next";

export interface HeadDealOfDayProps {}

const HeadDealOfDay: React.FC = (props: HeadDealOfDayProps) => {
  const { countDown } = useCountDown();
  const { t } = useTranslation();

  return (
    <Stack
      sx={{
        pb: 1,
        justifyContent: 'space-between',
        flexFlow: { lg: 'row wrap', xs: 'row wrap' },
        alignItems: 'center',
      }}
    >
      <Stack sx={{ flexFlow: { lg: 'row wrap', xs: 'row wrap' }, alignItems: 'center' }}>
        <Typography variant="h5">{t('Home_DealOfDay')}</Typography>
        {Boolean(countDown) && (
          <>
          <Chip
            icon={<AccessTimeIcon />}
            variant="filled"
            size="medium"
            color="error"
            label={countDown}
            sx={{ ml: 1 }}
          />
          <div>
          </div>
          </>
        )}
      </Stack>
      {/* <Button color="secondary">
        <Link component={RouterLink} to="#">
          View all
        </Link>
      </Button> */}
    </Stack>
  );
}

export default HeadDealOfDay