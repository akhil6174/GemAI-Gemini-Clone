import React, { useContext, useEffect, useState } from 'react'
import './sidebar.css'
import {assets} from '../../assets/assets.js'
import { Context } from '../Context/Context.jsx'
import conf from '../../config/conf.js'
function Sidebar() {
  const [extend,setExtend]=useState(false)
  const [city,setCity]=useState('Delhi')
  const [country,setCountry]=useState('India')
  const geoLocationApi=conf.geolocationApiKey
  const handleMenuClick = async () => {
    setExtend(!extend);
  
    // Geolocation
    try {
      const position = await navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates = await position.coords;
  
          const requestOptions = {
            method: 'GET',
          };
          fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}&apiKey=${geoLocationApi}`,
            requestOptions
          )
            .then((response) => response.json())
            .then((result) => {
              setCity(result.features[0].properties.city);
              setCountry(result.features[0].properties.country);
              // You can potentially use these retrieved values in your component
            })
            .catch((error) => console.log('error', error));
        }
      );
    } catch (error) {
      console.error("Error getting geolocation:", error);
    }
  };
  
  const {resultFinder,setLastPrompt,previousPrompts,newChat}=useContext(Context)

  const loadPrompt=async (prompt)=>{
    setLastPrompt(prompt)
    await resultFinder(prompt);
  }
  return (
  <div className='sidebar'>
      <div className="top">
          <img className="menu" src={assets.menu_icon} alt="" onClick={handleMenuClick} />
          <div className="new-chat" onClick={()=>newChat()}>
            <img src={assets.plus_icon} alt="" />
            {extend?<p>New Chat</p>:null}
          </div>
          {extend?
          <div className="recent">
          <p className="recent-title">Recent</p>
          <ul className="recent-list list-decor">
            {previousPrompts.map((item,index)=>{
              return (
                item?
                <li className="one-recent" key={index} onClick={()=>loadPrompt(item)}>
                  <img src={assets.message_icon} alt="" />
                  <p>{item.slice(0,18)}..</p>
                </li>:null
              )
            })}
          </ul>
        </div>:null}
      </div>
      <div className="bottom">
            <ul className="recent-list">
              <li className="one-recent">
                <img src={assets.question_icon} alt="" />
                {extend?<p>Help</p>:null}
              </li>
              <li className="one-recent">
                <img src={assets.history_icon} alt="" />
                {extend?<p>Activity</p>:null}
              </li>
              <li className="one-recent">
                <img src={assets.setting_icon} alt="" />
                {extend?<p>Settings</p>:null}
              </li>
            </ul>
            {extend?<p className='location'><span className="dot"></span><span>{city},{country}</span></p>:null}
      </div>
    </div>
  )
}

export default Sidebar
