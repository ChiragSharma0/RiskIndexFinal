import React, { useLayoutEffect } from "react";
import Image from './images';
import Chart from '../homepage/canvas';
import VulTable from '../Formelement/vultable';
import Expotable from '../Formelement/expotable';
import DateLoc from './dateloc'
import VIfinalVal from "../Formelement/VIfinal";
import EIfinalVal from "../Formelement/EIfinal";
import HIfinalVal from "../Formelement/HIfinal";
import RIfinalVal from "../Formelement/Rifinal";
import Header from "../common/Header";
import { useTranslation } from "react-i18next";
import Footer from "../common/Footer";

export default function HomePageMobile() {
        const { t } = useTranslation();
    
    
    return (
        <div className="dashboard tab">
            <Header />

            <main>
                <div className="mainbox" style={{ display: "flex" }}>
                    <div className="img-container">
                        <div id='imgbox'>
                            <Image />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> <span>{t("h_index")} - {t("heat_index")}</span><span>{t("v_index")} - {t("vulnerability_index")}</span><span>{t("r_index")} -  {t("risk_index")}</span></div>


                        <div className="index-values">
                            <div className='indexvalues-indivisual'>
                                <div className="index-card">{t("h_index")} <HIfinalVal /></div>
                                <div className="index-card">{t("v_index")} <VIfinalVal /></div>
                                <div className="index-card">{t("e_index")} <EIfinalVal /></div>
                            </div>

                            <div className='indexvalue-final'> 
                            <div className="index-card-result"> <p>{t("risk_index")}</p><RIfinalVal/> </div>
                            </div>
                        </div>


                    </div>
                    <div id='info-container'>

                        <DateLoc />


                        <div className="index-container">


                            <VulTable />

                            <Expotable />


                        </div>



                    </div>
                </div>
                <div className="chart-container">
                    <Chart />
                </div>
            </main>

            <Footer />

        </div>
    );


}