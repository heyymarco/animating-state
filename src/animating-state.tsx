// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useReducer,
}                           from 'react'

import { useEvent } from '@reusable-ui/hooks'



interface AnimatingState<TState extends ({}|null)> {
    state     : TState
    animation : TState|undefined
}
interface AnimatingStateChangeAction<TState extends ({}|null)> {
    type      : 'change',
    newState  : TState
}
interface AnimatingStateDoneAction<TState extends ({}|null)> {
    type      : 'done',
}
type AnimatingStateAction<TState extends ({}|null)> =
    |AnimatingStateChangeAction<TState>
    |AnimatingStateDoneAction<TState>

const animatingStateReducer = <TState extends ({}|null)>(oldState: AnimatingState<TState>, action: AnimatingStateAction<TState>): AnimatingState<TState> => {
    switch (action.type) {
        case 'change':
            if (!Object.is(oldState.state, action.newState)) {
                return {
                    state     : action.newState,           // remember the new state
                    animation : (
                        (oldState.animation === undefined) // if not **being** animated
                        ?
                        action.newState                    // start animation of **new** state
                        :
                        oldState.animation                 // continue unfinished animation of **old** state
                    ),
                };
            } // if
            break;
        
        case 'done':
            if (oldState.animation !== undefined) { // **has** a running animation
                return {
                    state     : oldState.state,
                    animation : (
                        Object.is(oldState.animation, oldState.state)
                        
                        ?              // the current state **was animated**
                        undefined      // => stop animation of **current** state
                        
                        :              // the current state **was changed** during the animation
                        oldState.state // => start animation of **another** state
                    ),
                };
            } // if
            break;
    } // switch
    
    
    
    // no change:
    return oldState;
};



export interface AnimatingStateOptions<TState extends ({}|null)> {
    initialState       : TState | (() => TState) // required
    
    animationBubbling ?: boolean                 // optional
    animationName      : string|RegExp           // required
};
export const useAnimatingState = <TState extends ({}|null), TElement extends Element = HTMLElement>(options: AnimatingStateOptions<TState>) => {
    // options:
    const {
        initialState,
        
        animationBubbling = false,
        animationName,
    } = options;
    
    
    
    // states:
    const [state, dispatchState] = useReducer(animatingStateReducer, {
        // initials:
        state     : initialState,
        animation : undefined,
    });
    
    
    
    // handlers:
    const setState           = useEvent<React.Dispatch<React.SetStateAction<TState>>>((newState) => {
        // update with a new state:
        dispatchState({ type: 'change', newState });
    });
    const handleAnimationEnd = useEvent<React.AnimationEventHandler<TElement>>((event) => {
        // conditions:
        if (!animationBubbling && (event.target !== event.currentTarget)) return; // if not bubbling => ignores bubbling
        if (!event.animationName.match(animationName))                    return; // ignores foreign animations
        
        
        
        // clean up finished animation:
        dispatchState({ type: 'done' });
    });
    
    
    
    // interfaces:
    return [
        state.state,
        setState,
        
        state.animation,
        handleAnimationEnd,
    ] as const;
};