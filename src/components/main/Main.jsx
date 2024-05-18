import 'regenerator-runtime';
import React, { useContext, useState ,useEffect} from 'react'
import {assets} from '../../assets/assets.js'
import './main.css'
import SpeechRecognition,{useSpeechRecognition} from 'react-speech-recognition'
import { Context } from '../Context/Context.jsx'
function Main() {
  const {transcript,resetTranscript,browserSupportsSpeechRecognition}=useSpeechRecognition();
  const [micOff,setMicOff]=useState(false)
  if(!browserSupportsSpeechRecognition){
    alert("Browser doesn't support speech recognition")
  }
  const {resultFinder,lastPrompt,showResult,loading,result,setInput,input}=useContext(Context)
  useEffect(()=>{
    if(micOff){
      setInput(transcript)
    }
  },[transcript,micOff,setInput])
  const speechToText=()=>{
    setMicOff(prev=>prev=!prev)
    if(!micOff){
      setInput("")
      resetTranscript()
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })
      setInput(transcript)
    }
    else{
      SpeechRecognition.stopListening()
    }
  }
  function handleKeyUp(e){
    if(e.key==='Enter')resultFinder();
  }
  const handleImageClick=()=>{
    alert("This functionality is not working still.. Sorry For the Inconvience")
  }
  return (
    <div className='main'>
      <div className="nav">
        <p>GemAI</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main-container">
        {!showResult?
        <>
          <div className="greet">
            <p><span>Hello, User.</span></p>
            <p>How can I help you today?</p>
        </div>
        <div className="cards">
            <div className="card">
                <p>Suggest beautiful places to see on a upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
            </div>
            <div className="card">
                <p>Look up a Linux shell command for a specific task</p>
                <img src={assets.code_icon} alt="" />
            </div>
            <div className="card">
                <p>Brainstorm presentation ideas about a topic</p>
                <img src={assets.message_icon} alt="" />
            </div>
            <div className="card">
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
            </div>
        </div>
        </>:
        <div className="result">
          <div className="result-title">
            <img src={assets.user_icon} alt="" />
            <p>{lastPrompt}</p>
          </div>
          <div className="result-value">
            <img src={assets.gemini_icon} alt="" />
            {loading?
              <div className="loader">
                <hr />
                <hr />
                <hr />
              </div>
              :
              <p dangerouslySetInnerHTML={{__html:result}}></p>
            }
          </div>
        </div>
        }
        <div className="main-bottom">
            <div className="search-box">
                <input onChange={(e)=>setInput(e.target.value)} onKeyUp={handleKeyUp} value={input} type="text" placeholder='Enter a prompt here' />
                <div>
                    <img src={assets.gallery_icon} alt="" onClick={handleImageClick} />
                    <img src={assets.mic_icon} alt="" onClick={speechToText} className={micOff?'micOff':''}/>
                    {input!==""?<img src={assets.send_icon} alt="" onClick={()=>resultFinder()}/>:null}
                </div>
            </div>
            <p className="bottom-info">
                GemAI may display inaccurate info, since it's a clone of Gemini which may also produce inaccurate info.
            </p>
        </div>
      </div>
    </div>
  )
}

export default Main
