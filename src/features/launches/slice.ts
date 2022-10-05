import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  Dictionary,
  EntityId,
  EntityState
} from "@reduxjs/toolkit";
import api, { Launch } from "../../app/api";
import { RootState } from "../../app/store";
import sortedUniq from "lodash/sortedUniq";
import filter from "lodash/filter";

const fetchLaunches = createAsyncThunk("launches/fetchAll", () =>
  api.fetchLaunches().then((response) => response.data)
);

const adapter = createEntityAdapter<Launch>({
  sortComparer: (a, b) => {
    return (
      a.country.localeCompare(b.country) ||
      a.family.localeCompare(b.family) ||
      a.launchVehicle.localeCompare(b.launchVehicle)
    );
  }
});

type Status = "fulfilled" | "pending" | "rejected" | "none";

interface LaunchesState extends EntityState<Launch> {
  status: Status;
  countries: Record<string, EntityId[]>;
  families: Record<string, EntityId[]>;
}

const initialState = adapter.getInitialState({
  status: "none" as Status,
  countries: {},
  families: {}
});

const slice = createSlice({
  name: "launches",
  initialState: adapter.getInitialState({
    status: "none" as Status,
    countries: {} as Record<string, EntityId[]>,
    families: {} as Record<string, EntityId[]>
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLaunches.fulfilled, (state, { payload }) => {
      adapter.setAll(state, payload);
      const countries: Record<string, EntityId[]> = {};
      const families: Record<string, EntityId[]> = {};
      payload.forEach(({ id, country, family }) => {
        if (country in countries) {
          countries[country].push(id);
        } else {
          countries[country] = [id];
        }
        if (family in families) {
          families[family].push(id);
        } else {
          families[family] = [id];
        }
      });
      state.status = "fulfilled";
    });
    builder.addCase(fetchLaunches.rejected, (state) => {
      adapter.removeAll(state);
      state.status = "rejected";
    });
    builder.addCase(fetchLaunches.pending, (state) => {
      state.status = "pending";
    });
  }
});

export default slice.reducer;

const {
  selectAll: selectAllLaunches,
  selectIds: selectLaunchIds,
  selectById: selectLaunchById,
  selectTotal: selectTotalLaunches
} = adapter.getSelectors<RootState>((state) => state.launches);

const getCountry = (_: unknown, country: string) => country;
const getFamily = (_: unknown, family: string) => family;

const getCountries = (launches: Launch[]) => {};

export const selectAllCountries = createSelector(
  selectAllLaunches,
  (launches) => sortedUniq(launches.map(({ country }) => country))
);

export const selectLaunchesByCountry = createSelector(
  selectAllLaunches,
  (_, country: string) => country,
  (launches, country) => filter(launches)
);
export const selectFamiliesByCountry = createSelector(selectAllLaunches);
