import React, { Component } from "react";
import './Home.css'

class Home extends Component {
    constructor(props) {
        super(props)

    }

    render() {
        return (
            <div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <form method="post" action="#" id="#">




                                <div className="form-group files">
                                    <label>Upload Your File </label>
                                    <input type="file" className="form-control" multiple="" />
                                </div>


                            </form>


                        </div>
                        <div className="col-md-6">
                            <form method="post" action="#" id="#">




                                <div className="form-group files color">
                                    <label>Upload Your File </label>
                                    <input type="file" className="form-control" multiple="" />
                                </div>


                            </form>


                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;