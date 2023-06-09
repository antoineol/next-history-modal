import { Inter } from 'next/font/google';
import Head from 'next/head';
import Image from 'next/image';

import { BrowsableModal } from '../components/BrowsableModal';
import classes from '../styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* padding-left: trick to not shift the content when the modal is open and the scroll is disabled. */}
      {/* https://stackoverflow.com/a/30293718/4053349 */}
      <main className={classes.main} style={{ paddingLeft: 'calc(100vw - 100%)' }}>
        <div className={`${classes.description} ${classes.center}`}>
          <BrowsableModal />
        </div>

        <div className={classes.center}>
          <Image className={classes.logo} src="/next.svg" alt="Next.js Logo" width={180} height={37} priority />
          <div className={classes.thirteen}>
            <Image src="/thirteen.svg" alt="13" width={40} height={31} priority />
          </div>
        </div>
      </main>
    </>
  );
}
