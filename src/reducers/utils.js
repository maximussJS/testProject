import Immutable from 'immutable';

/**
 * an elegance way to write reducer
 * @param funcMap the functions map
 * @param initialState initiate state
 * @returns {Function}
 */
export function createReducer(funcMap, initialState = {}) {
    if (typeof funcMap !== 'object') {
        throw new Error('funcMap need to be a object');
    }

    return (state = initialState, action) =>  funcMap.hasOwnProperty(action.type) ?
        funcMap[action.type](state, action) :
        funcMap.hasOwnProperty('*') ? funcMap['*'](state, action) :
            state;
}

/**
 * Get error type from default type
 *
 * @param {string} type
 * @returns {string}
 */
export function errorType(type) {
    return type + "_ERROR";
}

/**
 * Merge state with response.
 * store.errors = response.errors
 * store.warnings = response.warnings
 * store.messages = response.messages
 *
 * @param {Map|List} state
 * @param {object} response
 * @param {boolean} errorsByField
 * @param {array} [response.errors]
 * @param {array} [response.warnings]
 * @param {array} [response.messages]
 */
export function mergeStateWithMessages(state, response, errorsByField = true) {
    const {errors, warnings, messages} = response;
    let additionMessages = {};

    if (errors && errors.length > 0) {
        additionMessages.errors = errors;
        if(errorsByField){
            additionMessages.errorsByField = {};
            errors.forEach( item => {
                if(item.field){
                    additionMessages.errorsByField[item.field] = item;
                }
            } )
        }
    }
    if (warnings && warnings.length > 0) {
        additionMessages.warnings = warnings;
    }
    if (messages && messages.length > 0) {
        additionMessages.messages = messages;
    }

    return state.merge(Immutable.fromJS(additionMessages));
}

/**
 * Create new state
 *
 * @param {object} response
 * @param {string} [immutableType=Map]
 * @param {boolean} [autoMerge=true]
 * @param {boolean} [errorsByField=true]
 */
export function newStateWithResponse(response, immutableType = 'Map', autoMerge = true, errorsByField = true) {
    let state = Immutable.fromJS(response.data) || Immutable[immutableType]();
    if (immutableType === 'List') {
        return state;
    }

    if (autoMerge == false) {
        return state;
    }

    return mergeStateWithMessages(state, response, errorsByField);
}