import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';

export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = { activeItem: this.props.activeItem, modalerror: false }
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value }
        this.setState({activeItem})
    }

    handleSubmit = (onSave, e, item) => {
        if (parseFloat(item.target_price)) {
            onSave(e, item)
        } else {
            e.preventDefault()
            this.setState({ modalerror: true })
        }
    }
    
    render() {
        const { toggle, onSave } = this.props;
        const ERROR_MESSAGE = 'Please enter a valid price!'
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Game to Watch List</ModalHeader>
                <Form onSubmit={(e) => this.handleSubmit(onSave, e, this.state.activeItem)}>
                    <ModalBody>
                        <FormGroup>
                            <Label for="target_price">Target Price</Label>
                            <Input 
                                type="text" name="target_price" value={this.state.activeItem.target_price}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        { this.state.modalerror && 
                            <p className='error modal-error'>{ERROR_MESSAGE}</p>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" type="submit" onClick={(e) => this.handleSubmit(onSave, e, this.state.activeItem)}>
                            Save
                        </Button>
                        <Button color="danger" onClick={() => toggle()}>
                            Cancel
                        </Button>
                </ModalFooter>
                </Form>
            </Modal>
        )
    }
}