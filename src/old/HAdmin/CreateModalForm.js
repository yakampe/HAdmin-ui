import React from 'react';
export default class createModalForm {

    constructor(obj, formObject) {
        this.modalBody = this.createModalForm(formObject);  
        obj.setState({
            showModal: true,
            modalData: this.modalBody
        });
        this.obj = obj;
    }

    createModalForm(formObject) {
        return (
            <div className="overlay">
                <div className="row h-100 d-flex justify-content-center align-items-center">
                    <div className="col-md-6 bg-white rounded">
                        <div className="p-5">
                            {formObject.render()}
                        </div>
                        <div class="modal-footer">
                            <button className="btn-outline-success rounded" type="button" onClick={() => formObject.submit(this.obj)}>Save</button>
                            <button className="btn-outline-danger rounded" type="button" onClick={() => this.closeModal(this.obj)}>Close</button>
                        </div>


                    </div>
                </div>

            </div >
        )


    }

    closeModal(obj){
        obj.setState({
            showModal: false,
            modalData: null
        });
    }

}