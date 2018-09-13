export function addBox(box) {
  return {
    type: 'ADD_BOX',
    box,
  };
}

export function removeBox(boxId) {
  return {
    type: 'REMOVE_BOX',
    boxId,
  };
}

export function addNode(node) {
  return {
    type: 'ADD_NODE',
    node,
  };
}

export function addConnector(connector) {
  return {
    type: 'ADD_CONNECTOR',
    connector,
  };
}
