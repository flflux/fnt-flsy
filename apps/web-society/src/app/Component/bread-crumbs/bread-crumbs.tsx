import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface BreadcrumbsProps {
  paths: { to?: string; label: string }[];
}

const CustomBreadcrumbs = ({ paths }: BreadcrumbsProps) => {
  return (
    <MuiBreadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {paths.map(({ to, label }, index) => {
        return to ? (
          <Link
            component={RouterLink}
            underline="none"
            color={blue[400]}
            to={to}
            key={index}
            sx={{ ':hover': { color: blue[600] } }}
          >
            {label}
          </Link>
        ) : (
          <Typography color="text.primary" key={index}>
            {label}
          </Typography>
        );
      })}
    </MuiBreadcrumbs>
  );
};
export default CustomBreadcrumbs;