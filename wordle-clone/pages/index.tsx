import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';

const Home: NextPage = () => {

  const maxAttempts = 6

  const [answer, setAnswer] = useState('');

  const [status, setStatus] = useState('');
  const [showNEL, setShowNEL] = useState(false);
  


  const defaultAttemps = [
    [{
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }],
    [{
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }],
    [{
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }],    [{
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }],    [{
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }],    [{
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }, 
    {
      valid: false,
      correct: false,
      value: ''
    }],
  ];

  const [disabledButtons, setDisabled] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [validLetters, setValidLetters] = useState<string[]>([]);

  const [game, setGame] = useState({
    attemptCount: 0,
    letterPositon: 0,
    attemps: defaultAttemps,
  });

const getDailyWord = async () => {
  const response = await fetch('/api/word/');
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`)
  }

  const data = await response.json();
  console.log(data);

  setAnswer(data.word);
};

  const numberOfApperance = (ch: string) => {
    let count = answer.toLocaleLowerCase().split('').filter(x => x == ch).length
    return count

  }
  

  const gameBoxElement = (row: number, position: number) => {
    return game.attemps[row][position].value;
  }

  const getBackgrounColoring = (row: number, position: number) => {
    let item = game.attemps[row][position];
    if (item.correct) {
      return '#20BA08'
    }

    if (item.valid) {
      if (numberOfApperance(item.value.toLocaleLowerCase()) === 1) {
        if (correctLetters.includes(item.value.toLocaleLowerCase())) {
          return '#484848'
        }
        return '#B6BA08'
      }
      
      return '#B6BA08'
    }

    return '#484848'
  };

  const getDisabled = (value: string) => {
    if (disabledButtons.includes(value.toLowerCase())) {
      return '#252525'
    }

    if (correctLetters.includes(value.toLocaleLowerCase())) {
      return '#20BA08'
    }

    if (validLetters.includes(value.toLocaleLowerCase())) {
      return '#B6BA08'
    }
    return '#484848'
  }


  const handleDeleteInput = () => {
      if (status === 'won' || status === 'lost') {
        return
      }
    
      if (game.letterPositon === 0) {
        return
      }
      let temp = [...game.attemps];
      let newPosition = game.letterPositon - 1;
      temp[game.attemptCount][newPosition].value = '';
      setGame({
        attemptCount: game.attemptCount,
        letterPositon: newPosition,
        attemps: temp,
      })
  
      return;
  }
  
  const handleInput = (input: string) => {

    if (status === 'won' || status === 'lost') {
      return
    }

    if (game.attemptCount > 6) {
      console.log('no more attemps');
      return;
    }
    

    if (game.letterPositon > 4) {
      console.log('Amount of letters maxed')
      return;
    }

    let temp = [...game.attemps];
    let newPosition = game.letterPositon + 1;
    temp[game.attemptCount][game.letterPositon].value = input;

    setGame({
      attemptCount: game.attemptCount,
      letterPositon: newPosition,
      attemps: temp,
    })


  };

  const handleEnter = () => {
    if (status === 'won' || status === 'lost') {
      return
    }

      if (game.letterPositon !== 5) {
        console.log("NOT ENOUGH")
        setShowNEL(true);
        setTimeout(() => {
          setShowNEL(false)
        }, 1500);
        return;
      }

      if (game.attemptCount === 6) {
        console.log("no more")
        return;
      }

      let current = game.attemps[game.attemptCount];

      let updated = validateAnswer(current);
      didWin(updated);

      let temp = [...game.attemps];
      temp[game.attemptCount] = updated;

      setGame({
        attemptCount: game.attemptCount + 1,
        letterPositon: 0,
        attemps: temp,
      });

      if (game.attemptCount === 5) {
        setStatus('lost');
      }

  };


  const validateAnswer = (current: any) => {
    let temp = [...current]
    let validation = answer.toLowerCase().split('');
    let notIncludedLetters: any[] = [];
    let valid: any[] = [];
    let correct: any[] = [];

    for (let item in temp) {
        let pos = temp[item];
        
        if (validation.includes(pos.value.toLowerCase())) {
          temp[item].valid = true;
          valid.push(pos.value.toLowerCase())

        } else {
          notIncludedLetters.push(pos.value.toLowerCase());
          continue
        }

        if (validation[item] === pos.value.toLowerCase()) {
          temp[item].correct = true
          correct.push(pos.value.toLowerCase())
        }
    }

    setDisabled([...notIncludedLetters, ...disabledButtons]);
    setValidLetters([...valid, ...validLetters]);
    setCorrectLetters([...correct, ...correctLetters]);

    return temp
  }


  const didWin = (updated: any) => {
    let tempWon = true;
    for (let item of updated) {
      if (!item.correct) {
        tempWon = false;
      }
    }

    setStatus(tempWon ? 'won': '')
  }



useEffect(() => {
  getDailyWord();
}, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Wordle The Clone</title>
        <meta name="description" content="Famous wordle the clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.navbar}>
          <button>Menu</button>
          <h1>Wordle</h1>
          <button>Settings</button>
        </div>
        {status === 'won' ? <div className={styles.wonMessage}>You Won!</div>: null}
        {status === 'lost' ? <div className={styles.wonMessage}>You Lost!</div>: null}
        {showNEL ?  <div className={styles.nelMesg}>Not Enough Letters!</div> : null}
                
        <div id='game-board' className={styles.gameboard}>
          <div id="card-0-1" style={{backgroundColor: getBackgrounColoring(0, 0)}} className={styles.gamebox}>{gameBoxElement(0, 0)}</div>
          <div id="card-0-2" style={{backgroundColor: getBackgrounColoring(0, 1)}} className={styles.gamebox}>{gameBoxElement(0, 1)}</div>
          <div id="card-0-3" style={{backgroundColor: getBackgrounColoring(0, 2)}} className={styles.gamebox}>{gameBoxElement(0, 2)}</div>
          <div id="card-0-4" style={{backgroundColor: getBackgrounColoring(0, 3)}} className={styles.gamebox}>{gameBoxElement(0, 3)}</div>
          <div id="card-0-5" style={{backgroundColor: getBackgrounColoring(0, 4)}} className={styles.gamebox}>{gameBoxElement(0, 4)}</div>
          <div id="card-1-1" style={{backgroundColor: getBackgrounColoring(1, 0)}} className={styles.gamebox}>{gameBoxElement(1, 0)}</div>
          <div id="card-1-2" style={{backgroundColor: getBackgrounColoring(1, 1)}} className={styles.gamebox}>{gameBoxElement(1, 1)}</div>
          <div id="card-1-3" style={{backgroundColor: getBackgrounColoring(1, 2)}} className={styles.gamebox}>{gameBoxElement(1, 2)}</div>
          <div id="card-1-4" style={{backgroundColor: getBackgrounColoring(1, 3)}} className={styles.gamebox}>{gameBoxElement(1, 3)}</div>
          <div id="card-1-5" style={{backgroundColor: getBackgrounColoring(1, 4)}} className={styles.gamebox}>{gameBoxElement(1, 4)}</div>
          <div id="card-2-1" style={{backgroundColor: getBackgrounColoring(2, 0)}} className={styles.gamebox}>{gameBoxElement(2, 0)}</div>
          <div id="card-2-2" style={{backgroundColor: getBackgrounColoring(2, 1)}} className={styles.gamebox}>{gameBoxElement(2, 1)}</div>
          <div id="card-2-3" style={{backgroundColor: getBackgrounColoring(2, 2)}} className={styles.gamebox}>{gameBoxElement(2, 2)}</div>
          <div id="card-2-4" style={{backgroundColor: getBackgrounColoring(2, 3)}} className={styles.gamebox}>{gameBoxElement(2, 3)}</div>
          <div id="card-2-5" style={{backgroundColor: getBackgrounColoring(2, 4)}} className={styles.gamebox}>{gameBoxElement(2, 4)}</div>
          <div id="card-3-1" style={{backgroundColor: getBackgrounColoring(3, 0)}} className={styles.gamebox}>{gameBoxElement(3, 0)}</div>
          <div id="card-3-2" style={{backgroundColor: getBackgrounColoring(3, 1)}} className={styles.gamebox}>{gameBoxElement(3, 1)}</div>
          <div id="card-3-3" style={{backgroundColor: getBackgrounColoring(3, 2)}} className={styles.gamebox}>{gameBoxElement(3, 2)}</div>
          <div id="card-3-4" style={{backgroundColor: getBackgrounColoring(3, 3)}} className={styles.gamebox}>{gameBoxElement(3, 3)}</div>
          <div id="card-3-5" style={{backgroundColor: getBackgrounColoring(3, 4)}} className={styles.gamebox}>{gameBoxElement(3, 4)}</div>
          <div id="card-4-1" style={{backgroundColor: getBackgrounColoring(4, 0)}} className={styles.gamebox}>{gameBoxElement(4, 0)}</div>
          <div id="card-4-2" style={{backgroundColor: getBackgrounColoring(4, 1)}} className={styles.gamebox}>{gameBoxElement(4, 1)}</div>
          <div id="card-4-3" style={{backgroundColor: getBackgrounColoring(4, 2)}} className={styles.gamebox}>{gameBoxElement(4, 2)}</div>
          <div id="card-4-4" style={{backgroundColor: getBackgrounColoring(4, 3)}} className={styles.gamebox}>{gameBoxElement(4, 3)}</div>
          <div id="card-4-5" style={{backgroundColor: getBackgrounColoring(4, 4)}} className={styles.gamebox}>{gameBoxElement(4, 4)}</div>
          <div id="card-5-1" style={{backgroundColor: getBackgrounColoring(5, 0)}} className={styles.gamebox}>{gameBoxElement(5, 0)}</div>
          <div id="card-5-2" style={{backgroundColor: getBackgrounColoring(5, 1)}} className={styles.gamebox}>{gameBoxElement(5, 1)}</div>
          <div id="card-5-3" style={{backgroundColor: getBackgrounColoring(5, 2)}} className={styles.gamebox}>{gameBoxElement(5, 2)}</div>
          <div id="card-5-4" style={{backgroundColor: getBackgrounColoring(5, 3)}} className={styles.gamebox}>{gameBoxElement(5, 3)}</div>
          <div id="card-5-5" style={{backgroundColor: getBackgrounColoring(5, 4)}} className={styles.gamebox}>{gameBoxElement(5, 4)}</div>
        </div>

        <div className={styles.gameinput}>
          <div className={styles.gameinputrow}>  
            <button style={{backgroundColor: getDisabled('Q')}} onClick={() => {handleInput('Q')}} className={styles.gameinputbutton}>Q</button>
            <button style={{backgroundColor: getDisabled('W')}} onClick={() => {handleInput('W')}} className={styles.gameinputbutton}>W</button>
            <button style={{backgroundColor: getDisabled('E')}} onClick={() => {handleInput('E')}} className={styles.gameinputbutton}>E</button>
            <button style={{backgroundColor: getDisabled('R')}} onClick={() => {handleInput('R')}} className={styles.gameinputbutton}>R</button>
            <button style={{backgroundColor: getDisabled('T')}} onClick={() => {handleInput('T')}} className={styles.gameinputbutton}>T</button>
            <button style={{backgroundColor: getDisabled('Y')}} onClick={() => {handleInput('Y')}} className={styles.gameinputbutton}>Y</button>
            <button style={{backgroundColor: getDisabled('U')}} onClick={() => {handleInput('U')}} className={styles.gameinputbutton}>U</button>
            <button style={{backgroundColor: getDisabled('I')}} onClick={() => {handleInput('I')}} className={styles.gameinputbutton}>I</button>
            <button style={{backgroundColor: getDisabled('O')}} onClick={() => {handleInput('O')}} className={styles.gameinputbutton}>O</button>
            <button style={{backgroundColor: getDisabled('P')}} onClick={() => {handleInput('P')}} className={styles.gameinputbutton}>P</button>
          </div>
          <div className={styles.gameinputrow}>  
            <button style={{backgroundColor: getDisabled('A')}} onClick={() => {handleInput('A')}} className={styles.gameinputbutton}>A</button>
            <button style={{backgroundColor: getDisabled('S')}} onClick={() => {handleInput('S')}} className={styles.gameinputbutton}>S</button>
            <button style={{backgroundColor: getDisabled('D')}} onClick={() => {handleInput('D')}} className={styles.gameinputbutton}>D</button>
            <button style={{backgroundColor: getDisabled('F')}} onClick={() => {handleInput('F')}} className={styles.gameinputbutton}>F</button>
            <button style={{backgroundColor: getDisabled('G')}} onClick={() => {handleInput('G')}} className={styles.gameinputbutton}>G</button>
            <button style={{backgroundColor: getDisabled('H')}} onClick={() => {handleInput('H')}} className={styles.gameinputbutton}>H</button>
            <button style={{backgroundColor: getDisabled('J')}} onClick={() => {handleInput('J')}}className={styles.gameinputbutton}>J</button>
            <button style={{backgroundColor: getDisabled('K')}} onClick={() => {handleInput('K')}} className={styles.gameinputbutton}>K</button>
            <button style={{backgroundColor: getDisabled('L')}} onClick={() => {handleInput('L')}} className={styles.gameinputbutton}>L</button>
          </div>
          <div className={styles.gameinputrow}>  
            <button onClick={() => {handleEnter()}} className={styles.gameinputbutton}>ENTER</button>
            <button style={{backgroundColor: getDisabled('Z')}} onClick={() => {handleInput('Z')}} className={styles.gameinputbutton}>Z</button>
            <button style={{backgroundColor: getDisabled('X')}} onClick={() => {handleInput('X')}} className={styles.gameinputbutton}>X</button>
            <button style={{backgroundColor: getDisabled('C')}} onClick={() => {handleInput('C')}} className={styles.gameinputbutton}>C</button>
            <button style={{backgroundColor: getDisabled('V')}} onClick={() => {handleInput('V')}} className={styles.gameinputbutton}>V</button>
            <button style={{backgroundColor: getDisabled('B')}} onClick={() => {handleInput('B')}} className={styles.gameinputbutton}>B</button>
            <button style={{backgroundColor: getDisabled('N')}} onClick={() => {handleInput('N')}} className={styles.gameinputbutton}>N</button>
            <button style={{backgroundColor: getDisabled('M')}} onClick={() => {handleInput('M')}} className={styles.gameinputbutton}>M</button>
            <button onClick={() => {handleDeleteInput()}} className={styles.gameinputbutton}>DEL</button>
          </div>
        </div>


      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
