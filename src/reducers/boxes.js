function boxes(state = [], action) {
  switch (action.type) {
    case 'ADD_BOX':
      console.log('In ADD_BOX left ', action.box.left);
      let newState = {
        ...state,
        [action.box.node.type + (Object.keys(state).length + 1)]: action.box,
      };

      console.log('In ADD_BOX ', state);
      return newState;
    case 'ADD_CONNECTOR':
      state[action.connector.nodeId].node.connections[
        action.connector.connectorType
      ] = [
        ...state[action.connector.nodeId].node.connections[
          action.connector.connectorType
        ],
        action.connector.connectFromNodeId,
      ];

      return state;
    case 'REMOVE_BOX':
      return [
        // from the start to the one we want to delete
        ...state.slice(0, action.boxId),
        // after the deleted one, to the end
        ...state.slice(action.boxId + 1),
      ];
    default:
      return state;
  }
  return state;
}

export default boxes;
