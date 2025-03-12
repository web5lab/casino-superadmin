import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { paymentInstance } from "../axios/axiosInstance";

export const GetUserData = createAsyncThunk(
    "global/getUserData",
    async () => {
        try {
            const Response = await axiosInstance.get(`/user`);
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);

export const GetCurrencies = createAsyncThunk(
    "global/getCurrencies",
    async () => {
        try {
            const Response = await paymentInstance.get(`/api/currencies/get-currencies`);
            console.log("api data", Response);
            return Response.data;
        } catch (err) {
            if (err) {
                throw err;
            }
        }
    }
);