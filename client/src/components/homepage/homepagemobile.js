import React from "react";
import Image from './images';
import Chart from '../homepage/canvas';
import VulTable from '../Formelement/vultable';
import Expotable from '../Formelement/expotable';
import DateLoc from './dateloc'
import EIfinalVal from "../Formelement/EIfinal";
import VIfinalVal from "../Formelement/VIfinal";
import HIfinalVal from "../Formelement/HIfinal";
import RIfinalVal from "../Formelement/Rifinal";
import Footer from "../common/Footer";
import Header from "../common/Header";

export default function HomePageMobile() {
   

    return (
        <div className="dashboard">
                        <Header />


            <main>
                <DateLoc />
                <div id='info-container'>

                    <div className="img-container">
                        <div id='imgbox'>
                            <Image />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span> H.I. - Heat Index;</span><span> V.I. Vulnerability Index;</span><span> R.I. Risk Index</span>
                        </div>
                    </div>
                    <div className="index-values">
                        <div className='indexvalues-indivisual'>
                            <div className="index-card">H.I <HIfinalVal /></div>
                            <div className="index-card">V.I  <VIfinalVal /></div>
                            <div className="index-card">E.I<EIfinalVal /></div>
                        </div>
                        <div className='indexvalue-final'>
                            <div className="index-card-result"> <p>Risk index</p><RIfinalVal /> </div>
                        </div>
                        <div className="chart-container">
                            <Chart />
                        </div>
                    </div>





                </div>
                <div className="index-container">
                    <VulTable />
                    <Expotable />
                </div>

            </main>
            <Footer />
        </div>
    );


}