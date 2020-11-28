import React from "react";
import './Home.css';
import { Container, Row, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ExcelRenderer } from 'react-excel-renderer';

const Home = () => {
    const INITIAL_STATE_INPUT_DATA = {
        xlsx: [],
        json: [],
        aggregatedData: {},
        aggregatedDataKeys: [],
        time: null,
        isLoaded: false
    }

    const INITIAL_STATE_FILE_DATA = {
        name: null,
        size: null
    }

    const [inputData, setInputData] = React.useState(
        INITIAL_STATE_INPUT_DATA
    );

    const [fileData, setFileData] = React.useState(
        INITIAL_STATE_FILE_DATA
    );

    React.useEffect(() => {
        const parsedInputData = localStorage.getItem("inputData") ? JSON.parse(localStorage.getItem("inputData")) : INITIAL_STATE_INPUT_DATA;
        setInputData(parsedInputData)

        const parsedFileData = localStorage.getItem("fileData") ? JSON.parse(localStorage.getItem("fileData")) : INITIAL_STATE_FILE_DATA;
        setFileData(parsedFileData)
    }, [])

    React.useEffect(() => {
        const stringifiedFileData = JSON.stringify(fileData)
        localStorage.setItem("fileData", stringifiedFileData)

        const stringifiedInputData = JSON.stringify(inputData)
        localStorage.setItem("inputData", stringifiedInputData)
    }, [fileData, inputData])

    React.useEffect(() => {
        let interval = null;

        if (inputData.isLoaded) {
            interval = setInterval(() => {
                const time = inputData.time.split(':');
                let min = parseInt(time[0])
                let sec = parseInt(time[1])

                if (sec !== 0) {
                    sec--;
                } else if (min !== 0) {
                    min--;
                    sec = 59;
                } else {
                    setInputData(INITIAL_STATE_INPUT_DATA);
                    setFileData(INITIAL_STATE_FILE_DATA);
                    alert('The timer is over!');
                    window.location.reload();
                }

                if (min.toString().length === 1) {
                    min = "0" + min;
                }

                if (sec.toString().length === 1) {
                    sec = "0" + sec;
                }

                setInputData(prevState => ({
                    ...prevState,
                    time: min + ':' + sec
                }))
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [inputData.isLoaded, inputData.time])

    let xlsxInput = null;
    let timeInput = null;
    let jsonInput = null;

    function parseJSON(obj, result) {
        if (Array.isArray(obj)) {
            obj.forEach((elem) => {
                parseJSON(elem, result)
            })
        }
        else {
            let clone = { ...obj }
            let child = clone.child
            if (child !== undefined) {
                let arr = [];
                clone.child.forEach(elem => { arr.push(elem.name) });
                clone.child = arr;
                parseJSON(child, result)
            }
            result.push(clone);
        }
        return result
    }

    function fileHandler() {
        if (xlsxInput.files[0] === undefined || timeInput.value.length === 0 || jsonInput.value.length === 0) {
            alert('You have to fill all fields!');
            return;
        }

        var fileObj = xlsxInput.files[0];
        var json = JSON.parse(jsonInput.value);
        var time = timeInput.value;

        var parsedJSON = [];
        parsedJSON = parseJSON(json.brands, parsedJSON)
        parsedJSON = [...parsedJSON.sort((a, b) => parseFloat(a.id) - parseFloat(b.id))]

        setFileData({
            name: fileObj.name,
            size: fileObj.size
        });

        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.log(err);
            }
            else {
                let xlsxFile = resp.rows;
                xlsxFile.forEach((elem, index) => {
                    if (index !== 0) {
                        const dateObj = new Date((xlsxFile[index][2] - (25567 + 1)) * 86400 * 1000);
                        const year = dateObj.getUTCFullYear();
                        const month = (dateObj.getUTCMonth() + 1);
                        const day = (dateObj.getUTCDate() - 1);
                        xlsxFile[index][2] = year + '.'
                            + (month.toString().length === 1 ? '0' + month : month) + '.'
                            + (day.toString().length === 1 ? '0' + day : day);
                    }
                });

                let brandColors = [];
                parsedJSON.forEach((elem) => {
                    brandColors[elem.name] = elem.color;
                });

                var aggregatedData = {}

                xlsxFile.forEach((product) => {
                    if (aggregatedData[product[0]] !== undefined) {
                        aggregatedData[product[0]].date.push(product[2]);
                    } else {
                        aggregatedData[product[0]] = {
                            brand: product[1],
                            color: brandColors[product[1]],
                            date: new Array(1).fill(product[2])
                        }
                    }
                })
                delete aggregatedData["name"]

                setInputData({
                    xlsx: xlsxFile,
                    json: parsedJSON,
                    aggregatedData: aggregatedData,
                    aggregatedDataKeys: Object.keys(aggregatedData),
                    time: time,
                    isLoaded: true
                });
            }
        });
    }

    return (
        <div>
            <Container style={!inputData.isLoaded ? { display: 'block' } : { display: 'none' }} >
                <Row className="text-center flex-column justify-content-center align-content-center">
                    <label htmlFor="xlsx">Select xlsx file </label>
                    <input ref={(input) => { xlsxInput = input; }} type="file" />
                </Row>
                <Row className="mt-2 text-center flex-column justify-content-center align-content-center">
                    <label htmlFor="appt">Enter file storage time in the format (MM:SS)</label>

                    <input type="time" id="appt" name="appt" ref={(input) => { timeInput = input; }} />

                    <small>The file can be stored from 1 second to 23 minutes</small>
                </Row>
                <Row className="mt-2 text-center flex-column justify-content-center align-content-center">
                    <label htmlFor="json-files">Paste JSON file</label>
                    <input id="json-file" ref={(input) => { jsonInput = input; }} type="text" accept="application/JSON" />
                </Row>
                <Row className="mt-2 justify-content-center align-content-center">
                    <button type="button" onClick={fileHandler.bind(this)} className="btn btn-dark">Submit</button>
                </Row>
            </Container>
            <Container style={inputData.isLoaded ? { display: 'block' } : { display: 'none' }} >
                <Row className="text-center flex-column justify-content-center align-content-center">
                    <p>Name of the file: {fileData.name}</p>
                    <p>Size: {fileData.size}</p>
                    <p>Remaining file storage time: {inputData.time}</p>
                </Row>
                <Row>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                {inputData.json.length === 0 ? null : Object.keys(inputData.json[1]).map((key) => {
                                    return <th key={key}>{key.toUpperCase()}</th>
                                })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                (inputData.json || []).map(brand => {
                                    return (
                                        <tr key={brand.id}>
                                            <td>{brand.id}</td>
                                            <td>{brand.name}</td>
                                            <td>{brand.color}</td>
                                            <td>{brand.hasOwnProperty('child') ? brand.child.map(
                                                (child, index) => { return (index !== 0) ? ', ' + child : child }
                                            ) : 'None'}</td>
                                        </tr>
                                    )
                                })}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </div>
    )
}

export default Home;