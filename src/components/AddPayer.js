import React, { Component, useState, useEffect } from 'react';

class AddPayer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            payers: [],
            payments: [],
            submitted: false,
            actionOnTransactionId: ''
        }

        this.closeModal = this.closeModal.bind(this);
        this.confirmPayment = this.confirmPayment.bind(this);
    }

    componentDidMount() {
        this.fetchAllPayers();
    }

    async fetchAllPayers() {
        const url = `http://localhost:8080/payer/`;
        fetch(url)
            .then(response => response.json())
            .then(data => this.setState({ payers: data }));
    }

    componentWillUnmount() {

    }

    closeModal() {

        this.props.component.setState({
            addPayerModalOpen: false
        });
    }


    //TODO: Update endpoint to take the arguments in the body?
    async confirmPayment(payer) {
        const url = `http://localhost:8080/payment/?pid=${payer.id}&mid=${payer.transactionId}&ttp=${payer.totaltopay}&notes=${payer.notes}`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(response => response.json)
        .then(() => {
            this.props.component.highlightLastActionRow(payer.transactionId);
        })
    }



    render() {

        const tableHeader = (
            <thead>
                <tr>
                    <td>Name</td>
                    <td>Value</td>
                    <td>Notes</td>
                    <td></td>
                </tr>
            </thead>
        )

        return (
            <div className="overlay">
                <div className="row h-100 d-flex justify-content-center align-items-center">
                    <div className="col-md-3 bg-white rounded">
                        <div className="p-5">
                            <div className="font-italic text-center pb-5">
                                <h3>
                                    {this.props.transaction.description}
                                </h3>
                                <h4 className="text-danger">
                                    {this.props.transaction.debit}
                                </h4>
                            </div>
                            <table className="table table-sm">
                                {tableHeader}
                                <tbody>
                                    <PayerList onClick={this.confirmPayment} payers={this.state.payers} transactionId={this.props.transaction.id} />
                                </tbody>
                            </table>
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

function EachPayerRow({ payer, onClick, transactionId }) {
    const [totaltopay, setTotalToPay] = useState(payer.totalToPay);
    useEffect(() => {
        if (payer.totalToPay !== totaltopay) {
            setTotalToPay(payer.totalToPay);
        }
    }, [payer]);

    const [notes, setNotes] = useState(payer.notes);
    useEffect(() => {
        if (payer.notes !== notes) {
            setNotes(payer.notes);
        }
    }, [payer]);

    return (
        <tr>
            <td>
                {payer.name}
            </td>
            <td>
                <input totaltopay={totaltopay || ''} onChange={e => setTotalToPay(e.target.value)} className="form-control form-control-sm" />
            </td>
            <td>
                <input notes={notes || ''} onChange={e => setNotes(e.target.value)} className="form-control form-control-sm" />
            </td>
            <td>
                <button onClick={e => onClick({ ...payer, totaltopay, notes, transactionId })}> save </button>
            </td>
        </tr>
    )
}

function PayerList({ payers, onClick, transactionId }) {
    return (
        <React.Fragment>
            {payers.map(payer => (
                <EachPayerRow key={payer.id} payer={payer} onClick={onClick} transactionId={transactionId} />
            ))}
        </React.Fragment>
    );
}

export default AddPayer;