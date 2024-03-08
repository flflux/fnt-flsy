import React from "react";
import styles from './home.module.scss';
import SocietyCards from '../../Component/society-cards/society-cards';



/* eslint-disable-next-line */
export interface HomeProps {
}

export function Home() {

    return (
        <div className={styles['container']}>
          <h1 className={styles['welcome']}>Welcome!</h1>
          <SocietyCards />
        </div>
      
    );
}

export default Home;
