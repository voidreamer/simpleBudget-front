// contexts/BudgetContext.jsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { budgetApi } from '../utils/api';

const BudgetContext = createContext();

// Action types
const ACTIONS = {
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_EXPANDED_CATEGORIES: 'SET_EXPANDED_CATEGORIES',
  SET_SELECTED_DATE: 'SET_SELECTED_DATE',
  TOGGLE_CATEGORY: 'TOGGLE_CATEGORY',
  SET_MODAL: 'SET_MODAL',
  SET_LOADING_STATE: 'SET_LOADING_STATE',
  UPDATE_CATEGORIES: 'UPDATE_CATEGORIES'
};

// Initial state
const initialState = {
  categories: {},
  isLoading: true,
  error: null,
  expandedCategories: [],
  selectedDate: null,
  modal: {
    isOpen: false,
    type: null,
    data: null
  },
  loadingStates: {
    addingCategory: false,
    addingSubcategory: false,
    addingTransaction: null, // will store subcategory id
    deletingTransaction: null, // will store transaction id
    changingMonth: false
  }
};

// Reducer
function budgetReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        isLoading: false
      };

    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ACTIONS.SET_LOADING_STATE:
      return {
        ...state,
        loadingStates: {
          ...state.loadingStates,
          [action.payload.type]: action.payload.id
        }
      };

    case ACTIONS.UPDATE_CATEGORIES:
      return {
        ...state,
        categories: action.payload
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ACTIONS.SET_EXPANDED_CATEGORIES:
      return {
        ...state,
        expandedCategories: action.payload
      };

    case ACTIONS.TOGGLE_CATEGORY:
      return {
        ...state,
        expandedCategories: state.expandedCategories.includes(action.payload)
          ? state.expandedCategories.filter(category => category !== action.payload)
          : [...state.expandedCategories, action.payload]
      };

    case ACTIONS.SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload
      };

    case ACTIONS.SET_MODAL:
      return {
        ...state,
        modal: {
          isOpen: action.payload.isOpen,
          type: action.payload.type,
          data: action.payload.data
        }
      };

    default:
      return state;
  }
}

// Provider component
export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  const loadBudgetData = useCallback(async (year, month) => {
    // Only show loading on initial load or month change
    if (!state.categories || Object.keys(state.categories).length === 0) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    } else {
      dispatch({
        type: ACTIONS.SET_LOADING_STATE,
        payload: { key: 'changingMonth', value: true }
      });
    }

    try {
      const data = await budgetApi.fetchBudgetData(year, month);
      dispatch({ type: ACTIONS.SET_CATEGORIES, payload: data });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      dispatch({
        type: ACTIONS.SET_LOADING_STATE,
        payload: { key: 'changingMonth', value: false }
      });
    }
  }, []);

  const silentlyUpdateData = useCallback(async (year, month) => {
    try {
      const data = await budgetApi.fetchBudgetData(year, month);
      dispatch({ type: ACTIONS.UPDATE_CATEGORIES, payload: data });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }, []);

  const setSelectedDate = useCallback((date) => {
    dispatch({ type: ACTIONS.SET_SELECTED_DATE, payload: date });
    const [month, year] = date.split(' ');
    loadBudgetData(year, month);
  }, [loadBudgetData]);

  const toggleCategory = useCallback((categoryName) => {
    dispatch({ type: ACTIONS.TOGGLE_CATEGORY, payload: categoryName });
  }, []);

  // Modal actions
  const openModal = useCallback((type, data = null) => {
    dispatch({
      type: ACTIONS.SET_MODAL,
      payload: { isOpen: true, type, data }
    });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({
      type: ACTIONS.SET_MODAL,
      payload: { isOpen: false, type: null, data: null }
    });
  }, []);

  // API actions
  const createCategory = useCallback(async (data) => {
    try {
      await budgetApi.createCategory(data);
      const [month, year] = state.selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.selectedDate, loadBudgetData]);

  const deleteCategory = useCallback(async (categoryId) => {
    try {
      await budgetApi.deleteCategory(categoryId);
      const [month, year] = state.selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.selectedDate, loadBudgetData]);

  const createSubcategory = useCallback(async (data) => {
    try {
      await budgetApi.createSubcategory(data);
      const [month, year] = state.selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.selectedDate, loadBudgetData]);

  const updateSubcategory = useCallback(async (id, data) => {
    try {
      await budgetApi.updateSubcategory(id, data);
      const [month, year] = state.selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.selectedDate, loadBudgetData]);

  const deleteSubcategory = useCallback(async (subcategoryId) => {
    try {
      await budgetApi.deleteSubcategory(subcategoryId);
      const [month, year] = state.selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.selectedDate, loadBudgetData]);

  const createTransaction = useCallback(async (data) => {
    dispatch({
      type: ACTIONS.SET_LOADING_STATE,
      payload: { key: 'addingTransaction', value: data.subcategory_id }
    });

    try {
      await budgetApi.createTransaction(data);
      // Silently update data without full reload
      const [month, year] = state.selectedDate.split(' ');
      await silentlyUpdateData(year, month);
    } catch (error) {
      console.error('Error creating transaction:', error);
    } finally {
      dispatch({
        type: ACTIONS.SET_LOADING_STATE,
        payload: { key: 'addingTransaction', value: null }
      });
    }
  }, [state.selectedDate, silentlyUpdateData]);

  const updateTransaction = useCallback(async (id, data) => {
    try {
      await budgetApi.updateTransaction(id, data);
      const [month, year] = state.selectedDate.split(' ');
      await loadBudgetData(year, month);
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [state.selectedDate, loadBudgetData]);

  const deleteTransaction = useCallback(async (id) => {
    dispatch({ 
      type: ACTIONS.SET_LOADING_STATE, 
      payload: { key: 'deletingTransaction', value: id }
    });

    try {
      await budgetApi.deleteTransaction(id);
      const [month, year] = state.selectedDate.split(' ');
      await silentlyUpdateData(year, month);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    } finally {
      dispatch({ 
        type: ACTIONS.SET_LOADING_STATE, 
        payload: { key: 'deletingTransaction', value: null }
      });
    }
  }, [state.selectedDate, silentlyUpdateData]);

  const value = {
    state,
    actions: {
      loadBudgetData,
      setSelectedDate,
      toggleCategory,
      openModal,
      closeModal,
      createCategory,
      deleteCategory,
      createSubcategory,
      updateSubcategory,
      deleteSubcategory,
      createTransaction,
      updateTransaction,
      deleteTransaction
    }
  };

  return (
    <BudgetContext.Provider value={value}>,
      {children}
    </BudgetContext.Provider>
  );
}

// Custom hook for using the budget context
export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}