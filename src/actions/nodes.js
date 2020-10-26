import fetch from 'cross-fetch';
import * as types from '../constants/actionTypes';

const checkNodeStatusStart = (node) => {
  return {
    type: types.CHECK_NODE_STATUS_START,
    node
  };
};

const checkNodeStatusSuccess = (node, res) => {
  return {
    type: types.CHECK_NODE_STATUS_SUCCESS,
    node,
    res
  };
};

const checkNodeStatusFailure = node => {
  return {
    type: types.CHECK_NODE_STATUS_FAILURE,
    node,
  };
};

const checkNodeNodeDataBlocks = (node, dataBlock) => {
  return {
    type: types.CHECK_GET_NODE_DATA_BLOCKS,
    node,
    dataBlock
  };
};

//connect to Redux
export function handleGetDataNodeBlock(nodeSelected) {
  return (dispatch) => dispatch(callApiBlock(nodeSelected))
}

//Function with logic API get block
export function callApiBlock(nodeSelected){
  return async(dispatch) => {
    try {
    const resDataBlock = await fetch(`${nodeSelected.url}/api/v1/blocks`);
    if(resDataBlock.status >= 400) {
      dispatch(checkNodeStatusFailure(nodeSelected));
    }
    const dataBlock = await resDataBlock.json();
    dispatch(checkNodeNodeDataBlocks(nodeSelected, dataBlock)) //Function to conection redux
    } catch(err) {
      dispatch(checkNodeStatusFailure(nodeSelected));
    }
  }
}

export function checkNodeStatuses(list) {
  return (dispatch) => {
    list.forEach(node => {
      dispatch(checkNodeStatus(node));
    });
  };
}

export function checkNodeStatus(node) {
  return async (dispatch) => {
    try {
      dispatch(checkNodeStatusStart(node));
      const res = await fetch(`${node.url}/api/v1/status`);

      if(res.status >= 400) {
        dispatch(checkNodeStatusFailure(node));
      }

      const json = await res.json();

      dispatch(checkNodeStatusSuccess(node, json));
    } catch (err) {
      dispatch(checkNodeStatusFailure(node));
    }
  };
}
