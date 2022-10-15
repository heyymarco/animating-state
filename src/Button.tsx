import React, {useEffect, useRef} from "react";
import { useEvent } from "@reusable-ui/hooks";
import { useAnimatingState } from "./animating-state";
import './Button.css'



export interface InteractableProps {
    arrived ?: boolean
}
const useInteractable = (props: InteractableProps) => {
    const arrivedDn = useRef<boolean>(false);
    const arrivedFn = props.arrived ?? arrivedDn.current;
    
    
    
    const [arrived, setArrived, animation, handleAnimationStart, handleAnimationEnd] = useAnimatingState({
        initialState  : arrivedFn,
        animationName : /((?<![a-z])(arrive|leave)|(?<=[a-z])(Arrive|Leave))(?![a-z])/,
    });
    // useEffect(() => {
    //     if (arrived !== arrivedFn) setArrived(arrivedFn);
    // }, [arrived, arrivedFn]);
    if (arrived !== arrivedFn) setArrived(arrivedFn);
    
    
    
    // handlers:
    const handleMouseEnter   = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        arrivedDn.current = true;
        
        if (props.arrived === undefined) setArrived(true);
    });
    
    const handleMouseLeave   = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        arrivedDn.current = false;
        
        if (props.arrived === undefined) setArrived(false);
    });
    
    
    
    console.log({arrived, animation})
    return {
        arrived,
        
        class  : ((): string|null => {
            // arriving:
            if (animation === true) return 'arriving';
            
            // leaving:
            if (animation === false) return 'leaving';
            
            // fully arrived:
            if (arrived) return 'arrived';
            
            // fully left:
            return 'leaved';
        })(),
        
        handleMouseEnter,
        handleMouseLeave,
        handleAnimationStart,
        handleAnimationEnd,
    };
}



export interface ButtonProps {
    arrived ?: boolean
}
export const Button = (props: ButtonProps) => {
    const interactableState = useInteractable(props);
    
    
    // console.log({
    //     arrived : interactableState.arrived,
    //     class   : interactableState.class,
    // });
    return (
        <button
            className={interactableState.class ?? ''}
            onMouseEnter={interactableState.handleMouseEnter}
            onMouseLeave={interactableState.handleMouseLeave}
            onAnimationStart={interactableState.handleAnimationStart}
            onAnimationEnd={interactableState.handleAnimationEnd}
        >
            test
        </button>
    )
}