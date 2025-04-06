import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Header from '../common/Header';
import Footer from '../common/Footer'
import Image from './images';
import Chart from './canvas';
import VulTable from '../Formelement/vultable';
import Expotable from '../Formelement/expotable';
import DateLoc from './dateloc'
import VIfinalVal from "../Formelement/VIfinal";
import EIfinalVal from "../Formelement/EIfinal";
import HIfinalVal from "../Formelement/HIfinal";
import RIfinalval from '../Formelement/Rifinal';

export default function HomePageDesk() {

    const { t } = useTranslation();


    useEffect(() => {
        console.log("USEEFFECT TRIGGERED FROM HOMEPAGEDESK");
    }, []);

    return (
        <div className="dashboard">

            <Header />
            <main>
                <div className="img-container">
                    <div id='imgbox'>
                        <Image />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" ,height:"20px"  }}>
                        <span>{t("h_index")} - {t("heat_index")}</span><span>{t("v_index")} - {t("vulnerability_index")}</span><span>{t("r_index")} -  {t("risk_index")}</span>
                    </div>

                </div>
                <div id='info-container'>
                    <DateLoc />
                    <div className="index-container">
                        <VulTable />
                        <Expotable />
                    </div>

                    {/* Only render once values are available */}
                    <div className="index-values">
                        <div className='indexvalues-indivisual'>
                            <div className="index-card">{t("h_index")} <HIfinalVal /></div>
                            <div className="index-card">{t("v_index")} <VIfinalVal /></div>
                            <div className="index-card">{t("e_index")} <EIfinalVal /></div>
                        </div>
                        <div className='indexvalue-final'>
                            <div className="index-card-result"> <p>{t("risk_index")}</p><RIfinalval /> </div>
                        </div>
                    </div>


                    <div className="chart-container">
                        <Chart />
                    </div>
                </div>
            </main>
            <Footer />

        </div>
    );


}