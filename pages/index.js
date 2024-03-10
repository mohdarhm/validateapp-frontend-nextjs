import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import 'animate.css';


export default function Home() {
  
  
  const [currentIp, setCurrentIp] = useState('');
  const [serverIp, setServerIp] = useState('');
  const [message, setMessage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  let icon = null;
  let messageText = null;

  if (message === 'message') {
    icon = <TaskAltIcon fontSize='large' color='success'className='animate__animated animate__fadeInUp' />;
    messageText = 'Successfully added!';
  } else if (message === 'error') {
    icon = <CancelIcon fontSize='large' color="secondary" className='animate__animated animate__fadeInUp' />;
    messageText = errorMessage;
  } else if (message === 'alreadyexists') {
    icon = <CloudSyncIcon fontSize='large' color="primary" className='animate__animated animate__fadeInUp' />;
    messageText = 'The IPs already added m8';
  }



  useEffect(() => {
    fetch('https://api.ipify.org/?format=json')
      .then(response => response.json())
      .then(publicData => {
        setCurrentIp(publicData.ip);

        fetch('https://plenary-anagram-408413.el.r.appspot.com/getserverip/')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch simulated external IP');
            }
            return response.json();
          })
          .then(data => {
            setServerIp(data.external_ip || 'N/A');
          })
          .catch(error => {
            console.error('Error getting simulated external IP:', error);
            setServerIp('N/A');
          });
      })
      .catch(error => {
        console.error('Error getting public IP:', error);
        // Handle error for public IP fetch
      });
  }, []);

  const copyServerIp = () => {
    navigator.clipboard.writeText(serverIp)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
      })
      .catch(error => {
        console.error('Error copying to clipboard:', error);
      });
  };


  const addToFirewall = () => {
    fetch('https://plenary-anagram-408413.el.r.appspot.com/add_ip_to_firewall/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_ip: currentIp }),
    })
      .then(response => response.json())
      .then(data => {
        setMessage(data.message || data.error || data.alreadyexists);
        const key = Object.keys(data)[0]; 
        setMessage(key);
        if (key === 'error' && data.error) {
          console.log(data.error)
          setErrorMessage(data.error);
        }
      })
      .catch(error => {
        console.error('Error adding to firewall:', error);
      });
  };




  return (
    <div className={styles.container}>
      <Head>
        <title>funny</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <h1 className={`${styles.title} animate__animated animate__zoomIn`}>
  holup its da police 
</h1>


        <br />

        <img src="/cat.jpg" alt="cat" width={300} height={300} />

        <h2>Server IP: {serverIp} </h2>
        <h2>Your IP: {currentIp} </h2>

        <div className={styles.grid}>

          <div className={styles.card} onClick={copyServerIp}>
            <h3>Click to copy server IP &rarr;</h3>
          </div>
          {copied && <TaskAltIcon fontSize='large' color='success' className='animate__animated animate__fadeInUp' />}

          <>
      <div className={styles.card} onClick={addToFirewall}>
        <h3>Add your IP &rarr;</h3>
      </div>
      
      {icon && (
        <div className={styles.iconContainer}>
          {icon}
          {/* <span>{messageText}</span> */}
        </div>
      )}
    </>
        </div>
      </main>
      <h2>SERVER MESSAGE &darr;</h2>
      <div className='svrmsg'>
      <span>{messageText}</span> 
      </div>
      <footer>
        <a
          href="https://www.youtube.com/watch?v=xPxCXPmxOcM"
          target="_blank"
          rel="noopener noreferrer"
        >
         loosing my shit here
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
