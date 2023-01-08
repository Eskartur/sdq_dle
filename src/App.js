import "@fontsource/clear-sans";
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@material-ui/styles';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import seediq from './seediq.json';

const useStyles = makeStyles({
  letter: {
    width: 60,
    height: 60,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-o-user-select": "none",
    "user-select": "none",
  },
  key: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-o-user-select": "none",
    "user-select": "none",
    cursor: "pointer",
  },
  header: {
    "-webkit-user-select": "none",
    "-khtml-user-select": "none",
    "-moz-user-select": "none",
    "-o-user-select": "none",
    "user-select": "none",
  }
});

function SlideTransition(props) {
  return <Slide {...props} direction="down"/>;
}

function App() {

  const theme = createTheme({
    typography: {
      fontFamily: 'Clear Sans, Helvetica Neue, Arial, sans-serif'
    }
  });

  const classes = useStyles();

  const [possibleWords, setPossibleWords] = useState([]);
  const [greenLetters, setGreenLetters] = useState([]);
  const [yellowLetters, setYellowLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [mode, setMode] = useState("loading");
  const [answer, setAnswer] = useState(["","","","",""]);
  const [guessesList, setGuessesList] = useState([["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]]);
  const [comparedList, setComparedList] = useState([["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]]);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [dictionary, setDictionary] = useState([]);
  const [answerIndex, setAnswerIndex] = useState(-1);
  const [alertMessage, setAlertMessage] = useState({text: "", type: "", open: false});
  const [answerStatus, setAnswerStatus] = useState("");
  const [pallete, setPallete] = useState({a: "#6aaa64", b: "#c9b458", x:"#86888a"})

  useEffect(async () => {
    let words = seediq.map((entry)=>entry.word.toLowerCase())
    setPossibleWords(words);
    setDictionary(seediq);
    let randIndex = Math.floor((Math.random()*1505));
    let word = words[randIndex];
    setAnswerIndex(randIndex);
    setAnswer(word.split(""));
    setMode("guessing");
  }, []);

  useEffect(() => {
    if (guessesList[currentWord-1]?.join("")===answer.join("")) {
      setAnswerStatus("success");
      setMode("success");
    }
    else if (currentWord===8) {
      setAnswerStatus("failure");
      setMode("failure");
    }
  }, [currentWord]);

  useEffect(() => {
    if (mode==="success") {
      setAlertMessage({text: "Correct! 答對了！", type: "success", open: true});
      let successTimer = setTimeout(() => setMode("answer"), 1500);
      return () => {
        clearTimeout(successTimer);
      };
    }
    else if (mode==="failure") {
      setAlertMessage({text: "Almost there... 好可惜...", type: "info", open: true});
      let failureTimer = setTimeout(() => setMode("answer"), 1500);
      return () => {
        clearTimeout(failureTimer);
      };
    }
  }, [mode]);

  const characters = ["a","b","c","d","e","g","h","i","j","k","l","m","n","f","o","p","q","r","s","t","u","x","w","y"];

  const display = ["A","B","C","D","E","G","H","I","J","K","L","M","N","Ng","O","P","Q","R","S","T","U","X","W","Y"];

  const transliterate = (letter) => {
    let find = characters.findIndex((i)=>i===letter);
    if (find >= 0) return display[find];
    else return " ";
  }

  const compare = (guess, answer) => {
    let guessed = guessedLetters
    let yellow = yellowLetters;
    let green = greenLetters;
    let answerLetters = answer.slice();
    let result = ["x","x","x","x","x"]
    for(let i=0;i<5;i++){
      if (guess[i] === answer[i]) {
        result[i] = "a";
        answerLetters[i] = "";
        if (!green.includes(guess[i])) green.push(guess[i]);
      }
      if (!guessed.includes(guess[i])) guessed.push(guess[i]);
    }
    for(let i=0;i<5;i++){
      if (guess[i] !== answer[i]) {
        let find = answerLetters.findIndex((letter)=>letter === guess[i]);
        if (find >= 0) {
          result[i] = "b";
          answerLetters[find] = "";
          if (!yellow.includes(guess[i])) yellow.push(guess[i]);
        }
      }
    }
    setGuessedLetters(guessed);
    setGreenLetters(green);
    setYellowLetters(yellow);
    return result;
  }

  const newWord = () => {
    let randIndex = Math.floor((Math.random()*1505));
    let word = possibleWords[randIndex];
    setAnswerIndex(randIndex);
    setAnswer(word.split(""));
    setCurrentLetter(0);
    setCurrentWord(0);
    setGreenLetters([]);
    setYellowLetters([]);
    setGuessedLetters([]);
    setGuessesList([["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]]);
    setComparedList([["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""],["","","","",""]]);
    setMode("guessing");
  }

  const inputLetter = (input) => {
    if (currentWord < 8 && mode === "guessing") {
      if (input === "backspace") {
        if (currentLetter > 0) {
          setGuessesList(guessesList.map((guess, index)=>index===currentWord?guess.map((letter, index)=>index===currentLetter-1?"":letter):guess));
          setCurrentLetter(currentLetter-1);
        }
      }
      else if (input === "enter") {
        if (currentLetter === 5 && possibleWords.includes(guessesList[currentWord].join(""))) {
          setComparedList(comparedList.map((comparison,index)=>index===currentWord?compare(guessesList[currentWord],answer):comparison));
          setCurrentWord(currentWord+1);
          setCurrentLetter(0);
        }
        else if (currentLetter === 5) {
          setAlertMessage({text: "Not in word list! 不在字詞列表中！", type: "error", open: true});
        }
        else {
          setAlertMessage({text: "Not enough letters! 字母數量不夠！", type: "error", open: true});
        }
      }
      else if (input === "random") {
        let randomGuess = possibleWords[Math.floor((Math.random()*possibleWords.length))].split("");
        setGuessesList(guessesList.map((guess, index)=>index===currentWord?randomGuess:guess));
        setComparedList(comparedList.map((comparison,index)=>index===currentWord?compare(randomGuess,answer):comparison));
        setCurrentWord(currentWord+1);
        setCurrentLetter(0);
      }
      else {
        if (currentLetter < 5) {
          setGuessesList(guessesList.map((guess, index)=>index===currentWord?guess.map((letter, index)=>index===currentLetter?input:letter):guess));
          setCurrentLetter(currentLetter+1);
        }
      }
    }
    else if (mode === "finished" && input === "enter") {
      newWord();
    }
  }

  const share = () => {
    navigator.clipboard.writeText(`Seedle ${answerStatus==="success"?currentWord:"x"}/8\n${comparedList.map((compared, index)=>index<currentWord?compared.map((color)=>color==="a"?(pallete.a==="#6aaa64"?"🟩":"🟧"):(color==="b"?(pallete.a==="#6aaa64"?"🟨":"🟦"):"⬜")).join("")+"\n":"").join("")}`)
    setAlertMessage({text: "Copied to clipboard! 已複製到剪貼簿！", type: "info", open: true});
  }
  
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box sx={{ height: '98vh' }}>
          <Stack
            direction="column"
            justifyContent="space-between"
            alignItems="stretch"
            sx={{ height: '100%' }}
          >
            <Box className={classes.header} sx={{ textAlign: 'center' }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h4"><IconButton onClick={()=>setPallete(pallete.a==="#6aaa64"?{a: "#f5793a", b: "#85c0f9", x:"#86888a"}:{a: "#6aaa64", b: "#c9b458", x:"#86888a"})}><PaletteOutlinedIcon/></IconButton></Typography>
                <Typography variant="h4">
                  SEEDLE
                </Typography>
                <Typography variant="h4"><IconButton onClick={()=>setMode(mode==="finished"?"answer":"links")}><LeaderboardOutlinedIcon/></IconButton></Typography>
              </Stack>
              <Divider/>
            </Box>
            <Box sx={{width: 350, height: 560}} m={'0 auto'} mt={1}>
              {mode==="loading"?
              <Stack sx={{height: "100%"}} direction="column" justifyContent="center" alignItems="center">
                <CircularProgress/>
              </Stack>
              :
              <Grid container spacing={1}>
              {
                guessesList.map((guess, wordIndex)=>
                <Grid key={`${wordIndex}`} container item sx={{width: '100%'}}>
                  {guess.map((letter, letterIndex) =>
                    <Grid key={`${wordIndex}-${letterIndex}`} item xs={2.4}>
                      <Paper className={classes.letter} sx={{backgroundColor: !comparedList[wordIndex][letterIndex]?"":(comparedList[wordIndex][letterIndex]==="a"?pallete.a:(comparedList[wordIndex][letterIndex]==="b"?pallete.b:pallete.x)), color: comparedList[wordIndex][letterIndex]?"white":"black"}} variant="outlined">
                        <Typography variant="h3">
                          {transliterate(letter)}
                        </Typography>
                      </Paper>
                    </Grid>
                    )
                  }
                </Grid>
                )
              }
              </Grid>
              }
            </Box>
            <Box sx={{width: '100%', height: 190}} mt={1}>
              <Grid container spacing={1}>
              {
                [
                [{letter: 'A', input: 'a'},
                {letter: 'B', input: 'b'},
                {letter: 'C', input: 'c'},
                {letter: 'D', input: 'd'},
                {letter: 'E', input: 'e'},
                {letter: 'G', input: 'g'},
                {letter: 'H', input: 'h'},
                {letter: 'I', input: 'i'}],

                [{letter: 'J', input: 'j'},
                {letter: 'K', input: 'k'},
                {letter: 'L', input: 'l'},
                {letter: 'M', input: 'm'},
                {letter: 'N', input: 'n'},
                {letter: 'Ng', input: 'f'},
                {letter: 'O', input: 'o'},
                {letter: 'P', input: 'p'}],

                [{letter: 'Q', input: 'q'},
                {letter: 'R', input: 'r'},
                {letter: 'S', input: 's'},
                {letter: 'T', input: 't'},
                {letter: 'U', input: 'u'},
                {letter: 'W', input: 'w'},
                {letter: 'X', input: 'x'},
                {letter: 'Y', input: 'y'}],

                [{letter: 'Enter', input: 'enter'},
                {letter: 'Random', input: 'random'},
                {letter: 'Backspace', input: 'backspace'}]

                ].map((keys, y)=>
                <Grid key={`${y}`} container item sx={{width: '100%'}} spacing={1}>
                {
                  keys.map((key, x)=>
                  <Grid key={`${y}-${x}`} item xs={key.letter.length>2?4:1.5}>
                    <Paper className={classes.key} sx={{height: 30, backgroundColor: greenLetters.includes(key.input)?pallete.a:(yellowLetters.includes(key.input)?pallete.b:(guessedLetters.includes(key.input)?pallete.x:"#d8d8d8")), color: guessedLetters.includes(key.input)?"white":"black"}} variant="outlined" onClick={()=>inputLetter(key.input)}>
                      <Typography sx={{fontSize: 16}}>
                        {(key.letter==="Enter" && (mode==="finished" || mode==="answer"))?"New Game":(key.letter==="Backspace"?<BackspaceOutlinedIcon fontSize="inherit" sx={{ position: 'relative', top: 3 }}/>:key.letter)}
                      </Typography>
                    </Paper>
                  </Grid>
                  )
                }
                </Grid>
                )
              }
              </Grid>
            </Box>
          </Stack>
        </Box>
      </Container>
      {mode==="answer"?
      <Dialog maxWidth='xs' open={mode==="answer"}>
        <DialogTitle>
          {answerStatus==="success"?"Correct! 答對了！":"Almost there... 好可惜..."}
          <IconButton
          onClick={()=>setMode("finished")}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <h3>答案：</h3>
          <DialogContentText>{dictionary[answerIndex]?.word.replace('f', 'ng')}</DialogContentText>
          <h3>詞頻：</h3>
          <DialogContentText>{"★".repeat(dictionary[answerIndex]?.stars)}</DialogContentText>
          <h3>解釋：</h3>
          <DialogContentText>{dictionary[answerIndex]?.definition}</DialogContentText>
          <br/>
          <Divider/>
        </DialogContent>
        <DialogActions>
          <Button size="large" variant="contained" onClick={newWord}>New Game</Button>
          <Button size="large" variant="contained" color="success" onClick={share}>Share<ShareIcon/></Button>
        </DialogActions>
      </Dialog>
      :
      <></>
      }
      {mode==="links"?
      <Dialog maxWidth='xs' open={mode==="links"}>
        <DialogTitle>
          Links 連結
          <IconButton
          onClick={()=>setMode("guessing")}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info"><Link href="https://e-dictionary.ilrdf.org.tw/index.htm" target="_blank" rel="noopener noreferrer">原住民族語言線上辭典</Link></Alert>
        </DialogContent>
      </Dialog>
      :
      <></>
      }
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={alertMessage.open}
        TransitionComponent={SlideTransition}
        autoHideDuration={1000}
        onClose={()=>setAlertMessage({...alertMessage, open: false})}
      >
        <Alert severity={alertMessage.type?alertMessage.type:"error"} icon={false} variant="filled" sx={{ width: '100%' }}>
          {alertMessage.text}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;