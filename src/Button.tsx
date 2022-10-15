import React from "react";
import { useEvent } from "@reusable-ui/hooks";
import { useAnimatingState } from "./animating-state";
import './Button.css'



const useInteractable = () => {
    const [arrived, setArrived, animation, handleAnimationStart, handleAnimationEnd] = useAnimatingState({
        initialState  : false,
        animationName : /((?<![a-z])(arrive|leave)|(?<=[a-z])(Arrive|Leave))(?![a-z])/,
    });
    
    
    
    // handlers:
    const handleMouseEnter   = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        setArrived(true);
    });
    
    const handleMouseLeave   = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        setArrived(false);
    });
    
    
    
    // console.log({hoverDn, arrived, animation})
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



export const Button = () => {
    const interactableState = useInteractable();
    
    
    console.log({
        arrived : interactableState.arrived,
        class   : interactableState.class,
    });
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