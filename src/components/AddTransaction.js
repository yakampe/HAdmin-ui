import React, { Component, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';

class AddTransaction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            payers: [],
            payments: [],
            submitted: false,
            actionOnTransactionId: '',
            transactionDate: '',
            transactionDescription: '',
            transactionCredit: '',
            transactionDebit: ''
        }
        this.closeModal = this.closeModal.bind(this);
        this.confirmAddTransaction = this.confirmAddTransaction.bind(this);
        
        this.changeTransactionDate = this.changeTransactionDate.bind(this);
        this.changeTransactionDescription = this.changeTransactionDescription.bind(this);
        this.changeTransactionCredit = this.changeTransactionCredit.bind(this);
        this.changeTransactionDebit = this.changeTransactionDebit.bind(this);
    }

    componentDidMount() {
    }


    componentWillUnmount() {
    }

    closeModal() {

        this.props.component.setState({
            addTransactionModalOpen: false
        });
    }

    changeTransactionDate(date){
        this.setState({
            transactionDate: date
        })
    }
    
    changeTransactionDescription(event){
        this.setState({
            transactionDescription: event.target.value
        })
    }
    
    changeTransactionCredit(event){
        this.setState({
            transactionCredit: event.target.value
        })
    }

    changeTransactionDebit(event){
        this.setState({
            transactionDebit: event.target.value
        })
    }

    //TODO: needs validation if empty save!!! due to SLICING.
    async confirmAddTransaction() {
        let date = this.state.transactionDate;
        let dateString = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + `/` + date.getFullYear();
        const url = `http://localhost:8080/transactions/`;
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{
                date: dateString,
                description: this.state.transactionDescription,
                credit: this.state.transactionCredit,
                debit: this.state.transactionDebit,
            }])
        }).then(response => response.json)
            .then(() => {
                this.props.component.highlightLastActionRow();
            })
        this.closeModal();
        
    }

    render() {

        const tableHeader = (
            <thead className="text-center">
                <tr>
                    <td>Date</td>
                    <td>Description</td>
                    <td>Credit</td>
                    <td>Debit</td>
                </tr>
            </thead>
        )

        return (
            <div className="overlay">
                <div className="row h-100 d-flex justify-content-center align-items-center">
                    <div className="col-md-4 bg-white rounded">
                        <div className="pt-5 pr-5 pb-2 pl-5">
                            <div className="font-italic text-center pb-5">
                                <h3>
                                    Create new Transaction
                                </h3>
                            </div>
                            <table className="table">
                                {tableHeader}
                                <tbody>
                                    <tr>
                                        <td>

                                    <DatePicker
                                    className="form-control form-control-sm"
                            dateFormat="dd/MM/yyyy"
                            selected={this.state.transactionDate}
                            onChange={this.changeTransactionDate} />
                            </td>
                                        <td><input type="text" className="form-control form-control-sm" onChange={(e) => this.changeTransactionDescription(e)}/></td>
                                        <td><input type="text" className="form-control form-control-sm" onChange={(e) => this.changeTransactionCredit(e)}/></td>
                                        <td><input type="text" className="form-control form-control-sm" onChange={(e) => this.changeTransactionDebit(e)}/></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.confirmAddTransaction}>Save</button>
                            <button onClick={this.closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div >

        )
    }

}


export default AddTransaction;