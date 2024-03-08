import styles from './page-not-found.module.scss';

/* eslint-disable-next-line */
export interface PageNotFoundProps {}

export function PageNotFound(props: PageNotFoundProps) {
  return (
<div className={styles.container}>
      <div className={styles['error-code']}>404</div>
      <div className={styles['error-message']}>Page Not Found</div>
    </div>
  );
}

export default PageNotFound;
