import React, { Component } from 'react';

class DisplayMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
    }


    componentWillUnmount() {
    }

    closeModal() {
        this.props.component.setState({
            displayMessageModalOpen: false
        });
    }


    render() {

    return (
        <div className="overlay">
            <div className="row h-100 d-flex justify-content-center align-items-center">
                <div className="col-md-4 bg-white rounded">
                    <div className="pt-5 pr-5 pb-2 pl-5">
                        <div className="font-italic text-center pb-5">
                            <img src="../img/error.svg"></img>
                            <h3>
                                {this.props.displayType}
                            </h3>
                        </div>
                            {this.props.displayMessage}
                    </div>
                    <div className="modal-footer">
                        <button onClick={this.closeModal}>Close</button>
                    </div>
                </div>
            </div>
        </div >

    )

    }

}


export default DisplayMessage;