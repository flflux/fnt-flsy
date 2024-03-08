// import { Link as RouterLink, useLocation } from 'react-router-dom';
// import styles from './bread-crumbs.module.scss';
// import { Breadcrumbs, Link } from '@mui/material';

// /* eslint-disable-next-line */
// export interface BreadCrumbsProps {}

// export function BreadCrumbs(props: BreadCrumbsProps) {
//   const location = useLocation();
//   const pathnames = location.pathname.split('/').filter((x) => x);

//   return (
//     <Breadcrumbs separator="›" aria-label="breadcrumb">
//       <Link color={"inherit"} underline='hover' component={RouterLink} to="/home">
//         Home
//       </Link>
//       {pathnames.map((name, index) => {
//         const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
//         const isLast = index === pathnames.length - 1;

//         return (
//           <span key={name}>
//             {isLast ? (
//               name
//             ) : (
//               <Link component={RouterLink} color={"inherit"} underline='hover' to={routeTo}>
//                 {name}
//               </Link>

//             )}
//           </span>
//         );
//       })}
//     </Breadcrumbs>
//   );
// }

// export default BreadCrumbs;



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