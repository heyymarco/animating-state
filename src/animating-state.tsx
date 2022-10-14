// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
}                           from 'react'

import { useEvent } from '@reusable-ui/hooks'



export interface AnimatingStateConfig<TState extends any> {
    initialState   : TState | (() => TState)
    updateState   ?: (state: TState) => TState
    
    bubbling      ?: boolean
    animationName  : RegExp
};
export const AnimatingState = <TState extends any>(config: AnimatingStateConfig<TState>) => {
    // configs:
    const {
        initialState,
        updateState,
        
        bubbling = false,
        animationName,
    } = config;
    
    
    
    // states:
    const [state    , setState    ] = useState<TState>(initialState);
    const [animation, setAnimation] = useState<TState|undefined>(undefined);
    
    
    
    // updates:
    const newState = updateState ? updateState(state) : state; // calculate the new state
    
    if (state !== newState) {          // a change detected => apply the change & start animating
        setState(newState);            // remember the new state
        
        if (animation === undefined) { // if not **being** animated
            setAnimation(newState);    // start animating of **new** state
        } // if
    } // if
    
    
    
    // handlers:
    const handleAnimationEnd = useEvent<React.AnimationEventHandler<Element>>((event) => {
        // conditions:
        if (animation === undefined)                             return; // no running animation => nothing to stop
        if (!bubbling && (event.target !== event.currentTarget)) return; // if not bubbling => ignores bubbling
        if (!animationName.test(event.animationName))            return; // ignores foreign animations
        
        
        
        // clean up finished animation:
        if (animation === state) {   // the current state **was animated**
            setAnimation(undefined); // => stop animating of **current** state
        }
        else {                       // the current state **was changed** during the animation
            setAnimation(state);     // => start animating of **another** state
        } // if
    });
    
    
    
    // interfaces:
    return {
        state,
        setState,
        
        animation,
        handleAnimationEnd,
    };
};