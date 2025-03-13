import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../axios/axiosInstance";

export const GetCurrencies = createAsyncThunk(
    "global/GetCurrencies",
    async (token) => {
        try {
            const Response = await axiosInstance.get(`/api/currencies`, {
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

export const getCasinos = createAsyncThunk(
    "global/getCasinos",
    async (token) => {
        try {
            const Response = await axiosInstance.get(`/api/casinos`, {
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

export const createCasino = createAsyncThunk(
    "global/createCasino",
    async ({token,data}) => {
        try {
            const Response = await axiosInstance.get(`/api/casinos`,data, {
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