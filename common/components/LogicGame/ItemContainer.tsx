import React, { useEffect, useRef, useState } from "react";
import { ItemContainerProps } from "./models";
import Item from "./Item";
import { Col, Row } from "react-bootstrap";
import { useLogicGameContext } from "./context";

const ItemContainer: React.FC<ItemContainerProps> = (props) => {
  const { items, indx } = props;
  const { itemCount, selectContainer, selectedContainer } =
    useLogicGameContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemHeight, setItemHeight] = useState<string>("75%");

  const complete =
    items.length === itemCount && items.every((item) => items[0] === item);

  const clickHandler = () => {
    if (complete) {
      return;
    }
    // We want the last item to be selected
    selectContainer(props);
  };

  // Method to calculate the height of the items based on the container size
  // This way it scales across devices smoothly
  const calculateHeight = (): void => {
    if (!containerRef.current) {
      setItemHeight("75%");
      return;
    }
    const height = containerRef.current.clientHeight;
    const width = containerRef.current.clientWidth;

    let calc = height / itemCount;
    if (calc > width) {
      calc = width * 0.75;
    }
    setItemHeight(`${calc - 0.5}px`);
  };

  // Setup the event listener for resizing
  useEffect(() => {
    calculateHeight();
    window.addEventListener("resize", calculateHeight);
    return () => {
      window.removeEventListener("resize", calculateHeight);
    };
  }, []);

  const className = `logic-game-item-container border border-1 ${
    complete
      ? "border-success complete"
      : selectedContainer?.indx === indx
      ? "border-info bg-dark selected"
      : "border-primary"
  }`;

  return (
    <Col
      lg={1}
      xs={2}
      ref={containerRef}
      style={{
        marginTop: itemHeight,
      }}
      className={className}
      onClick={clickHandler}
    >
      <Row className="h-100 flex-column-reverse align-items-center justify-content-start">
        {items.map((item, index) => (
          <Item key={index} item={item} height={itemHeight} />
        ))}
      </Row>
    </Col>
  );
};

export default ItemContainer;
