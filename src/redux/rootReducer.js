import {
    SET_COUNTRIES,
    SET_SEARCH_RESULTS,
    SET_VALUE,
    SET_SPECIFIC_COUNTRY,
    SET_COUNTRY_HOLIDAYS,
    SET_PUBLIC_HOLIDAYS
} from './types'

const INITIAL_STATE = {
    countries: [],
    searchResults: [],
    specificCountry: {
        flag: "",
        name: "",
        alpha2Code: "",
        alpha3Code: ""
    },
    countryHolidays: [],
    publicHolidays: true,
    value: ""
}

export const rootReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_COUNTRIES:
            return { ...state, countries: action.payload, searchResults: action.payload }
        case SET_SEARCH_RESULTS:
            return { ...state, searchResults: action.payload }
        case SET_VALUE:
            return { ...state, value: action.payload }
        case SET_SPECIFIC_COUNTRY:
            return { ...state, specificCountry: action.payload }
        case SET_COUNTRY_HOLIDAYS:
            return { ...state, countryHolidays: action.payload }
        case SET_PUBLIC_HOLIDAYS:
            return { ...state, publicHolidays: action.payload }
        default:
            return state
    }
}