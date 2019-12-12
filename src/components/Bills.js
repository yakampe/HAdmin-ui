import React, { Component } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import DisplayLoading from './DisplayLoading.js';

class Bills extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            bills: [],
        }

    }

    componentDidMount() {
        this.fetchAllBills();
    }

    componentWillUnmount() {

    }


    async fetchAllBills() {
        const url = `http://localhost:8080/bills/`;

        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(data =>
                this.setState({
                    bills: data,
                    isLoading: false,
                }));
    }

    async deleteBill(billId) {
        const url = `http://localhost:8080/bills/${billId}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json)
            .then(() => {
                this.fetchAllBills();
            })
    }

    async viewBill(billId) {
        const url = `http://localhost:8080/bills/${billId}`;
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(response => response.json)
            .then(() => {
                this.fetchAllBills();
            })
    }

    render() {
        const { bills, isLoading } = this.state;

        const billHeaders = (
            <tr>
                <th>Date</th>
                <th>Total Credit</th>
                <th>Total Debit</th>
                <th>Payments</th>
                <th></th>
            </tr>

        )


        const billList = bills.map(bill => {
            return (
                <tr key={bill.id}>
                    <td className="align-middle">{bill.date}</td>
                    <td className="align-middle">{bill.totalCredit}</td>
                    <td className="align-middle">{bill.totalDebit}</td>
                    <td className="align-middle">
                    {bill.payments.map(payment => { return (
                        <span className="badge badge-success" key={payment.id}>{payment.payeeName} @ {payment.totalToPay}</span>
                    )
                    })}
                    </td>
                    <td>
                        <div className="dropdown">
                            <a className="btn btn-info dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Action
                        </a>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <a className="dropdown-item" href="#">Something else here</a>
                                <a className="dropdown-item" href="#" onClick={() => this.viewBill(bill.id)} >View bill</a>
                                <a className="dropdown-item" href="#" onClick={() => this.deleteBill(bill.id)}>Delete bill</a>
                            </div>
                        </div>

                    </td>
                </tr>
            )
        })

        if (isLoading) {
            return (
                <div>
                    <DisplayLoading/>
                </div>
            )
        }

        return (
            <div>
                <h3 className="font-italic pl-2 pb-2">Bills</h3>
                <div className="table-responsive">

                    <table className="table table-sm table-striped text-center border ">
                        <thead>
                            {billHeaders}
                        </thead>
                        <tbody>
                            {billList}
                        </tbody>
                    </table>
                </div>
                <div className="content-end">
                </div>
            </div>
        )

    }

}


export default Bills;
