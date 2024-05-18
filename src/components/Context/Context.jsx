import { createContext, useState } from "react";
import run from "../../config/gemini";
import { marked } from "marked";
const acorn = await import('acorn');

export const Context=createContext();

const ContextProvider=(props)=>{

    const [input,setInput]=useState("")
    const [lastPrompt,setLastPrompt]=useState("")
    const [previousPrompts,setPreviousPrompts]=useState([])
    const [showResult,setShowResult]=useState(false)
    const [loading,setLoading]=useState(false)
    const [result,setResult]=useState("")

    const delayParagraph=(index,nextWord)=>{
        setTimeout(function (){
            setResult(prev=>prev+nextWord)
        },5*index)
    }
    const newChat=()=>{
        setLoading(false)
        setShowResult(false);
    }
    const resultFinder=async(prompt)=>{
    setResult("")
    setLoading(true)
    setShowResult(true)
    let resp;
    if(prompt!==undefined){
        resp=await run(prompt);
        setLastPrompt(prompt)
    }
    else{
        setPreviousPrompts(prev=>[input,...prev])
        setLastPrompt(input)
        resp=await run(input)
    }
    let newResp=marked(resp)
    let newRespArr=newResp.split(" ")
    for(let i=0;i<newRespArr.length;i++){
        const nextWord=newRespArr[i];
        delayParagraph(i,nextWord+" ");
    }
    setLoading(false)
    setInput("")
}
    const contextValue={
        previousPrompts,
        setPreviousPrompts,
        lastPrompt,
        setLastPrompt,
        resultFinder,
        input,
        setInput,
        showResult,
        loading,
        result,
        newChat
    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider