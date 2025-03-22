import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInstance";

export const GetUserData = createAsyncThunk(
    "global/getUserData",
    async (token) => {
        try {
            const Response = await axiosInstance.get(`/auth/user-data`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const getTransactions = createAsyncThunk(
    "global/getTransactions",
    async (token) => {
        try {
            const Response = await axiosInstance.post(`/api/user/user-transactions`, {
                "casinoId": "67d08e00bc3e0f5336e30a5c"
            });
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);


export const logInApi = createAsyncThunk(
    "global/logInApi",
    async (data) => {
        try {
            const Response = await axiosInstance.post(`/api/auth/login`, data);
            return Response.data;
        } catch (err) {
            console.log("api data", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const getAllTransactionApi = createAsyncThunk(
    "global/getAllTransactionApi",
    async ({ token, casinoId }) => {
        try {
            const Response = await axiosInstance.post(`/api/client/all-trasactions`, { casinoId }, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            return Response.data;
        } catch (err) {
            console.log("api data", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const depositesApi = createAsyncThunk(
    "global/depositesApi",
    async ({ token, casinoId }) => {
        try {
            const Response = await axiosInstance.post(`/api/client/all-trasactions`, { casinoId, onlyDeposites: true }, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            return Response.data;
        } catch (err) {
            console.log("api data", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const withdrawalsApi = createAsyncThunk(
    "global/withdrawalsApi",
    async ({ token, casinoId }) => {
        try {
            const Response = await axiosInstance.post(`/api/client/all-trasactions`, { casinoId, onlyWithdrawls: true }, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            return Response.data;
        } catch (err) {
            console.log("api data", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const getCasinoSettingApi = createAsyncThunk(
    "global/getCasinoSettingApi",
    async ({ token, casinoId }) => {
        try {
            const Response = await axiosInstance.get(`/api/client/get-casino-setting/${casinoId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            return Response.data;
        } catch (err) {
            console.log("api data", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const getCasinoSubAdmins = createAsyncThunk(
    "global/getCasinoSubAdmins",
    async ({ token, casinoId }) => {
        try {
            const Response = await axiosInstance.get(`/api/client/get-casino-sub-admins?casinoId=${casinoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return Response.data;
        } catch (err) {
            console.log("api data", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const createCasinoSubAdminsApi = createAsyncThunk(
    "global/createCasinoSubAdminsApi",
    async ({ token, data }) => {
        try {
            const Response = await axiosInstance.post(`/api/client/create-casino-sub-admins`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return Response.data;
        } catch (err) {
            console.log("api data", err);
            if (err) {
                throw err;
            }
        }
    }
);

export const updateCasinoSettingApi = createAsyncThunk(
    "global/updateCasinoSettingApi",
    async ({ token, setting, casinoId }) => {
        try {
            const Response = await axiosInstance.post(`/api/client/update-casino-setting/${casinoId}`, { ...setting }, {
                headers: {
                    Authorization: `Bearer ${token}` // Add the token to the request headers
                }
            });
            return Response.data;
        } catch (err) {
            console.log("api data", err);
            if (err) {
                throw err;
            }
        }
    }
);