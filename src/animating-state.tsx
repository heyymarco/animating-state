// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

import { useEvent } from '@reusable-ui/hooks'



export interface AnimatingStateOptions<TState> {
    initialState       : TState | (() => TState)
    currentState       : TState
    
    animationBubbling ?: boolean
    animationName      : string|RegExp
};
export const useAnimatingState = <TState, TElement extends Element = HTMLElement>(options: AnimatingStateOptions<TState>) => {
    // options:
    const {
        initialState,
        currentState,
        
        animationBubbling = false,
        animationName,
    } = options;
    
    
    
    // states:
    const [state    , setState    ] = useState<TState>(initialState);
    const [animation, setAnimation] = useState<TState|undefined>(undefined);
    
    
    
    // updates:
    const newState = currentState;     // get the new state
    
    if (state !== newState) {          // a change detected => apply the change & start animation
        setState(newState);            // remember the new state
        
        if (animation === undefined) { // if not **being** animated
            setAnimation(newState);    // start animation of **new** state
        } // if
    } // if
    
    
    
    // handlers:
    const handleAnimationEnd = useEvent<React.AnimationEventHandler<TElement>>((event) => {
        // conditions:
        if (animation === undefined)                                      return; // no running animation => nothing to stop
        if (!animationBubbling && (event.target !== event.currentTarget)) return; // if not bubbling => ignores bubbling
        if (!event.animationName.match(animationName))                    return; // ignores foreign animations
        
        
        
        // clean up finished animation:
        if (animation === state) {   // the current state **was animated**
            setAnimation(undefined); // => stop animation of **current** state
        }
        else {                       // the current state **was changed** during the animation
            setAnimation(state);     // => start animation of **another** state
        } // if
    });
    
    
    
    // interfaces:
    return [
        state,
        animation,
        handleAnimationEnd,
    ] as const;
};