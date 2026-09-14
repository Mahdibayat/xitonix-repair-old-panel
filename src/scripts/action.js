import { Actions } from '../scripts/settings';

const OpenMenu = (data) => ({
    type: Actions.OPEN_MENU,
    payload: data
});

const SetRoute = (data) => ({
    type: Actions.SET_ROUTE,
    payload: data
});

const UpdateUser = (data) => ({
    type: Actions.UPDATE_USER,
    payload: data
});

export { OpenMenu, SetRoute, UpdateUser };