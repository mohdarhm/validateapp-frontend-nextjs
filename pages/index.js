import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import 'animate.css';

export default function Home() {
  const [currentIp, setCurrentIp] = useState('loading..');
  const [serverIp, setServerIp] = useState('loading..');
  const [message, setMessage] = useState('ready to recieve messages.');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  let icon = null;
  let messageText = 'Ready.';
  if (message === 'message') {
    icon = <TaskAltIcon fontSize='large' color='success' className='animate__animated animate__fadeInUp' />;
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

        fetch('https://secret-361016.et.r.appspot.com/getserverip/')
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch simulated external IP');
            }
            return response.json();
          })
          .then(data => {
            setServerIp(data.external_ip || 'void');
          })
          .catch(error => {
            console.error('Error getting simulated external IP:', error);
            setServerIp('error :<');
          });
      })
      .catch(error => {
        console.error('Error getting public IP:', error);
        setCurrentIp('error :<')
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
    fetch('https://secret-361016.et.r.appspot.com/add_ip_to_firewall/', {
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400&display=swap" />
        <link href="https://fonts.googleapis.com/css2?family=Reddit+Mono:wght@200..900&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Radio+Canada+Big:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet"></link>

      </Head>

      <main>
        <h1 className={`${styles.title} animate__animated animate__zoomIn`}>
         pawlice! freeezee!
        </h1>
        <br />

        <img src="/cat.jpg" alt="cat" width={450} height={300} style={{paddingBottom:'20px'}} />

        <div className={styles.card}>
          <p className='btnhelp'>//server & client info. 'void' indicates server outage.</p>
          <h2>Server IP: {serverIp} </h2>
          <h2>Your IP: {currentIp} </h2>
        </div>


        <div className={styles.buttonRow}>
            <div className={styles.cardButton} onClick={copyServerIp}>
              <p className='btnhelp'>//clicking this will copy server IP</p>
              <h3>Copy IP &rarr;</h3>
              {copied && <TaskAltIcon fontSize='large' color='success' className='animate__animated animate__fadeInUp' />}
            </div>

            <div className={styles.cardButton} onClick={addToFirewall}>
            <p className='btnhelp'>//clicking this will validate ur IP</p>
              <h3>Add IP &rarr;</h3>
              {message === 'message' || message === 'error' || message === 'alreadyexists' ? (
                icon
              ) : null}
            </div>
          </div>
        
        <h2 className='msghelp'>Server Message &darr;</h2>
        <div className='svrmsg'>
          <p className='btnhelp'>//messages from the server, if the request leaves the client.</p>
          <span>{messageText}</span> 
        </div>
      </main>

      <footer>
        <div className='footcol'>
        <a
          href="https://www.youtube.com/watch?v=xPxCXPmxOcM"
          target="_blank"
          rel="noopener noreferrer"
        >
          loosing my shit here
        </a>
        <a
          href="https://github.com/mohdarhm"
          target="_blank"
          rel="noopener noreferrer"
        >
          ARHM made dis.
        </a>
        </div>
        
      </footer>

      <style jsx>{`
        .svrmsg {
          margin-top: 20px;
          font-family: 'Reddit Mono', monospace;
          font-size: 15px;
          width:400px;
          border-radius:20px;
          padding: 50px;
          background-color: #f7faff;
          border: 1px solid #c0d7ff;


        }
        .msghelp{
          font-family: 'Radio Canada Big';

        }
        .btnhelp{
          color:gray;
          font-family: 'Reddit Mono', monospace;
          font-size:14px;

        }
        .${styles.card} {
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          width: 450px;
          text-align: left;
        }
        .${styles.buttonRow} {
          display: flex;
          flex-direction: column;
          margin: 20px;
          padding: 20px;
        }
       
        .${styles.cardButton}:hover {
          background-color: #f0f0f0;
        }
        
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
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
          padding-bottom:15px;
        }
        footcol{
          display: flex;
          flex-direction: column;
        }
        h3{
          font-family: 'Radio Canada Big';
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
