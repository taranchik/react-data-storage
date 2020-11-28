import React from 'react'
import { Container, Row, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const DataInformation = () => {
    const INITIAL_STATE_INPUT_DATA = {
        xlsx: [],
        json: [],
        aggregatedData: [],
        time: null,
        isLoaded: false
    }

    const INITIAL_STATE_FILE_DATA = {
        name: null,
        size: null
    }

    const [inputData, setInputData] = React.useState(INITIAL_STATE_INPUT_DATA);

    React.useEffect(() => {
        const parsedInputData = localStorage.getItem("inputData") ? JSON.parse(localStorage.getItem("inputData")) : INITIAL_STATE_INPUT_DATA;
        setInputData(parsedInputData)
    }, [])

    const [fileData, setFileData] = React.useState(
        INITIAL_STATE_FILE_DATA
    );

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

    return (
        <Container style={inputData.isLoaded ? { display: 'block' } : { display: 'none' }} >
            <Row>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>BRAND</th>
                            <th>COLOR</th>
                            <th>QUANTITY</th>
                            <th>DATE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            (inputData.aggregatedDataKeys || []).map((key) => {
                                return (
                                    <tr key={key}>
                                        <td>{key}</td>
                                        <td>{inputData.aggregatedData[key].brand}</td>
                                        <td>{inputData.aggregatedData[key].color}</td>
                                        <td>{inputData.aggregatedData[key].date.length}</td>
                                        <td>{inputData.aggregatedData[key].date.map(
                                            (elem, index) => { return (index !== 0) ? ', ' + elem : elem })}</td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}

export default DataInformation;