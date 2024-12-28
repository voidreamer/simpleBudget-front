const API_BASE_URL = 'https://simplebudget-app.onrender.com/api';
// const API_BASE_URL = 'http://localhost:8001/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new ApiError(
      data.detail || 'An error occurred',
      response.status,
      data
    );
  }
  
  return data;
};

const transformBudgetData = (data) => {
  const transformed = {};
  if (Array.isArray(data)) {
    data.forEach(category => {
      transformed[category.name] = {
        id: category.id,
        budget: category.budget,
        items: category.subcategories.map(sub => ({
          id: sub.id,
          name: sub.name,
          allotted: sub.allotted,
          spending: sub.spending,
          transactions: sub.transactions || []
        }))
      };
    });
  }
  return transformed;
};

export const budgetApi = {
  async fetchBudgetData(year, month) {
    try {
      const response = await fetch(`${API_BASE_URL}/budget-summary/${year}/${month}`);
      const data = await handleResponse(response);
      return transformBudgetData(data);
    } catch (error) {
      console.error('Error fetching budget data:', error);
      throw error;
    }
  },

  async createCategory(data) {
    const response = await fetch(
      `${API_BASE_URL}/categories/?month=${data.month}&year=${data.year}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          budget: data.budget
        })
      }
    );
    return handleResponse(response);
  },
  
  async deleteCategory(categoryId) {
    console.log('API: Deleting category:', categoryId);
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete category');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error deleting category:', error);
      throw error;
    }
  },

  async createSubcategory(data) {
    const response = await fetch(`${API_BASE_URL}/subcategories/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async updateSubcategory(id, data) {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async deleteSubcategory(id) {
    const response = await fetch(`${API_BASE_URL}/subcategories/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  },

  async createTransaction(data) {
    const response = await fetch(`${API_BASE_URL}/transactions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: data.description,
        amount: data.amount,
        subcategory_id: data.subcategory_id,
        date: data.date
      })
    });
    return handleResponse(response);
  },

  async updateTransaction(id, data) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  async deleteTransaction(id) {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};