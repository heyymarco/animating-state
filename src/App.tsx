import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from './Button';
import { useEvent } from "@reusable-ui/hooks";



function App() {
    const [controllable, setControllable] = useState<boolean>(false);
    const [arrived, setArrived] = useState<boolean>(false);
    const onControllableChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        setControllable(event.target.checked);
    });
    const onCheckChange = useEvent<React.ChangeEventHandler<HTMLInputElement>>((event) => {
        setArrived(event.target.checked);
    });
    return (
        <div className="App">
            <header className="App-header">
                <Button arrived={controllable ? arrived : undefined} />
                <input type='checkbox' onChange={onControllableChange} />
                <input type='checkbox' onChange={onCheckChange} />
            </header>
        </div>
    );
}

export default App;
