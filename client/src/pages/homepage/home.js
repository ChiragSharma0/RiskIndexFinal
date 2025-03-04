import React, { useEffect, useState } from 'react';

import HomePageTab from '../../components/homepage/homepagetab';
import HomeSmallMobile from '../../components/homepage/homepagemobile';
import HomePageDesk from '../../components/homepage/homepagedesk';
import './home.css'
import LocationModal from '../../components/Formelement/MapComponent';
import { useLocationContext } from '../../context/locationcontext';
import Profile from '../profile/profile';
import { usePageContext } from '../../context/pagecontext';



function Home() {
    const [screenType, setScreenType] = useState(getScreenType());
    const {ismodalopen} = useLocationContext();
const { showPage,setShowPage }=usePageContext();    

    function getScreenType() {
        const width = window.innerWidth;
        if (width > 1000) return 'desktop';
        if (width > 750) return 'tablet';
        return 'mobile';
    }

    useEffect(() => {
        const handleResize = () => {
            setScreenType(getScreenType());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    },[]);

useEffect(()=>{
    console.log("home page render");
},[]);

    return (
        <>
        {/* ✅ Conditionally render based on `showPage` state */}
        {showPage === "home" ? (
          <>
            {screenType === "desktop" ? (
              <HomePageDesk />
            ) : screenType === "tablet" ? (
              <HomePageTab />
            ) : (
              <HomeSmallMobile />
            )}
  
            {ismodalopen && <LocationModal />}
          </>
        ) : showPage === "profile" ? (
          <Profile />
        ) : null}
        </>
    );
}

export default Home;
