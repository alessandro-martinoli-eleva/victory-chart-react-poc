import React from 'react';
import './App.scss';
import EChart from "./EChart/index.js";
import D3 from "./D3/index.js";
import Victory from "./Victory/index.js";

export default () => {

    return (
        <div className="app-container">
            {/*<EChart />*/}
            {/*<D3 />*/}
            <Victory />
        </div>
    );
};
