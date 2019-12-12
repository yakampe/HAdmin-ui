import React, { Component } from 'react';

class UploadTransactions extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statementTypes: [],
            uploadFile: null,
            fileType: '',
        }
        this.closeModal = this.closeModal.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    componentDidMount() {
        this.fetchStatementTypes();
    }


    componentWillUnmount() {
    }

    closeModal() {
        this.props.component.setState({
            uploadStatementModalOpen: false
        });
    }

    uploadFile(event) {
        this.setState({
            uploadFile: event.target.files[0]
        },
            () => console.log(this.state.uploadFile))
    }

    changeFileType(event) {
        this.setState({
            fileType: event.target.value
        })
    }

    async fetchStatementTypes(){
        const url = `http://localhost:8080/statement/statementTypes`;

        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then(data =>
                this.setState({
                    statementTypes: data,
                    isLoading: false
                }));
    }


    async sendFile(file, type) {
        const allData = new FormData();
        allData.append('file', file);
        const url = `http://localhost:8080/importCSV?id=${type}`;
        fetch(url, {
            method: 'POST',
            body: allData
        })
            .then(response => {
                if(response.status != '200') {
                    let rs = response.status;
                    this.props.component.displayMessage("Unable to upload or process the statement. No data has been added.",
                     "Error processing statement (" +rs+")")
                    console.log("ERROR")
                }
                return response.json
            })            
            .then(() => {
                this.props.component.highlightLastActionRow();
            })
        this.closeModal();
    }

    render() {
        const {statementTypes} = this.state;

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

        const statementTypeOptions = (
            statementTypes.map(type => {
                return <React.Fragment>
                    <option value={type.id}>{type.typeName}</option>
                    </React.Fragment>
         
            })
        )

        return (
            <div className="overlay">
                <div className="row h-100 d-flex justify-content-center align-items-center">
                    <div className="col-md-4 bg-white rounded">
                        <div className="pt-5 pr-5 pb-2 pl-5">
                            <div className="font-italic text-center pb-5">
                                <h3>
                                    Upload Statement
                                </h3>
                            </div>
                            <form>
                                <select onChange={(e) => this.changeFileType(e)}>
                                    <option value="" disabled selected>Select Type</option>
                                    {statementTypeOptions}
                                </select>
                                <input type="file" className="form-control form-control-sm" onChange={this.uploadFile} />
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => this.sendFile(this.state.uploadFile, this.state.fileType)}>Upload Transactions</button>
                            <button onClick={this.closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div >

        )
    }

}


export default UploadTransactions;