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
import { useTranslation } from "react-i18next";

export default function HomePageMobile() {

    const { t } = useTranslation();

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
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}> <span>{t("h_index")} - {t("heat_index")}</span><span>{t("v_index")} - {t("vulnerability_index")}</span><span>{t("r_index")} -  {t("risk_index")}</span></div>

                    </div>
                    <div className="index-values">
                        <div className='indexvalues-indivisual'>
                            <div className="index-card">{t("h_index")} <HIfinalVal /></div>
                            <div className="index-card">{t("v_index")} <VIfinalVal /></div>
                            <div className="index-card">{t("e_index")} <EIfinalVal /></div>
                        </div>
                        <div className='indexvalue-final'>
                            <div className="index-card-result"> <p>{t("risk_index")}</p><RIfinalVal /> </div>
                        </div>

                    </div>
                   




                </div>
                <div className="chart-container">
                        <Chart />
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