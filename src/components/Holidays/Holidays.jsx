import { Component } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { connect } from 'react-redux'
import axios from 'axios';
import Checkbox from 'react-checkbox-component'
import './Holidays.css';
import {
    SET_COUNTRY_HOLIDAYS,
    SET_PUBLIC_HOLIDAYS
} from '../../redux/types'

class Holidays extends Component {
    constructor(props) {
        super(props);

        axios.get('https://holidayapi.com/v1/holidays?pretty&key=f53ba17b-5a26-4021-ab5f-2880936cf3cd&country='
            + this.props.specificCountry.alpha2Code + '&year=2019')
            .then((response) => {
                this.props.setCountryHolidays(
                    response.data.holidays.map(holiday => ({
                        title: holiday.name,
                        start: holiday.date,
                        end: holiday.observed,
                        public: holiday.public
                    })))
            });
    }

    publicHolidaysHandler() {
        let publicPath;

        if (this.props.publicHolidays) {
            publicPath = ""
        } else {
            publicPath = "&public=true"
        }

        axios.get('https://holidayapi.com/v1/holidays?pretty&key=f53ba17b-5a26-4021-ab5f-2880936cf3cd&country='
            + this.props.specificCountry.alpha2Code + '&year=2019' + publicPath)
            .then((response) => {
                this.props.setCountryHolidays(
                    response.data.holidays.map(holiday => ({
                        title: holiday.name,
                        start: holiday.date,
                        end: holiday.observed,
                        public: holiday.public
                    })))
            });

        this.props.setPublicHolidays(!this.props.publicHolidays)
    }

    render() {
        return (
            <div>
                {this.props.specificCountry.name.length !== 0 ?
                    <div>
                        <p key={this.props.specificCountry.alpha3Code}>
                            <img alt="flag_img" src={this.props.specificCountry.flag} />
                            <span> {this.props.specificCountry.name} </span>
                            <b>{this.props.specificCountry.alpha3Code}</b>
                        </p>
                        <span className="show-holidays" >Show only public holidays</span>
                        <Checkbox size="small" isChecked={this.props.publicHolidays} onChange={this.publicHolidaysHandler.bind(this)}
                            color="rgb(0,0,0)" />
                        <hr />
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            events={this.props.countryHolidays}
                            initialDate='2019-11-19'
                        />
                    </div>
                    : null}
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCountryHolidays: (payload) => dispatch({ type: SET_COUNTRY_HOLIDAYS, payload }),
        setPublicHolidays: (payload) => dispatch({ type: SET_PUBLIC_HOLIDAYS, payload }),
    }
}

const mapStateToProps = state => ({
    specificCountry: state.specificCountry,
    countryHolidays: state.countryHolidays,
    publicHolidays: state.publicHolidays
})

export default connect(mapStateToProps, mapDispatchToProps)(Holidays)