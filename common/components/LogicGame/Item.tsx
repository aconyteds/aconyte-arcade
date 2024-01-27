import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ITEM_ICONS, ItemType } from "./models";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faPoop } from "@fortawesome/free-solid-svg-icons";

export type ItemProps = {
  height: string;
  item: ItemType;
};

const Item: React.FC<ItemProps> = ({ item, height }) => {
  const icon = useMemo<IconProp>(() => {
    const currIcon = ITEM_ICONS.get(item);
    if (!currIcon) {
      return faPoop;
    }
    return currIcon;
  }, [item]);

  return (
    <div className="logic-game-item" style={{ height, width: height }}>
      <FontAwesomeIcon className="h-100 w-100" icon={icon} />
    </div>
  );
};

export default Item;
