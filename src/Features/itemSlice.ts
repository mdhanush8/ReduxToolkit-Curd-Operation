import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface Item {
  id: number;
  name: string;
  age: number;
  phoneNumber: number;
  jobRole: string;
  email: string;
  isLoading: boolean;
  error: string | null;
}

interface ItemState {
  items: Item[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ItemState = {
  items: [],
  isLoading: false,
  error: null,
};

// GET Tasks from Server
export const getTasksFromServer = createAsyncThunk(
  "items/getTasksFromServer",
  async (_, { rejectWithValue }) => {
    const response = await fetch("http://localhost:8000/items");
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      return rejectWithValue("Failed to fetch data from the server");
    }
  }
);

export const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.items.push(action.payload);
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    setItems: (state, action: PayloadAction<Item[]>) => {
      state.items = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasksFromServer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasksFromServer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(getTasksFromServer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addItem, deleteItem, updateItem, setItems } = itemSlice.actions;
export default itemSlice.reducer;
