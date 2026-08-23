import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProfileType = "personal" | "business";

export interface Profile {
  id: string;
  type: ProfileType;
  name: string;
  businessName?: string;
  gstNumber?: string;
}

interface ProfileState {
  profiles: Profile[];
  activeProfile: Profile | null;
}

const initialState: ProfileState = {
  profiles: [],
  activeProfile: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfiles(state, action: PayloadAction<Profile[]>) {
      state.profiles = action.payload;

      // Auto-select active profile if not set
      if (!state.activeProfile && action.payload.length > 0) {
        state.activeProfile = action.payload[0];
      }
    },

    setActiveProfile(state, action: PayloadAction<string>) {
      const profile = state.profiles.find(p => p.id === action.payload);
      if (profile) {
        state.activeProfile = profile;
      }
    },

    addProfile(state, action: PayloadAction<Profile>) {
      state.profiles.push(action.payload);
    },

    updateProfile(state, action: PayloadAction<Profile>) {
      const index = state.profiles.findIndex(
        p => p.id === action.payload.id
      );

      if (index !== -1) {
        state.profiles[index] = action.payload;

        if (state.activeProfile?.id === action.payload.id) {
          state.activeProfile = action.payload;
        }
      }
    },

    clearProfiles() {
      return initialState;
    },
  },
});

export const {
  setProfiles,
  setActiveProfile,
  addProfile,
  updateProfile,
  clearProfiles,
} = profileSlice.actions;

export default profileSlice.reducer;
