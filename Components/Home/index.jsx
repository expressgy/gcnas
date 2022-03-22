import React, {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom'
import gcss from './index.module.scss';

export default function Home() {
    const navigate = useNavigate()
    return (<div>Hello World!</div>);
}