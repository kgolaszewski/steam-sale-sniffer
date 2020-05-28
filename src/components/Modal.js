import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label } from 'reactstrap';

export default class CustomModal extends Component {
    constructor(props) {
        super(props);
        this.state = { activeItem: this.props.activeItem }
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value }
        this.setState({activeItem})
    }

    
    render() {
        const { toggle, onSave } = this.props;
        return (
            <Modal isOpen={true} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Game to Watch List</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="target_price">Target Price</Label>
                            <Input 
                                type="text" name="target_price" value={this.state.activeItem.target_price}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={() => onSave(this.state.activeItem)}>
                        Save
                    </Button>
                    <Button color="danger" onClick={() => toggle()}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        )
    }
}