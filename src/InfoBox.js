import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core'
import './Infobox.css';

function InfoBox(props) {
    const c = props.active ? "infobox selected" : "infobox";
    return (
        <Card onClick={props.onClick} className={c} >
            <CardContent>
                <Typography className="infoBox_title" color="textSecondary">{props.title}</Typography>
                <h3 className="infoBox_cases" >{(props.cases > 1000) ? (props.cases / 1000).toFixed(1) + "k" : props.cases}</h3>
                <Typography className="infoBox_cases" color="textSecondary">{props.total} Total</Typography>
            </CardContent>
        </Card >
    )
}

export default InfoBox
