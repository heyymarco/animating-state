import React, { useState } from "react";
import { useEvent } from "@reusable-ui/hooks";
import { useAnimatingState } from "./animating-state";
import './Button.css'


const useInteractable = () => {
    const [hoverDn, setHoverDn] = useState<boolean>(false);
    const [arrived, animation, handleAnimationEnd] = useAnimatingState({
        initialState  : hoverDn,
        currentState  : hoverDn,
        animationName : /((?<![a-z])(arrive|leave)|(?<=[a-z])(Arrive|Leave))(?![a-z])/,
    });
    
    
    
    // handlers:
    const handleMouseEnter   = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        setHoverDn(true);
    });
    
    const handleMouseLeave   = useEvent<React.MouseEventHandler<HTMLButtonElement>>(() => {
        setHoverDn(false);
    });
    
    
    
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
        handleAnimationEnd,
    };
}



export const Button = () => {
    const interactableState = useInteractable();
    
    
    
    return (
        <button
            className={interactableState.class ?? ''}
            onMouseEnter={interactableState.handleMouseEnter}
            onMouseLeave={interactableState.handleMouseLeave}
            onAnimationEnd={interactableState.handleAnimationEnd}
        >
            test
        </button>
    )
}