import React, { useLayoutEffect } from "react";
import Image from './images';
import Chart from '../homepage/canvas';
import VulTable from '../Formelement/vultable';
import Expotable from '../Formelement/expotable';
import DateLoc from './dateloc'
import { useEIFormContext } from "../../context/Eicontext";
import { useVIFormContext } from "../../context/VIformcontext";
import { useLocationContext } from "../../context/locationcontext";

export default function HomePageMobile()
{
const{EIfinal}=useEIFormContext;
const {VIfinal}=useVIFormContext;
const{HIfinal} =useLocationContext;
    return(
        <div className="dashboard tab">
                        <header>
                            <h2>UTCI HSRIF </h2>
                            <p className='para1'>UTCI based Heat Stress Risk Index_Forecast</p>
                        </header>

                        <main>
                            <div className="img-container">
                                <div id='imgbox'>
                                    <Image />
                                </div>

                                <div className="index-values">
                                    <div className='indexvalues-indivisual'>
                                        <div className="index-card">H.I <span className="highlight">{HIfinal||0}</span></div>
                            <div className="index-card">V.I <span className="highlight">{VIfinal||0}</span></div>
                            <div className="index-card">E.I <span className="highlight1">{EIfinal||0}</span></div>
                                    </div>

                                    <div className='indexvalue-final'>
                                        <div className="index-card-result"> <p>Risk index</p><span className="highlight">0.34</span> </div>
                                    </div>
                                </div>

                                <div className="chart-container">
                                    <Chart />
                                </div>
                            </div>
                            <div id='info-container'>

                                <DateLoc />


                                <div className="index-container">


                                    <VulTable />

                                    <Expotable />


                                </div>



                            </div>
                        </main>

                        <footer>

                        </footer>
                    </div>
    );


}