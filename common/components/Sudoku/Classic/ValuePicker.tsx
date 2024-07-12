import React, { useState } from "react";
import { Button, ButtonGroup, Col, Row, ToggleButton } from "react-bootstrap";

interface ValuePickerProps {
  onValueSelected: (value: number, isSuggestion: boolean) => void;
  onClear: () => void;
}

const ValuePicker: React.FC<ValuePickerProps> = ({
  onValueSelected,
  onClear,
}) => {
  const [isSuggestion, setIsSuggestion] = useState(false);

  const handleValueClick = (value: number) => {
    onValueSelected(value, isSuggestion);
  };

  const handleClear = () => {
    onClear();
  };

  const mode = isSuggestion ? "outline-info" : "outline-primary";

  return (
    <Col xs="auto">
      <Row className="d-flex flex-column align-items-center">
        <ButtonGroup className="mb-2">
          <ToggleButton
            id="toggle-value"
            type="radio"
            variant={mode}
            name="radio"
            value="value"
            checked={!isSuggestion}
            onChange={() => setIsSuggestion(false)}
          >
            Value
          </ToggleButton>
          <ToggleButton
            id="toggle-suggestion"
            type="radio"
            variant={mode}
            name="radio"
            value="suggestion"
            checked={isSuggestion}
            onChange={() => setIsSuggestion(true)}
          >
            Suggestion
          </ToggleButton>
        </ButtonGroup>
      </Row>

      <Row
        className="d-flex flex-wrap justify-content-center"
        style={{ maxWidth: "200px" }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Col xs={4}>
            <Button
              key={num}
              variant={mode}
              className="m-1"
              style={{ width: "40px", height: "40px" }}
              onClick={() => handleValueClick(num)}
            >
              {num}
            </Button>
          </Col>
        ))}
      </Row>
      <Row className="d-flex justify-content-center">
        <Button variant="outline-danger" className="mt-2" onClick={handleClear}>
          Clear
        </Button>
      </Row>
    </Col>
  );
};

export default ValuePicker;
