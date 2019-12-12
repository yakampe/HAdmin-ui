import React, { Component } from 'react';
import AddPayer from './AddPayer';
import AddTransaction from './AddTransaction';
import UploadTransactions from './UploadTransactions';
import DisplayMessage from './DisplayMessage.js';
import DisplayLoading from './DisplayLoading.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ReactTooltip from 'react-tooltip'
import { ninvoke } from 'q';

class Transactions extends Component {

    constructor(props) {
        super(props);
        const date = new Date();
        this.state = {
            isLoading: true,
            transactions: [],
            toDate: date,
            fromDate: date,
            billed: false,
            addPayerModalOpen: false,
            transactionIdForModal: null,
            addTransactionModalOpen: false,
            uploadStatementModalOpen: false,
            displayMessageModalOpen: false,
            contentIsLoading: false,

            displayMessage: null,
            displayType: null,

            updatingFilters: false,
            filters: {
                owner: 'default'
            }
        }

        this.handleSetFromDate = this.handleSetFromDate.bind(this);
        this.handleSetToDate = this.handleSetToDate.bind(this);

        this.handleSetPayer = this.handleSetPayer.bind(this);

        this.highlightLastActionRow = this.highlightLastActionRow.bind(this);
        this.createNewTransaction = this.createNewTransaction.bind(this);
        this.createNewBill = this.createNewBill.bind(this);
        this.uploadStatement = this.uploadStatement.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        
        

        this.toggleIncludeBilledTransactions = this.toggleIncludeBilledTransactions.bind(this);
        this.updateFilters = this.updateFilters.bind(this);
        this.updateOwnerFilter = this.updateOwnerFilter.bind(this);
        
    }



        

    componentDidMount() {
        this.fetchTransactionsByDate(this.state.fromDate, this.state.toDate, this.state.billed);
    }

    componentWillUnmount() {

    }



    handleSetFromDate(date) {
        this.fetchTransactionsByDate(date, this.state.toDate, this.state.billed);

    }

    handleSetToDate(date) {
        this.fetchTransactionsByDate(this.state.fromDate, date, this.state.billed);
    }

    createNewTransaction() {
        this.setState({
            addTransactionModalOpen: true
        });
        this.fetchTransactionsByDate(this.state.fromDate, this.state.toDate, this.state.billed);
    }

    uploadStatement() {
        this.setState({
            uploadStatementModalOpen: true
        })
    }

    updateFilters() {
        this.setState({
            updatingFilters: true
        })
    }

    
    updateOwnerFilter(event) {
        this.setState({
            filters: {
                owner: event.target.value
            }
        })
    }

    displayMessage(message, type) {
        this.setState({
            displayMessage: message,
            displayType: type,
            displayMessageModalOpen: true
        })
    }

    toggleIncludeBilledTransactions(){
        this.setState({
            billed: !this.state.billed
        }, () => {
            this.fetchTransactionsByDate(this.state.fromDate, this.state.toDate, this.state.billed)        
        })

    }

    //TODO: Call the endpoint end return a modal with the created details
    // modal will contain : Total per payee, dates, and a link to go to the bill. (bills -> bill)
    createNewBill() {
        let date = this.state.fromDate;
        let fromDateString = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + `/` + date.getFullYear();
        date = this.state.toDate;
        let toDateString = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + `/` + date.getFullYear();

        const url = `http://localhost:8080/bills/?from=${fromDateString}&to=${toDateString}`;
        console.log(url)
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(
                function (data) {
                    //TODO: TAKE THIS DATA AND PUT IT IN THE MODAL FOR INFO! See top of method for description.
                    //const parsedResponse = JSON.stringify(data);
                }
            )
    }

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

    handleSetPayer(transaction) {
        this.setState({
            addPayerModalOpen: true,
            transactionForModal: transaction
        });
    }

    highlightLastActionRow(transactionId) {
        this.fetchTransactionsByDate(this.state.fromDate, this.state.toDate, this.state.billed);
    }


    async fetchTransactionsByDate(fromDateArgument, toDateArgument, billed) {

        this.setState({
            contentIsLoading: true
        });

        let fromDateString = ('0' + fromDateArgument.getDate()).slice(-2) + '/' + ('0' + (fromDateArgument.getMonth() + 1)).slice(-2) + `/` + fromDateArgument.getFullYear();
        let toDateString = ('0' + toDateArgument.getDate()).slice(-2) + '/' + ('0' + (toDateArgument.getMonth() + 1)).slice(-2) + `/` + toDateArgument.getFullYear();
        

        const url = `http://localhost:8080/transactions/?from=${fromDateString}&to=${toDateString}&billed=${billed}`;
        


        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(data =>
                this.setState({
                    transactions: data,
                    isLoading: false,
                    contentIsLoading: false,
                    toDate: toDateArgument,
                    fromDate: fromDateArgument
                }));
    }

    render() {
        const {transactions, isLoading, filters, billed, contentIsLoading} = this.state;
        let debitTotal = 0;
        let creditTotal = 0;

        const listHeaders = (
            <React.Fragment>
                <tr>
                    <th>Date</th>
                    <th>
                    <select className="mt-3" defaultValue="" onChange={(e) => this.updateOwnerFilter(e)}>>
                                            <option value="default">Owner</option>
                                            {
                                                [...new Set(transactions.map(x => x.owner))].map(owner => {
                                                    return (
                                                        <option key={owner}>{owner}</option>
                                                    )
                                                })
                                            }
                                        </select>

                    </th>
                    <th>Description</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Payees</th>
                    <th></th>
                </tr>
            </React.Fragment>
        )


        const transactionList = transactions
        .filter(tx => filters.owner !== 'default' ? tx.owner === filters.owner : true)
        .map(transaction => {
            debitTotal = debitTotal + transaction.debit;
            creditTotal = creditTotal + transaction.credit;

            return <React.Fragment key={transaction.id}>
                <tr>
                <td className="align-middle">
                    {transaction.date}
                </td>
                <td className="align-middle">
                    {transaction.owner}
                </td>
                <td className="align-middle text-left pl-5">
                    {transaction.description}
                </td>
                <td className="align-middle">
                    {transaction.debit != null ? transaction.debit : "-"}
                </td>
                <td className="align-middle">
                    {transaction.credit != null ? transaction.credit : "-"}
                </td>
                <td className="align-middle">
                    {transaction.payments.length !== 0 ? transaction.payments.map(payment => {
                        return (
                            <React.Fragment key={payment.id}>
                                <span className="badge badge-success" data-tip data-for={payment.id.toString()} >{payment.payeeName} @ {Math.floor(payment.totalToPay / transaction.debit * 100)}%</span>
                                <ReactTooltip id={payment.id.toString()} aria-haspopup='true' role='example' >
                                    <div className="d-flex justify-content-between ">
                                        <p className="p-2">
                                            <b>Total to pay:</b>
                                        </p>
                                        <p className="p-2">
                                            <i>{payment.totalToPay}</i>
                                        </p>
                                    </div>
                                    <div className="d-flex justify-content-between ">
                                        <p className="p-2">
                                            <b>Notes:</b>
                                        </p>
                                        <p className="p-2 pl-5">
                                            <i>{payment.notes}</i>
                                        </p>
                                    </div>
                                </ReactTooltip>
                                <br />
                            </React.Fragment>
                        )
                    }) :
                    <React.Fragment>
                            <span className="badge badge-warning">None</span>
                        </React.Fragment>
                    }
                </td>
                <td className="align-middle">

                    <div className="dropdown">
                        <a className="btn btn-info dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Action
                        </a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <a className="dropdown-item" onClick={() => this.handleSetPayer(transaction)}>Set Payer</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <a className="dropdown-item" href="#">Something else here</a>
                        </div>
                    </div>
                </td>
            </tr>
        </React.Fragment>
        });


        if (isLoading) {
            return (
                <div>
                    <DisplayLoading/>
                </div>
            )
        }

        
        return (
            <div>
                <h3 className="font-italic pl-2 pb-2">
                    Transactions
                </h3>
                <div className="table-responsive">
                    <table className="table table-sm table-striped text-center border ">
                        <thead>
                            <tr>
                                <td colSpan="100%" >
                                    <div className="d-flex justify-content-between bd-highlight mb-3">

                                        <div className="p-2 pl-4 w-100 text-left">
                                            <DatePicker
                                                className="mt-3"
                                                dateFormat="dd/MM/yyyy"
                                                selected={this.state.fromDate}
                                                onChange={this.handleSetFromDate} />
                                            <DatePicker
                                                className="mt-3"

                                                dateFormat="dd/MM/yyyy"
                                                selected={this.state.toDate}
                                                onChange={this.handleSetToDate} />
                                        </div>
                                        <div className="p-2 pl-4 w-100 text-right">
                                            <p className="text-success font-italic mt-3">{creditTotal}</p>
                                            <p className="text-danger font-italic">{debitTotal}</p>
                                        </div>


                                    </div>
                                    <hr></hr>
                                    <div className="p-2 pl-4 w-100 text-left">
                                            <button  onClick={this.toggleIncludeBilledTransactions} className="btn btn-info mr-2">{billed ? 'Exclude': 'Include'} billed transactions</button>
                                    </div>
                                </td>
                            </tr>

                            {listHeaders}
                        </thead>
                        <tbody>                            
                            {contentIsLoading ? 
                                <tr>
                                    <td colSpan="100%" className="bg-white">
                                    <DisplayLoading/>
                                </td>
                                </tr>
                                 : transactionList.length === 0 ? 
                                 <tr>
                                    <td colSpan="100%" className="bg-white">
                                    <i>No Results to display </i>
                                </td>
                                </tr>
                                : transactionList}
                        </tbody>
                    </table>
                </div>
                <div className="content-end">
                    {//TODO:Style the buttons
                    }
                    <button onClick={this.uploadStatement} className="btn btn-success mr-2">Upload statement</button>
                    <button onClick={this.createNewTransaction} className="btn btn-info mr-2">Add Transaction</button>
                    {//TODO: BILL NEEDS DATA VALIDATION - if no payment dont do anything!
                    }
                    <button onClick={this.createNewBill} className="btn btn-warning">Create Bill</button>
                </div>
                {this.state.addTransactionModalOpen ? <AddTransaction component={this} /> : null}
                {this.state.addPayerModalOpen ? <AddPayer transaction={this.state.transactionForModal} component={this} /> : null}
                {this.state.uploadStatementModalOpen ? <UploadTransactions component={this}/> : null}
                {this.state.displayMessageModalOpen ? <DisplayMessage displayType={this.state.displayType} displayMessage={this.state.displayMessage} component={this}/> : null}
            </div>
        )

    }

}


export default Transactions;
