//@ts-nocheck
import { useState } from 'react'
const useRecognition = () => {
   const [content, setContent] = useState<any>();
   const [isVoice, setIsVoice] = useState<boolean>();
   const [error, setError] = useState<boolean>();
   const [errorMess, setErrorMess] = useState<any>();

   let SpeechRecognition = webkitSpeechRecognition;
   let SpeechGrammarList = webkitSpeechGrammarList;

   let grammar = '#JSGF V1.0;'

   let recognition = new SpeechRecognition();
   let speechRecognitionList = new SpeechGrammarList();
   speechRecognitionList.addFromString(grammar, 1);
   recognition.grammars = speechRecognitionList;
   recognition.lang = 'en-US';
   recognition.interimResults = false;

   //result
   recognition.onresult = function(event: any) {
      setIsVoice(false)
      let lastResult = event.results.length - 1;
      setContent(event.results[lastResult][0].transcript);
      setTimeout(() => {
         setContent(undefined)
      }, 10000);
   };

   //start
   recognition.onstart = function() {
      setIsVoice(true)
   };

   //stop
   recognition.onspeechend = function() {
         setIsVoice(false)
         recognition.stop();
   };

  //error
  recognition.onerror = function(event) {
      setIsVoice(false)
      setError(true)
      setErrorMess(event.error)
      setTimeout(() => {
         setError(false)
      }, 4000);
  }

  return {
      recognition,
      content,
      isVoice,
      error,
      errorMess,
  }
}

export default useRecognition