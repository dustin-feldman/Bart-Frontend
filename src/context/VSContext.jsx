import React, { createContext, useContext, useReducer } from "react";

const VSContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_VS_START":
      return { ...state, loading: true };
    case "FETCH_ALL_VS_SUCCESS":
      return { ...state, loading: false, vector_stores: [...action.payload] };
    case "FETCH_VS_ERROR":
      return { ...state, loading: false };
    case "CREATE_VS_SUCCESS":
      return { ...state, loading: false, vector_stores: [...state.vector_stores, { store_id: action.payload.id, store_name: action.payload.name, files: [] }] };
    case "DELETE_VS_SUCCESS":
      return {
        ...state,
        vector_stores: state.vector_stores.filter(
          (vs) => !action.payload.includes(vs.store_id)
        ),
      };
    case "FETCH_VS_SUCCESS":
      return { ...state, loading: false, vs: { ...action.payload } }
    case "UPLOAD_PDFS_SUCCESS":
      return { 
        ...state, 
        loading: false, 
        vs: { 
            ...state.vs, 
            files: [
                ...(state.vs?.files || []),
                ...action.payload.upload_results.map((file) => ({
                    file_id: file.file_id,
                    filename: file.filename
                }))
            ]
        },
        vector_stores: state.vector_stores.map((vs) => {
          if (vs.store_id === action.payload.store_id) {
              return {
                  ...vs,
                  files: [...vs.files, ...action.payload.upload_results.map((file) => ({
                      file_id: file.file_id,
                      filename: file.filename
                  }))]
              };
          }
          return vs;
      })
    };
    default:
      return state;
  }
};

const initialState = {
  vector_stores: [],
  loading: false,
  loadingText: '',
  vs: null
};

export const VSProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <VSContext.Provider value={{ state, dispatch }}>
      {children}
    </VSContext.Provider>
  );
};

export const useVSContext = () => useContext(VSContext);