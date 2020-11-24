import React, { Component } from "react";
import axios from 'axios';
import './Home.css';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import {
    SET_COUNTRIES,
    SET_SEARCH_RESULTS,
    SET_VALUE,
    SET_SPECIFIC_COUNTRY
} from '../../redux/types'

class Home extends Component {
    constructor(props) {
        super(props)
        if (this.props.searchResults.length === 0 && this.props.value.length === 0) {
            axios.get('https://restcountries.eu/rest/v2/all')
                .then((response) => {
                    this.props.setCountries(
                        response.data.map(country => ({
                            flag: country.flag,
                            name: country.name,
                            alpha2Code: country.alpha2Code,
                            alpha3Code: country.alpha3Code
                        })))
                });
        }
    }

    changeHandler = event => {
        this.props.setValue(event.target.value)
        const searchName = event.target.value.toLowerCase()

        const results = this.props.countries.filter(country =>
            country.name.toLowerCase().includes(searchName)
        )

        this.props.setSearchResults(results)
    }

    routeChange(countryName) {
        const countryIndex = this.props.searchResults.findIndex(country => country.name === countryName)
        const foundCountry = this.props.searchResults[countryIndex];

        this.props.setSpecificCountry(foundCountry)

        const path = '/holidays';
        this.props.history.push(path);
    }

    render() {
        return (
            <div className="App">
                <input
                    type="text"
                    placeholder="Search"
                    value={this.props.value}
                    onChange={this.changeHandler}
                />
                <ul>
                    {!this.props.searchResults ? null : this.props.searchResults.map(country => (
                        <li key={country.alpha3Code}><img alt="flag_img" src={country.flag} /> <span onClick={() => this.routeChange(country.name)}>{country.name}</span> <b>{country.alpha3Code}</b></li>
                    ))}
                </ul>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCountries: (payload) => dispatch({ type: SET_COUNTRIES, payload }),
        setSearchResults: (payload) => dispatch({ type: SET_SEARCH_RESULTS, payload }),
        setValue: (payload) => dispatch({ type: SET_VALUE, payload }),
        setSpecificCountry: (payload) => dispatch({ type: SET_SPECIFIC_COUNTRY, payload })
    }
}

const mapStateToProps = state => ({
    countries: state.countries,
    searchResults: state.searchResults,
    value: state.value,
    specificCountry: state.specificCountry
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home))