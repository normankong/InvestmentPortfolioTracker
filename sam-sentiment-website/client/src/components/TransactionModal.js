import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from "moment";

export default function TransactionModal({
  handleClose,
  handleConfirm,
  show,
  txnData,
}) {
  const [quantity, setQuantity] = React.useState(100);
  const [price, setPrice] = React.useState(100);
  const [date, setDate] = React.useState(moment().format("YYYY-MM-DD"));
  
  const handleTxn = () => {
    if (price === "" || price < 0) {
      alert("Price cannot be negative");
      return;
    }
    if (quantity === "" || quantity < 0) {
      alert("Quantity cannot be negative");
      return;
    }
    if (moment(date).isAfter(moment())) {
      alert("Invalid Date or Date cannot be greater than today");
      return;
    }

    let symbol = txnData.symbol;
    let action = txnData.action;
    let result = {
      symbol,
      action,
      quantity,
      price,
      date,
    };
    handleConfirm(result);
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {txnData.action} {txnData.symbol}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Please input the transaction information:
          <Row xs={3} md={3} className="g-4">
            <Col>
              <FloatingLabel
                controlId="floatingQuantity"
                label="Quantity"
                className="mb-3"
              >
                <Form.Control
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingPrice"
                label="Price"
                className="mb-3"
              >
                <Form.Control
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FloatingLabel>
            </Col>
            <Col>
              <FloatingLabel
                controlId="floatingDate"
                label="Date"
                className="mb-3"
              >
                <Form.Control
                  type="date"
                  placeholder="Date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </FloatingLabel>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleTxn}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
