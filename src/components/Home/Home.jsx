import React, { Component } from "react";
import './Home.css';
import { Container, Row, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ExcelRenderer } from 'react-excel-renderer';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputData: {
                xlsx: {
                    rows: [],
                    cols: []
                },
                json: [],
                time: null,
                isLoaded: false
            },
            fileData: {
                name: null,
                size: null
            }
        }

        this.xlsx = React.createRef();
        this.time = React.createRef();
        this.json = React.createRef();


    }

    fileHandler = () => {
        if (this.xlsx.current.files[0] === undefined || this.json.current.value.length === 0 || this.time.current.value.length === 0) {
            alert('You have to fill all fields!');
            return;
        }

        var fileObj = this.xlsx.current.files[0];
        var json = JSON.parse(this.json.current.value);
        var time = this.time.current.value;

        this.setState({
            fileData: {
                name: fileObj.name,
                size: fileObj.size
            }
        });

        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                this.setState({
                    inputData: {
                        xlsx: {
                            rows: resp.rows,
                            cols: resp.cols,
                        },
                        json: json.brands,
                        time: time,
                        isLoaded: true
                    }
                });
                setInterval(this.handleTimer, 1000)
            }
        });
    }

    handleTimer = () => {
        console.log(this.state.inputData.json)
        if (this.state.inputData.isLoaded) {
            const time = this.state.inputData.time.split(':');
            let min = parseInt(time[0])
            let sec = parseInt(time[1])

            if (sec !== 0) {
                sec--;
            } else if (min !== 0) {
                min--;
                sec = 59;
            } else {

            }

            if (min.toString().length === 1) {
                min = "0" + min;
            }

            if (sec.toString().length === 1) {
                sec = "0" + sec;
            }

            this.setState(prevState => ({
                inputData: {
                    ...prevState.inputData,
                    time: min + ':' + sec
                }
            }))
        }
    }

    render() {
        return (
            <div>
                <Container style={!this.state.inputData.isLoaded ? { display: 'block' } : { display: 'none' }} >
                    <Row className="text-center flex-column justify-content-center align-content-center">
                        <label htmlFor="xlsx">Select xlsx file </label>
                        <input ref={this.xlsx} type="file" />
                    </Row>
                    <Row className="mt-2 text-center flex-column justify-content-center align-content-center">
                        <label htmlFor="appt">Enter file storage time in the format (MM:SS)</label>

                        <input type="time" id="appt" name="appt" ref={this.time} />

                        <small>The file can be stored from 1 second to 23 minutes</small>
                    </Row>
                    <Row className="mt-2 text-center flex-column justify-content-center align-content-center">
                        <label htmlFor="json-files">Paste JSON file</label>
                        <input id="json-file" ref={this.json} type="text" accept="application/JSON" />
                    </Row>
                    <Row className="mt-2 justify-content-center align-content-center">
                        <button type="button" onClick={this.fileHandler.bind(this)} className="btn btn-dark">Submit</button>
                    </Row>
                </Container>
                <Container style={this.state.inputData.isLoaded ? { display: 'block' } : { display: 'none' }} >
                    <Row className="text-center flex-column justify-content-center align-content-center">
                        <p>Name of the file: {this.state.fileData.name}</p>
                        <p>Size: {this.state.fileData.size}</p>
                        <p>Remaining file storage time: {this.state.inputData.time}</p>
                    </Row>
                    <Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    {this.state.inputData.json.length === 0 ? null : Object.keys(this.state.inputData.json[0]).map((key) => {
                                        return <th key={key}>{key.toUpperCase()}</th>
                                    })
                                    }
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    (this.state.inputData.json || []).map(brand => {
                                        return (
                                            <>
                                                <tr key={brand.id}>
                                                    <td>{brand.id}</td>
                                                    <td>{brand.name}</td>
                                                    <td>{brand.color}</td>
                                                </tr>
                                                {
                                                    (brand.child || []).map(childBrand => {
                                                        return (
                                                            <tr key={childBrand.id}>
                                                                <td>{childBrand.id}</td>
                                                                <td>{childBrand.name}</td>
                                                                <td>{childBrand.color}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }


                                            </>

                                        )
                                    })}
                            </tbody>

                        </Table>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Home;